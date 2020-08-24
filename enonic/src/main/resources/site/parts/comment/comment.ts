import {Response} from "enonic-types/lib/controller";
import {pipe} from "fp-ts/lib/pipeable";
import {chain, fold, map} from "fp-ts/lib/IOEither";
import {errorResponse, ok} from "enonic-wizardry/lib/controller";
import {getRenderer} from "enonic-fp/lib/thymeleaf";
import {getContent} from "enonic-fp/lib/portal";
import {Content} from "enonic-types/lib/content";
import {Comment} from "../../content-types/comment/comment"

const view = resolve('./comment.html')
const renderer = getRenderer<ThymeleafParams>(view);
export function get(): Response {

  return pipe(
    getContent<Comment>(),
    map(createThymeleafParams),
    chain(renderer),
    fold(
      errorResponse('comment'),
      ok
    )
  )();
}


interface ThymeleafParams {
  title: string
  body: string
}

function createThymeleafParams(res: Content<Comment>): ThymeleafParams {
  return {
    title: res.data.title ?? '',
    body: res.data.body ?? ''
  }
}

