import PAGES from '../components/pages/page-names'
import * as sources from './index'
import * as actions from '../store/actions'
import REPO_VIEW from '../components/pages/repo-page-view-types'

const baseDataSources = {
  text: [() => 'test'],
  repoList: [sources.getRepoList]
}

const pageDataSources = {
  [ PAGES.REPO_PAGE ]: ({ repo, branch, path, view_type }) => {
    switch (view_type) {
      case REPO_VIEW.TREE: return {
        fileList: [sources.getFileList, actions.setFileList],
        repo: [() => repo],
        branch: [() => branch],
        path: [() => path]
      }
      case REPO_VIEW.BLOB: return {
        // fileContent: [sources.getFileContent, actions.setFileContent]
      }
    }
  }
}

export {
  baseDataSources,
  pageDataSources
}