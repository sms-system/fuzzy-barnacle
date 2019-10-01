const FilesStore = require('./logic/store')

const FilterView = require('./logic/views/FilterField')
const TextView = require('./logic/views/Text')

const store = new FilesStore()

new FilterView(
  document.getElementById('text'),
  store
)

new FilterView(
  document.getElementById('text2'),
  store
)

new TextView(
  document.getElementById('res'),
  store
)