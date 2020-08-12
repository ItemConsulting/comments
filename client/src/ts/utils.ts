export function appendChildren (elements: Element[], wrapper: Element) {
    elements.forEach((e) => {
        wrapper.appendChild(e);
    })
}
export function createElement (type: string, content?: string) {
    const el = document.createElement(type)
    if (content) {
        el.innerHTML = `${content}`
    }
    return el;
}

export function addClass (className: string[], el: Element) {
  className.forEach((c) => {
    el.classList.add(c)
  })
}
