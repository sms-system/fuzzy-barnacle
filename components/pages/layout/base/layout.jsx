import React from 'react'

import BaseHeader from './header/header'
import Footer from '../../../footer/footer'
import Breadcrumbs from '../../../breadcrumbs/breadcrumbs'

export default function Layout ({ children }) {
  return (
    <>
      <BaseHeader className="Layout-Header" wrapperClassName="Layout-Wrap" />
      <div className="Layout-Content">
        <div className="Layout-Wrap"><Breadcrumbs /></div>
        { children }
      </div>
      <Footer className="Layout-Footer" elInfo={[
        <>UI: 0.1.15</>,
        <>© 2007—2019 <a href="#">Yandex</a></>
      ]}>
        Trade secrets of Yandex LLC. 16, Lev Tolstoy Str., Moscow, Russia, 119021
      </Footer>
    </>
  )
}