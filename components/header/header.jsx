import React, { Fragment } from 'react'
import { cn } from '@bem-react/classname'
import element from '../../helpers/element'

const cnHeader = cn('Header')

export default function Header ({ children, className, elLogo }) {
  return (
    <header className={ cnHeader(null, [className]) }>
      <div className={ cnHeader('Wrap') }>
        { element(elLogo, cnHeader('Logo')) }
        { children }
      </div>
    </header>
  )
}