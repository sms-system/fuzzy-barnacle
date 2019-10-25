import types from './types'

export function setRepoList(data: any) {
  return {
    type: types.SET_REPO_LIST,
    payload: data
  }
}

export function setFileList(data: any) {
  return {
    type: types.SET_FILE_LIST,
    payload: data
  }
}

export function setRepoPos(data: any) {
  return {
    type: types.SET_REPO_POS,
    payload: data
  }
}