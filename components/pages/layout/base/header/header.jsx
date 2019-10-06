import React from 'react'

import Header from '../../../../header/header'
import Logo from '../../../../logo/logo'
import RepoSelect from './repo-select'

export default function BaseHeader () {
  return (
    <Header elLogo={ Logo }>
      { RepoSelect }
    </Header>
  )
}