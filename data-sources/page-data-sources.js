import PAGES from '../components/pages/page-names'
import { getRepoList } from './index'

const baseDataSources = {
  text: async () => 'test'
}

const pageDataSources = {
  [ PAGES.REPO_LIST ]: {
    repoList: getRepoList
  }
}

export {
  baseDataSources,
  pageDataSources
}