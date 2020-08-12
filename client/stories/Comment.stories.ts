import {withKnobs} from '@storybook/addon-knobs';
import {init as initToggleComment} from "../src/ts/components/CommentToggle";
import '../src/scss/main.scss'

export default {
  title: 'Comment',
  decorators: [withKnobs]
};

export const CommentToggle = () => {
  const el = document.createElement('div');
  el.innerHTML = comment()
  initToggleComment(el.querySelector('.comment-toggle'))
  return el;
}

export const ReplyToComment = () => {
  const el = document.createElement('div');
  el.innerHTML = commentResponse()
  el.querySelectorAll(".comment-toggle").forEach((e) => initToggleComment(e as HTMLElement))
  return el
}


const commentResponse = () => `
<ul class="comment-comment-list">
  <li class="comment-comment-list-item" >
    <h3 class="comment-comment-title">Title 1</h3>
    <p class="comment-comment-body">Comment Comment Comment Comment Comment Comment Comment Comment </p>
    <details class="comment-toggle" >
        <summary class="comment-toggle-button">
            Respond to comment
        </summary>
    <form class="comment-form"
          data-th-action="/"
          method="post" >
      <label class="comment-form-label"
             for="comment-title">Title</label>
      <input class="comment-form-input" id="comment-title-0" name="title"
             type="text">
      <label class="comment-form-label"
             for="comment-body">Reply</label>
      <textarea class="comment-form-textarea"
                id="comment-body-0"
                name="body"></textarea>
      <input data-th-value="parentPath"
             name="parentPath"
             type="hidden">
      <input data-th-value="pathSelf"
             name="pathSelf"
             type="hidden">
      <input data-th-value="parentid"
             name="parentId"
             type="hidden">
      <div class="comment-form-button-wrapper">
        <button class="comment-btn-secondary" type="reset">Cancel</button>
        <button class="comment-btn-primary" type="submit">Reply</button>       
      </div>
    </form>
    </details>
    
    <ul class="comment-response-list">
      <li class="comment-response-list-item" >
        <h4 class="comment-response-title">Title 1</h4>
        <p class="comment-response-body">Response Response Response Response Response Response Response Response </p>
      </li>
      <li class="comment-response-list-item" >
        <h4 class="comment-response-title">Title</h4>
        <p class="comment-response-body">Response Response Response Response Response </p>
      </li>
      <li class="comment-response-list-item" >
        <h4 class="comment-response-title">Title</h4>
        <p class="comment-response-body">ResponseResponseResponseResponse </p>
      </li>
    </ul>
  </li>
  <li class="comment-comment-list-item" >
    <h3 class="comment-comment-title">Title comment 2</h3>
    <p class="comment-comment-body">Comment 2 Comment 2 Comment 2 Comment 2 Comment 2 Comment 2 Comment 2 Comment 2 </p>
    <details class="comment-toggle" >
    <summary>
        Respond to comment
    </summary>
    <form class="comment-form"
          data-th-action="/"
          method="post" >
      <label class="comment-form-label"
             for="comment-title">Title</label>
      <input class="comment-form-input" id="comment-title-0" name="title"
             type="text">
      <label class="comment-form-label"
             for="comment-body">Reply</label>
      <textarea class="comment-form-textarea"
                id="comment-body-0"
                name="body"></textarea>
      <input data-th-value="parentPath"
             name="parentPath"
             type="hidden">
      <input data-th-value="pathSelf"
             name="pathSelf"
             type="hidden">
      <input data-th-value="parentid"
             name="parentId"
             type="hidden">
      <div class="comment-form-button-wrapper">
        <button class="comment-btn-secondary" type="reset">Cancel</button>
        <button class="comment-btn-primary" type="submit">Reply</button>       
      </div>
    </form>
</details>
    
    <ul class="comment-response-list">
      <li class="comment-response-list-item" >
        <h4 class="comment-response-title">Title 1</h4>
        <p class="comment-response-body">Response Response Response Response Response Response Response Response </p>
      </li>
      <li class="comment-response-list-item" >
        <h4 class="comment-response-title">Title</h4>
        <p class="comment-response-body">Response Response Response Response Response </p>
      </li>
      <li class="comment-response-list-item" >
        <h4 class="comment-response-title">Title</h4>
        <p class="comment-response-body">ResponseResponseResponseResponse </p>
      </li>
    </ul>
  </li>
</ul>
         `

const comment = () => `
    <details class="comment-toggle">
      <summary class="comment-toggle-button" >
           Leave a comment
      </summary>
      <form class="comment-form" action="" method="post">
          <label class="comment-form-label" for="comment-title">Title</label>
          <input id="comment-title" class="comment-form-input" name="title" type="text">
          <label class="comment-form-label"  for="comment-body">Comment</label>
          <textarea id="comment-body" class="comment-form-textarea" name="body"></textarea>
          <input data-th-value="parentPath" name="parentPath" type="hidden">
          <input data-th-value="pathSelf" name="pathSelf" type="hidden">
          <div class="comment-form-button-wrapper">
            <button class="comment-btn-secondary" type="reset">Cancel</button>
            <button class="comment-btn-primary" type="submit">Comment</button>
          </div>
      </form>
    </details>
    `