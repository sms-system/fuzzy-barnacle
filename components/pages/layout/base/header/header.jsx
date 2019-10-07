import React from 'react'

import { useSelector } from 'react-redux'

import Header from '../../../../header/header'
import Logo from '../../../../logo/logo'
import RepoSelect from './repo-select'

export default function BaseHeader () {
  const repo = useSelector(({ repo }) => repo)
  return (
    <Header elLogo={ Logo }>
      { repo && RepoSelect }
    </Header>
  )
}