import React from 'react'
import { cn } from '@bem-react/classname'
import element from '../element.jsx'

import './header.styl'

const cnHeader = cn('Header')

export default function Header ({ className, wrapperClassName, accent, elLogo, children }) {
  return (
    <header className={ cnHeader(null, [className]) }>
      <div className={ cnHeader('Content', [wrapperClassName]) }>
        { element(elLogo, cnHeader('Logo')) }
        { element(children, cnHeader('Item', { accent })) }
      </div>
    </header>
  )
}