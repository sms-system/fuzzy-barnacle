import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'wouter'

import matched from '../../helpers/object-strings-matched'
import cancellablePromise from '../../helpers/cancelable-promise'
import getFileList from '../../data-sources/file-list'
import { setFileList, setRepoPos } from '../../store/actions'

import Layout from './layout/base/layout'

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
      <Link href={ location + '/foo' }>TEST</Link>
      <div>FileList, { JSON.stringify(fileList) }</div>
    </Layout>
  )
}