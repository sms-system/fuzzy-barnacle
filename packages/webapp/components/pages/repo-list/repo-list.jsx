import React from 'react'

import Layout from '../layout/base/layout'
import Link from '../../link/link'
import Table from '../../table/table'
import { useSelector, useDispatch } from 'react-redux'
import { setRepoPos } from '../../../store/actions'

export default function RepoList () {
  const dispatch = useDispatch()
  const { repo, repoList } = useSelector((state) => state)
  if (repo) {
    dispatch(setRepoPos({ repo: undefined, branch: undefined, path: undefined }))
  }
  return (
    <Layout>
      <div className="Layout-Wrap"><div className="Layout-Scrollarea">
        <Table headers={[ 'Repository folder', '' ]} rows={
          repoList.map(repo =>
            [ <Link href={ `/${repo}` }>{repo}</Link>, '' ]
          )
        } />
      </div></div>
    </Layout>
  )
}


