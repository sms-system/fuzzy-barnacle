const { views } = require('redux')

module.exports = class extends views.DOMView {
  constructor (el, store) {
    super(el, store)
  }

  render ({ filter }) {
    return `<b>${filter}</b>`
  }

  destroy() {
    super.destroy()
  }
}