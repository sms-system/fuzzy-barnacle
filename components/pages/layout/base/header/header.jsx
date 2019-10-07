import React from 'react'

import { useSelector } from 'react-redux'

import Header from '../../../../header/header'
import Logo from '../../../../logo/logo'
import RepoSelect from './repo-select'

export default function BaseHeader () {
  const repo = useSelector(({ repo }) => repo)
  return (
    <Header className="Layout-Header" elLogo={ Logo } accent={ true } wrapperClassName="Layout-Wrap">
      { repo && RepoSelect }
    </Header>
  )
}