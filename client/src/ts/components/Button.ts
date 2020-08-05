export function init (el: HTMLElement | null) {
    if (el) {
        el.addEventListener('click', () => {
            alert('Button clicked')
        })
    }
}
