import React from 'react'

import BaseHeader from './header/header'
import Breadcrumbs from '../../../breadcrumbs/breadcrumbs'
import Title from '../../../title/title'
import Footer from '../../../footer/footer'

export default function Layout ({ title, titleSuffix, subtitle, children, breadcrumbs }) {
  return (
    <>
      <BaseHeader className="Layout-Header" wrapperClassName="Layout-Wrap" />
      <div className="Layout-Content">
        <div className="Layout-Wrap">
          <Breadcrumbs items={ breadcrumbs } />
        </div>
        { title && <div className="Layout-Wrap">
          <Title elSuffix={ titleSuffix } elSubheader={ subtitle }>{ title }&nbsp;</Title>
        </div> }
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