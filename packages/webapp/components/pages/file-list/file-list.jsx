import React, { useEffect, useState } from 'react'
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'wouter'

import './file-list.styl'

import cancellablePromise from '../../../helpers/cancelable-promise'
import getFileList from '../../../data-sources/file-list'
import { setFileList, setRepoPos } from '../../../store/actions'

import Layout from '../layout/base/layout'
import Tabs from '../../tabs/tabs'
import Table from '../../table/table'
import BranchSelect from '../layout/base/branch-select'

const page = (currentRepoPos, fileList, isLoading) => <Layout title={ currentRepoPos.repo } subtitle={ props => <BranchSelect {...props} /> }>
  <div className="Layout-Wrap">
    <Tabs items={[
      { title: 'Files', url: '#', isActive: true },
      { title: 'Branches', url: location + '/foo', isActive: false }
    ]} />
  </div>
  <div className="Layout-Wrap"><div className="Layout-Scrollarea">
    <Table headers={[ 'Name', 'Size (bytes)' ]} rows={
      fileList
        .map(({ name, size }) => [ name, size ])
    } />
  </div></div>
</Layout>

export default function FileList ({ repo, branch, path }) {
  const dispatch = useDispatch()
  const fileList = useSelector(({ fileList }) => fileList)
  const currentRepoPos = useSelector(
    ({ repo, branch, path }) => ({ repo, branch, path }),
    () => true
  )
  const [location] = useLocation()
  const [isLoadingFromState, setIsLoading] = useState(true)
  const isLoading = shallowEqual(currentRepoPos, { repo, branch, path })?
    isLoadingFromState : true
  const setLoadingState = (state) => { if (isLoading !== state) setIsLoading(state) }

  function onData (data) {
    dispatch(setRepoPos({ repo, branch, path }))
    dispatch(setFileList(data))
    setLoadingState(false)
  }

  useEffect(() => {
    if ( shallowEqual(currentRepoPos, { repo, branch, path }) ) {
      setLoadingState(false)
      return
    }

    setLoadingState(true)

    const fileListPromise = cancellablePromise(getFileList({ repo, branch, path }))
    fileListPromise
      .then(onData)
      .catch((err) => {
        if (err === 'CANCEL') { return }
        onData({ ERROR: err.ERROR || true })
      })

    return () => { fileListPromise.cancel() }
  }, [ repo, branch, path ])

  if (Array.isArray(fileList)) {
    const files = [{ name: '..', size: '-' }, ...fileList]
    return page(currentRepoPos, files, isLoading)
  }
}