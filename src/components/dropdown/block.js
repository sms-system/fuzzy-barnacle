var OPENNED_CLASSNAME = 'Dropdown--is-openned'

function addBlurHandler (target, dropdown) {
  var listener = target.addEventListener('blur', function (event) {
    if (!dropdown) { dropdown = event.target }
    if (event.relatedTarget) {
      var parentNode = event.relatedTarget.parentNode
      while (parentNode) {
        if (parentNode === dropdown) {
          target.removeEventListener('blur', listener)
          addBlurHandler(event.relatedTarget, dropdown)
          return
        }
        parentNode = parentNode.parentNode
      }
    }
    dropdown.classList.remove(OPENNED_CLASSNAME)
    target.removeEventListener('blur', listener)
  })
}

document.addEventListener('DOMContentLoaded', function () {
  var elements = document.getElementsByClassName('Dropdown')
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i]
    element.addEventListener('focus', function (event) {
      var Dropdown = event.target
      Dropdown.classList.add(OPENNED_CLASSNAME)
    })
    addBlurHandler(element, null)
  }
})