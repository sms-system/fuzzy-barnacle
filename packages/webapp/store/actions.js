import types from './types'

export function setRepoList(data) {
  return {
    type: types.SET_REPO_LIST,
    payload: data
  }
}

export function setFileList(data) {
  return {
    type: types.SET_FILE_LIST,
    payload: data
  }
}

export function setRepoPos(data) {
  return {
    type: types.SET_REPO_POS,
    payload: data
  }
}