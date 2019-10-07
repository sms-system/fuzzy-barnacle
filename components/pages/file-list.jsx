import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'wouter'

import Layout from './layout/base/layout'
import { dispatch } from '../../../../Library/Caches/typescript/3.6/node_modules/rxjs/internal/observable/range'

export default function FileList ({ repo, branch, path }) {
  const dispatch = useDispatch()
  const fileList = useSelector(({ fileList }) => fileList)
  const currentRepoPos = useSelector(({ repo, branch, path }) => ({ repo, branch, path }))
  const [location] = useLocation()

  useEffect(() => {
    if (
      currentRepoPos.repo === repo &&
      currentRepoPos.branch === branch &&
      currentRepoPos.path === path
    ) {
      return
    }
    console.log('EFFECT', { repo, branch, path })
    setTimeout(() => {
      console.log('data', path)
    }, 1000)

    // TODO!! // BUG!! // Problem with async views :(
    // dispatch()
  })

  return (
    <Layout>
      <Link href={ location + '/foo' }>TEST</Link>
      <div>FileList, { location + JSON.stringify(fileList) }</div>
    </Layout>
  )
}