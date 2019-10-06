import React from 'react'
import { cn } from '@bem-react/classname'
import element from '../../helpers/element.jsx'

const cnHeader = cn('Header')

export default function Header ({ className, elLogo, children }) {
  return (
    <header className={ cnHeader(null, [className]) }>
      <div className={ cnHeader('Content') }>
        { element(elLogo, cnHeader('Logo')) }
        { element(children, cnHeader('Item')) }
      </div>
    </header>
  )
}