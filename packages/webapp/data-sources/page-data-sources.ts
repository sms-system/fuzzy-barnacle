import PAGES from '../components/pages/page-names'
import * as sources from './index'
import * as actions from '../store/actions'
import REPO_VIEW from '../components/pages/repo-page-view-types'

const baseDataSources =  {
  text: [() => 'test'],
  repoList: [sources.getRepoList]
}

interface props {
  repo: string,
  branch: string,
  path: string,
  view_type: string
}

const pageDataSources = {
  [ PAGES.REPO_PAGE ]: (props: props) => {
    const { repo, branch = 'master', path, view_type  } = props
    switch (view_type) {
      case undefined:
      case REPO_VIEW.TREE: return {
        fileList: [sources.getFileList, actions.setFileList],
        repo: [() => repo],
        branch: [() => branch],
        path: [() => path]
      }
      case REPO_VIEW.BLOB: return {
        // fileContent: [sources.getFileContent, actions.setFileContent],
        repo: [() => repo],
        branch: [() => branch],
        path: [() => path]
      }
    }
  }
}

export {
  baseDataSources,
  pageDataSources
}