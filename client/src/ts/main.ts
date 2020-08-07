import "core-js/stable";

import {init} from "./components/Button";

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".btn").forEach((e) => init(e as HTMLElement));
});