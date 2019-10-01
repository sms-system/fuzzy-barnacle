const { views } = require('redux')

module.exports = class extends views.DOMView {
  constructor (el, store) {
    super(el, store)
  }

  render ({ files }) {
    console.log(2, files)
    return files.map(file => `
      <div>${file.name}</div>
    `)
    .join('')
  }

  destroy() {
    super.destroy()
  }
}