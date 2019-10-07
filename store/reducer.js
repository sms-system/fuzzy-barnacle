import types from './types'

export default function (state, action) {
  switch (action.type) {
    case types.SET_FILE_LIST:
      return {
        ...state,
        fileList: action.payload
      }
    case types.SET_REPO_LIST:
      return {
        ...state,
        repoList: action.payload
      }
    case types.SET_REPO_POS:
      return {
        ...state,
        repo: action.payload.repo,
        branch: action.payload.branch,
        path: action.payload.path,
      }
    default:
      return state
  }
}