import React, { useEffect, useState } from 'react'
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'wouter'
import imported from 'react-imported-component'

import cancellablePromise from '../../../helpers/cancelable-promise'
import getFileList from '../../../data-sources/file-list'
import { setFileList, setRepoPos } from '../../../store/actions'

import Svg from '../../svg'
import Link from '../../link/link'
import Layout from '../layout/base/layout'
import Tabs from '../../tabs/tabs'
import Table from '../../table/table'
import IconPlus from '../../icon-plus/icon-plus'
const NotFound = imported(() => import('../404/404'))

//@ts-ignore
import folderIcon from '../../../assets/file_folder.svg'
//@ts-ignore
import htmlIcon from '../../../assets/file_html.svg'
//@ts-ignore
import textIcon from '../../../assets/file_text.svg'
import { type } from 'os'

function getIcon (type: string, filename: string) {
  const ext = filename.split('.').pop()
  switch (type) {
    case 'tree': return folderIcon
    case 'blob':
      switch (ext) {
        case 'html': return htmlIcon
        case 'md': return htmlIcon
        default:
          return textIcon
      }
    default: return textIcon
  }
}

type repoPos = { repo: string, branch: string, path?: string }

function getLink (path: string, repoPos: repoPos, type: string) {
  let location = '/repos/' + repoPos.repo + '/' + type + '/' + (repoPos.branch||'master') + (repoPos.path? '/' + repoPos.path : '/').replace(/\/$/, '')
  return path === '..' ?
    location.replace(/\/[^\/]+$/, '') :
    location + '/' + path
}

interface fileList {
  name: string,
  type: string,
  size: string
}

const page = (repoPos: repoPos, fileList: fileList[], isLoading: boolean, location: string) => (
  <Layout title={ repoPos.repo } breadcrumbs={ [
    {url: `/repos/${repoPos.repo}`, title: repoPos.repo},
    {url: `/repos/${repoPos.repo}/tree/${repoPos.branch}`, title: repoPos.branch},
    ...(repoPos.path ? repoPos.path.split('/').map((slug, i) => (
      {url: `/repos/${repoPos.repo}/tree/${repoPos.branch}/${repoPos.path!.split('/').slice(0, i+1).join('/')}`, title: slug}
    )) : [])
  ] } >
    <div className="Layout-Wrap">
      <Tabs items={[
        { title: 'Files', url: '#', isActive: true }
      ]} />
    </div>
    <div className={ `Layout-Wrap ${isLoading && '_loading'}` }><div className="Layout-Scrollarea">
      <Table headers={[ 'Name', 'Size (bytes)' ]} rows={
        fileList.map(row =>
          [
            <IconPlus elIcon={ <Svg className="IconPlus-Icon" icon={ getIcon(row.type, row.name) } />}>
              <Link href={ getLink(row.name, repoPos, row.type) } mods={ { text: true } }>{row.name}</Link>
            </IconPlus>,
            row.size
          ]
        )
      } />
    </div></div>
  </Layout>
)

interface props {
  repo: string,
  branch: string,
  path: string
}

export default function FileList (props: props) {
  const { repo, branch = 'master', path } = props
  const dispatch = useDispatch()
  const fileList = useSelector(({ fileList }: any) => fileList)

  const currentRepoPos = useSelector(
    ({ repo, branch, path }: repoPos) => ({ repo, branch, path }),
    () => true
  )
  const [location] = useLocation()
  const [isLoadingFromState, setIsLoading] = useState(true)
  const isLoading = shallowEqual(currentRepoPos, { repo, branch, path })?
    isLoadingFromState : true
  const setLoadingState = (state: boolean) => { if (isLoading !== state) setIsLoading(state) }

  function onData (data: any) {
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

      //@ts-ignore
    return () => { fileListPromise.cancel() }
  }, [ repo, branch, path ])

  if (!fileList || !currentRepoPos.repo) {
    return page({ repo, branch }, [], true, location)
  }

  if (Array.isArray(fileList)) {
    const files = currentRepoPos.path?
      [{ type: 'tree', name: '..', size: '-' }, ...fileList] :
      fileList
    return page(currentRepoPos, files, isLoading, location)
  }

  if (typeof fileList === 'object' && fileList.ERROR) {
    switch (fileList.ERROR) {
      case 'REPO_DOES_NOT_EXISTS':
      case 'IS_NOT_A_DIRECTORY':
      case 'BRANCH_OR_COMMIT_OR_PATH_DOES_NOT_EXISTS':
        return <NotFound/>
    }
  }

  return <>500</>
}