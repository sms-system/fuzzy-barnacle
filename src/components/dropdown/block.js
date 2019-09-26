var OPENNED_CLASSNAME = 'Dropdown--is-openned'

function addBlurHandler (target, dropdown) {
  var listener = target.addEventListener('blur', function (event) {
    if (!dropdown) { dropdown = event.target }
    var classes = event.relatedTarget? event.relatedTarget.classList : []
    for (var i = 0; i < classes.length; i++) {
      if (classes[i].indexOf('Dropdown') === 0) {
        target.removeEventListener('blur', listener)
        addBlurHandler(event.relatedTarget, dropdown)
        return
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