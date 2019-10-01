const types = {
  INIT: '@@init',
  SET_FILTER: 'SET_FILTER',
  SET_LOADING_STATE: 'SET_LOADING_STATE',
  SET_FILES_LIST: 'SET_FILES_LIST'
}

const createAction = (type) => (payload) => ({ type, payload })

module.exports = {
  types,
  action: {
    setFilter: createAction(types.SET_FILTER),
    setLoadingState: createAction(types.SET_LOADING_STATE),
    setFilesList: createAction(types.SET_FILES_LIST)
  }
}