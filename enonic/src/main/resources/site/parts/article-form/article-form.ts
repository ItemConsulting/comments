import {Request, Response} from "enonic-types/lib/controller";
import {pipe} from "fp-ts/lib/pipeable";
import {getContent, serviceUrl} from "enonic-fp/lib/portal";
import {chain, fold, ioEither, map, right} from "fp-ts/lib/IOEither";
import {errorResponse, ok} from "enonic-wizardry/lib/controller";
import {getRenderer} from "enonic-fp/lib/thymeleaf";
import {Content, QueryResponse} from "enonic-types/lib/content";
import {Article} from "../../content-types/article/article";
import {sequenceT} from "fp-ts/lib/Apply";
import {reduce, sort} from "fp-ts/lib/Array";
import {getChildren} from "enonic-fp/lib/content";
import {tupled} from "fp-ts/lib/function";
import {Comment} from "../../content-types/comment/comment";
import {contramap, ordBoolean} from "fp-ts/lib/Ord";

const view = resolve('./article-form.html')
const renderer = getRenderer<ThymeleafParams>(view);
export function get(req: Request): Response {

  return pipe(
    getContent<Article>(),
    chain((article: Content<Article>) => {
      return sequenceT(ioEither)(
        getChildren<Comment>({
          count: 200,
          key:article._id
        }),
        right(article),
        right(req.path)
      )
    }),
    map(tupled(createThymeleafParams)),
    chain(renderer),
    fold(
      errorResponse('articleForm', true),
      ok
    )
  )();
}


interface ThymeleafParams {
  readonly title: string
  readonly body: string
  readonly comments: ContentTree<Comment>[]
  readonly serviceUrl: string
  readonly parentPath: string
  readonly pathSelf: string
}

function createThymeleafParams(res: QueryResponse<Comment>,article: Content<Article>, path: string ): ThymeleafParams {
  return {
    title: article.data.title,
    body: article.data.body,
    comments: createCommentTree(res.hits),
    serviceUrl: serviceUrl('comment'),
    parentPath: article._path,
    pathSelf: path
  }
}

function notNullOrUndefined(str: string | undefined): boolean {
  return (str !== undefined) && (str !== null);
}

const byParentFirst = pipe(
  ordBoolean,
  contramap((c: Content<Comment>) => notNullOrUndefined(c.data.parentId))
)

export function childrenToParent (acc: ContentTree<Comment>[], curr: Content<Comment>): ContentTree<Comment>[] {
  if(curr.data.parentId) {
    const parent = acc.filter((item) => item._id === curr.data.parentId)[0];
    if(parent) { // only add child when there is a parent (dont show reply to comments that have been deleted)
      const children = parent.children ?? []
      parent.children = [...children, curr]
    }
    return acc
  } else {
    return [...acc, curr]
  }
}

interface ContentTree<T> extends Content {
  children?: Content[]
}
export function createCommentTree (list: ReadonlyArray<Content<Comment>>):ContentTree<Comment>[] {
  return pipe(
    list,
    sort(byParentFirst),
    reduce([], childrenToParent)
  )
}