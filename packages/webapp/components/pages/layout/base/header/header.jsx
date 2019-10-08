import React from 'react'

import { useSelector } from 'react-redux'

import Header from '../../../../header/header'
import Logo from '../../../../logo/logo'
import RepoSelect from '../repo-select'

export default function BaseHeader (props) {
  const repo = useSelector(({ repo }) => repo)
  return (
    <Header elLogo={ Logo } accent={ true } {...props}>
      { repo && RepoSelect }
    </Header>
  )
}