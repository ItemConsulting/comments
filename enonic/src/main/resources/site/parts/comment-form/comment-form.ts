import {Request, Response} from "enonic-types/lib/controller";
import {pipe} from "fp-ts/lib/pipeable";
import {getContent} from "enonic-fp/lib/portal";
import {Comment} from "../../content-types/comment/comment";
import {fold, map, chain} from "fp-ts/lib/IOEither";
import {errorResponse, ok} from "enonic-wizardry/lib/controller";
import {getRenderer} from "enonic-fp/lib/thymeleaf";
import {Content} from "enonic-types/lib/content";

const view = resolve('./comment-form.html')
const renderer = getRenderer<ThymeleafParams>(view);

export function get(req: Request): Response {

  return pipe(
    getContent<Comment>(),
    map(createThymeleafParams),
    chain(renderer),
    fold(
      errorResponse('commentForm'),
      ok
    )
  )()
}

interface ThymeleafParams {
  readonly title: string
  readonly body: string
}

function createThymeleafParams (comment: Content<Comment>): ThymeleafParams {
  return {
    title: comment.data.title,
    body: comment.data.body
  }
}