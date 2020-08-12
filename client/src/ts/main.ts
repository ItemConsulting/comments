import "core-js/stable";

import {init} from "./components/Button";
import {init as initToggleComment} from "./components/CommentToggle";

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".comment-button").forEach((e) => init(e as HTMLElement));
    document.querySelectorAll(".comment-toggle").forEach((e) => initToggleComment(e as HTMLElement));
});