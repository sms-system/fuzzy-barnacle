import React from 'react'
import imported from 'react-imported-component'

import REPO_VIEW from './repo-page-view-types'

const Home = imported(() => import('./repo-list/repo-list'))
const FileList = imported(() => import('./file-list/file-list'))
const FileContent = imported(() => import('./file-content/file-content'))
const NotFound = imported(() => import('./404/404'))

import PAGES from './page-names'

export default {
  [PAGES.HOME]: { path: '/', component: Home },
  [PAGES.REPO_LIST]: { path: '/repos', component: Home },
  [PAGES.REPO_PAGE]: { path: '/repos/:repo/:view_type?/:branch?/:path*', component: ({ params }) => {
    switch (params.view_type) {
      case undefined:
      case REPO_VIEW.TREE: return <FileList { ...params } />
      case REPO_VIEW.BLOB: return <FileContent { ...params } />
      default: return <NotFound />
    }
  } }
}