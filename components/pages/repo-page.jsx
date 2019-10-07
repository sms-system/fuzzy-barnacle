import React from 'react'
import imported from 'react-imported-component'

import REPO_VIEW from './repo-page-view-types'

const FileList = imported(() => import('./file-list'))
const NotFound = imported(() => import('./404'))

export default function RepoPage ({ params }) {
  if (!params.view_type) {
    return <FileList { ...params } />
  }
  switch (params.view_type) {
    case REPO_VIEW.TREE: return <FileList { ...params } />
    case REPO_VIEW.BLOB: return <div>Blob</div>
    default: return <NotFound />
  }
}