import {Request, Response} from "enonic-types/lib/controller";
import {pipe} from "fp-ts/lib/pipeable";
import {fold} from "fp-ts/lib/IOEither";
import {errorResponse, redirect} from "enonic-wizardry/lib/controller";
import {forceArray} from "enonic-wizardry/lib/array";
import {createAndPublish} from "enonic-wizardry/lib/content";
import {sanitize} from "enonic-fp/lib/common";
import {Comment} from '../../site/content-types/comment/comment'

export function post(req: Request): Response {
  const title = forceArray(req.params.title)[0]
  const body = forceArray(req.params.body)[0]
  const parentId = forceArray(req.params.parentId)[0]
  const parentPath = forceArray(req.params.parentPath)[0]
  const pathSelf = forceArray(req.params.pathSelf)[0]

  return pipe(
    createAndPublish<Comment>({
      parentPath,
      data: {
        title,
        body,
        parentId
      },
      name: sanitize(title + new Date().toISOString()),
      displayName: title,
      contentType:`${app.name}:comment`
    }),
    fold(
      errorResponse('commentService', true),
      () => redirect(pathSelf)
    )
  )()
}