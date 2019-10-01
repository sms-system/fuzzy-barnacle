const { Store } = require('redux')

const logger = require('./middlewares/logger')

const filesList = (state, action) => {
  switch (action.type) {
    case '@@init':
      return { filter: '', files: [], isLoading: false }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    case 'SET_LOADING_STATE':
      return { ...state, isLoading: action.payload }
    case 'SET_FILES_LIST':
      return { ...state, files: action.payload }
    default:
      return state
  }
}

class FilesStore extends Store {
  constructor () { super(filesList) }
  dispatch (action) {
    const parentDispatch = super.dispatch.bind(this)
    const dispatch = logger(parentDispatch)
    dispatch(action)
  }
}

module.exports = FilesStore