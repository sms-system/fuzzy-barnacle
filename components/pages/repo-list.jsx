import React from 'react'
import { Link } from 'wouter'

import Layout from './layout/base/layout'

export default function RepoList () {
  return (
    <Layout>
      <Link href="/files">FileList!</Link>
      RepoList
    </Layout>
  )
}