import React from 'react'

import BaseHeader from '../../../header/header'
import Logo from '../../../logo/logo'
import { className } from 'postcss-selector-parser'

export default function Header () {
  return (
    <BaseHeader elLogo={ (props) => <Logo {...props} /> }>
      HEADER
    </BaseHeader>
  )
}