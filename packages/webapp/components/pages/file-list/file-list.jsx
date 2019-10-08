import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'wouter'

import './file-list.styl'

import matched from '../../../helpers/object-strings-matched'
import cancellablePromise from '../../../helpers/cancelable-promise'
import getFileList from '../../../data-sources/file-list'
import { setFileList, setRepoPos } from '../../../store/actions'

import Layout from '../layout/base/layout'
import Tabs from '../../tabs/tabs'
import Table from '../../table/table'

export default function FileList ({ repo, branch, path }) {
  const dispatch = useDispatch()
  const fileList = useSelector(({ fileList }) => fileList)
  const currentRepoPos = useSelector(({ repo, branch, path }) => ({ repo, branch, path }))
  const [location] = useLocation()

  useEffect(() => {
    if ( matched(currentRepoPos, { repo, branch, path }) ) { return }

    const fileListPromise = cancellablePromise(getFileList({ repo, branch, path }))
    fileListPromise
      .then((data) => {
        dispatch(setRepoPos({ repo, branch, path }))
        dispatch(setFileList(data))
      })
      .catch((err) => {
        if (err === 'CANCEL') { return }
      })

    return () => { fileListPromise.cancel() }
  })

  return (
    <Layout>
      <div className="Layout-Wrap">
        <Tabs items={[
          { title: 'Files', url: '#', isActive: true },
          { title: 'Branches', url: location + '/foo', isActive: false }
         ]} />
      </div>
      <div className="Layout-Wrap"><div className="Layout-Scrollarea">
         <Table headers={[ 'Name', 'Last commit', 'Commit message', 'Committer', 'Updated' ]} rows={[
           ['api', 'd53dsv', '[vcs] move http to arc', 'noxoomo', '4 s ago'],
           ['api', 'd53dsv', '[vcs] move http to arc', 'noxoomo', '4 s ago']
         ]} />
      </div></div>
    </Layout>
  )
}