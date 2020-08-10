import {Request, Response} from "enonic-types/lib/controller";
import {pipe} from "fp-ts/lib/pipeable";
import {getContent, serviceUrl} from "enonic-fp/lib/portal";
import {fold, map, chain, ioEither, right} from "fp-ts/lib/IOEither";
import {errorResponse, ok} from "enonic-wizardry/lib/controller";
import {getRenderer} from "enonic-fp/lib/thymeleaf";
import {Content, QueryResponse} from "enonic-types/lib/content";
import { Article } from "../../content-types/article/article";
import {sequenceT} from "fp-ts/lib/Apply";
import {getChildren} from "enonic-fp/lib/content";
import {tupled} from "fp-ts/lib/function";
import {Comment} from "../../content-types/comment/comment";

const view = resolve('./article-form.html')
const renderer = getRenderer<ThymeleafParams>(view);
export function get(req: Request): Response {

  return pipe(
    getContent<Article>(),
    chain((article: Content<Article>) => {
      return sequenceT(ioEither)(
        getChildren<Comment>(article._id),
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
  readonly comments: Comment[]
  readonly serviceUrl: string
  readonly parentPath: string
  readonly pathSelf: string
}

function createThymeleafParams(res: QueryResponse<Comment>,article: Content<Article>, path: string ): ThymeleafParams {
  return {
    title: article.data.title,
    body: article.data.body,
    comments: res.hits.map((content: Content<Comment>) => content.data),
    serviceUrl: serviceUrl('comment'),
    parentPath: article._path,
    pathSelf: path
  }
}