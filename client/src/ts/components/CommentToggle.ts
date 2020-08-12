function addCloseOnReset(detailsEl: HTMLElement) {
  const restButton = detailsEl.querySelector('button[type="reset"]');
  if(restButton) {
    restButton.addEventListener('click', () => {
      if(detailsEl.hasAttribute('open')) {
        detailsEl.removeAttribute('open')
      }
    })
  }
}

export function init(el: HTMLElement | null) {
  if (el) {
    addCloseOnReset(el)
  }
}
