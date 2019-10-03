const OPENNED_CLASSNAME = 'Dropdown--is-openned'
const TITLE_CLASSNAME = 'Dropdown__current'
const BODY_MOBILE_THEME_CLASSNAME = 'Theme--mobile'
const BODY_LOCKED_CLASSNAME = '__locked'

function addBlurHandler (target, dropdown) {
  const listener = target.addEventListener('blur', (event) => {
    if (!dropdown) { dropdown = event.target }
    if (event.relatedTarget) {
      let parentNode = event.relatedTarget.parentNode
      while (parentNode) {
        if (parentNode === dropdown) {
          target.removeEventListener('blur', listener)
          addBlurHandler(event.relatedTarget, dropdown)
          return
        }
        parentNode = parentNode.parentNode
      }
    }
    const bodyClasses = document.body.classList
    if (bodyClasses.contains(BODY_MOBILE_THEME_CLASSNAME)) {
      bodyClasses.remove(BODY_LOCKED_CLASSNAME)
    }
    dropdown.classList.remove(OPENNED_CLASSNAME)
    delete dropdown.dataset.isOpenned
    target.removeEventListener('blur', listener)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const elements = document.getElementsByClassName('Dropdown')
  for (let i = 0; i < elements.length; i++) {
    let element = elements[i]
    let timer = {}
    element.addEventListener('focus', ((element, timer) => () => {
      // If wasn't click event for 0.8ms after focus, set openned state
      // Its adds side feature — long tap for dropdown content preview
      timer.isOpenned = setTimeout(() => element.dataset.isOpenned = true, 800)

      element.classList.add(OPENNED_CLASSNAME)

      const bodyClasses = document.body.classList
      if (bodyClasses.contains(BODY_MOBILE_THEME_CLASSNAME)) {
        bodyClasses.add(BODY_LOCKED_CLASSNAME)
      }
    })(element, timer))
    element.addEventListener('click', ((element, timer) => (event) => {
      let clickOnTitle = false
      let parentNode = event.target.parentNode
      while (parentNode) {
        if (parentNode.classList.contains(TITLE_CLASSNAME) || parentNode === element || event.target === element) {
          clickOnTitle = true
          break
        }
        parentNode = parentNode.parentNode
      }

      if (!clickOnTitle) { return }
      // If no openned state, prevent closing
      if (!element.dataset.isOpenned) {
        if (timer.isOpenned) { clearTimeout(timer.isOpenned) }
        element.dataset.isOpenned = true
        return
      }
      element.blur()
    })(element, timer))
    addBlurHandler(element, null)
  }
})