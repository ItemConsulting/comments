import {Request, Response} from "enonic-types/lib/controller";
import {pipe} from "fp-ts/lib/pipeable";
import {
  assetUrl,
  getComponent,
  getContent,
  loginUrl,
  logoutUrl,
  pageUrl,
  processHtml,
  serviceUrl
} from "enonic-fp/lib/portal";
import {chain, fold, ioEither, IOEither, map, right} from "fp-ts/lib/IOEither";
import {errorResponse, ok} from "enonic-wizardry/lib/controller";
import {getRenderer} from "enonic-fp/lib/thymeleaf";
import {Content, QueryResponse} from "enonic-types/lib/content";
import {sequenceT} from "fp-ts/lib/Apply";
import * as A from "fp-ts/lib/Array";
import {query} from "enonic-fp/lib/content";
import {flow, tupled} from "fp-ts/lib/function";
import {Comment} from "../../content-types/comment/comment";
import {findUsers, getUser} from "enonic-fp/lib/auth";
import {User} from "enonic-types/lib/context";
import {EnonicError} from "enonic-fp/lib/errors";
import {contramap, ordBoolean} from "fp-ts/lib/Ord";
import {isSome, Option} from "fp-ts/lib/Option";
import {CommentsListPartConfig} from "./comments-list-part-config";
import {Component} from "enonic-types/lib/portal";
import {formatWithOptions, parseISO,} from "date-fns/fp";

type CommentsListPart = Component<CommentsListPartConfig>
export type UserMapping = Record<string, string>;

const view = resolve('./comments-list.html')
const renderer = getRenderer<ThymeleafParams>(view);


export function get(req: Request): Response {
  return pipe(
    sequenceT(ioEither)(
      getComponent<CommentsListPartConfig>(),
      getContent(),
    ),
    chain(tupled((part: CommentsListPart, content: Content) => {
      return sequenceT(ioEither)(
        query<Comment>({
          count: 100,
          query: `_parentPath LIKE '/content${content._path}'`,
          contentTypes: [`${app.name}:comment`]
        }),
        right(part),
        right(content._path)
      )
    })),
      chain(tupled((
        resComments: QueryResponse<Comment>,
        part: CommentsListPart,
        parentPath: string,
      ) => {
        return sequenceT(ioEither)(
          getUserMapping(resComments.hits),
          right(resComments.hits),
          right(getUser()),
          right(part),
          right(parentPath),
        )
      })),
      chain(tupled((
        userMapping: UserMapping,
        comments: ReadonlyArray<Content<Comment>>,
        user: Option<User>,
        part: CommentsListPart,
        parentPath: string,
      ) => {
        return sequenceT(ioEither)(
          renderer(createThymeleafParams(userMapping, comments, isSome(user), req.path, part.config,  parentPath)),
          right(part.config.includeCss === 'true')
        )
      })),
      fold(
        errorResponse('commentList', true),
        tupled((res: string, includeCss: boolean) => ok(res, includePageContributions(includeCss)))
      )
    )();
}

function cssLink() {
  return `<link
           rel="stylesheet"
           href="${assetUrl({path: 'design-system/bundle.css'})}" />`
}

function includePageContributions (includeCss: boolean) {
  return includeCss ? {
    pageContributions: {
      headEnd: cssLink()
    }
  } : undefined
}

export function getUserMapping(res: ReadonlyArray<Content<Comment>>): IOEither<EnonicError, UserMapping> {

  const set = res.map((c) => `"${c.creator}"`).join(',')

  return pipe(
    findUsers({
      start: 0,
      count: 100,
      query: set.length > 0 ? `_id IN (${set})` : ''
    }),
    map((u) => u.hits.reduce((acc: UserMapping, curr: User) => {
      acc[curr.key] = curr.displayName;
      return acc
    }, {}))
  )
}

interface ThymeleafParams {
  readonly comments: ReadonlyArray<ContentTree>
  readonly serviceUrl: string
  readonly parentPath?: string
  readonly pathSelf: string
  readonly loginUrl?: string;
  readonly logOut?: string
  readonly isAuthenticated: boolean;
}

function createThymeleafParams(
  userMapping: UserMapping,
  comments: ReadonlyArray<Content<Comment>>,
  isAuthenticated: boolean,
  path: string,
  partConfig: CommentsListPartConfig,
  parentPath: string,
): ThymeleafParams {
  return {
    comments: createCommentsTree(userMapping, partConfig.headingTag)(comments),
    serviceUrl: serviceUrl('comment'),
    parentPath: parentPath,
    pathSelf: path,
    loginUrl: getLoginUrl(partConfig.loginPageId),
    logOut: logoutUrl({}),
    isAuthenticated
  }
}
function getLoginUrl(partLoginPageId?: string) {

  return app.config.loginPageId ?
    pageUrl(app.config.loginPageId) :
    partLoginPageId ?
    pageUrl(partLoginPageId) :
    loginUrl({});
}

function notNullOrUndefined(str: string | undefined): boolean {
  return (str !== undefined) && (str !== null);
}

export const byParentFirst = pipe(
  ordBoolean,
  contramap((c: Content<Comment>) => notNullOrUndefined(c.data.parentId))
)

export function childrenToParent(acc: ReadonlyArray<ContentTree>, curr: ContentTree): ReadonlyArray<ContentTree> {
  if (curr.parentId) {
    return acc.map((comment: ContentTree) => {
      if(comment._id === curr.parentId) {
        const children = comment.children ?? []
        return {...comment, children: [...children, curr]} as ContentTree
      }
      return comment
    })
  } else {
    return [...acc, curr]
  }
}

export interface ContentTree {
  _id: string
  title: string
  body: string
  createdTime: string
  createdTimeDisplay: string
  parentId?: string,
  creatorDisplayName?: string;
  children?: ReadonlyArray<ContentTree>
}

type HeadingTag = "h2" | "h3" | "h4" | "h5"
const commentResponseMap: Record<HeadingTag, string> = {
  h2: "h3",
  h3: "h4",
  h4: "h5",
  h5: "h6"
}

export function createCommentsTree(userMapping: UserMapping, headingTag: HeadingTag): (c: ReadonlyArray<Content<Comment>>) => ReadonlyArray<ContentTree> {
  return flow(A.sort(byParentFirst), A.map(createCommentTree(headingTag, userMapping)), A.reduce([], childrenToParent))
}
function createCommentTree (headingTag: HeadingTag, userMapping: UserMapping) {
  return function mapCommentToContentTree(comment: Content<Comment>) {
    const heading = createTemplateTag(headingTag, comment.data)
    return {
      _id: comment._id,
      heading:  processHtml({value: heading}),
      title: comment.data.title,
      body: comment.data.body,
      creatorDisplayName: userMapping[comment.creator],
      parentId: comment.data.parentId,
      createdTime: comment.createdTime,
      createdTimeDisplay: pipe(
        comment.createdTime,
        parseISO,
        formatWithOptions({}, 'dd.MM.yyyy')
      )
    }
  }
}

function createTemplateTag (headingTag: HeadingTag, comment: Comment) {
  const tag = mapCommentResponseHeading(headingTag, comment)
  return`<${tag} class="${notNullOrUndefined(comment.parentId) ? 'comment-response-heading': 'comment-comment-heading'}">${comment.title}</${tag}>`
}

function mapCommentResponseHeading(headingTag: HeadingTag, comment: Comment){
  if(notNullOrUndefined(comment.parentId)) {
    return commentResponseMap[headingTag]
  }
  return headingTag
}
