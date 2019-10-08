import React from 'react'
import { Link } from 'wouter'

import './repo-list.styl'

import Layout from '../layout/base/layout'

export default function RepoList () {
  return (
    <Layout>
      <Link href="/files">FileList!</Link>
      <div className="bb">RepoList</div>
    </Layout>
  )
}