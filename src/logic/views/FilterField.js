const { views } = require('redux')
const { action } = require('../actions')

const INPUT_TYPE = 'input'

module.exports = class extends views.DOMView {
  constructor (el, store) {
    super(el, store)
    this._val = ''
    this._el.addEventListener(INPUT_TYPE, this._onInput.bind(this))
  }

  _onInput(event) {
    this._val = event.target.value
    this._store.dispatch(action.setFilter(this._val))
  }

  shouldUpdate ({ filter }) {
    return filter !== this._val
  }

  render ({ filter }) {
    this._val = filter
    return `<input value="${filter}">`
  }

  destroy() {
    super.destroy()
    this._el.removeEventListener(INPUT_TYPE, this._onInput)
  }
}