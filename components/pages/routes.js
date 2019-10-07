import React from 'react'
import imported from 'react-imported-component'

import REPO_VIEW from './repo-page-view-types'

const Home = imported(() => import('./repo-list/repo-list'))
const FileList = imported(() => import('./file-list/file-list'))
const NotFound = imported(() => import('./404/404'))

import PAGES from './page-names'

export default {
  [PAGES.REPO_LIST]: { path: '/', component: Home },
  [PAGES.REPO_PAGE]: { path: '/:repo/:view_type?/:branch?/:path*', component: ({ params }) => {
    if (!params.view_type) {
      return <FileList { ...params } />
    }
    switch (params.view_type) {
      case REPO_VIEW.TREE: return <FileList { ...params } />
      case REPO_VIEW.BLOB: return <div>Blob</div>
      default: return <NotFound />
    }
  } }
}