import React from 'react'

import Layout from '../layout/base/layout'
import Link from '../../link/link'
import Table from '../../table/table'
import { useSelector, useDispatch } from 'react-redux'
import { setRepoPos } from '../../../store/actions'

export default function RepoList () {
  const dispatch = useDispatch()
  const stateData: any = useSelector((state) => state)
  const { repo, repoList } = stateData
  if (repo) {
    dispatch(setRepoPos({ repo: undefined, branch: undefined, path: undefined }))
  }
  return (
    repoList.length? (<Layout breadcrumbs={[]}>
      <div className="Layout-Wrap"><div className="Layout-Scrollarea">
        <Table headers={[ 'Repository folder', '' ]} rows={
          repoList.map((repo: string) =>
            [ <Link href={ `/repos/${repo}` }>{repo}</Link>, '' ]
          )
        } />
      </div></div>
    </Layout>) : <>500</>
  )
}


