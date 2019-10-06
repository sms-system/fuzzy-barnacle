import React from 'react'

import BaseHeader from './header/header'

export default function Layout ({ children }) {
  return (
    <>
      <BaseHeader />
      { children }
      FOOTER
    </>
  )
}