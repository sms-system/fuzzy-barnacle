import React from 'react'
import { cn } from '@bem-react/classname'
import element from '../element'

import './header.styl'

const cnHeader = cn('Header')

interface props {
  className?: string,
  wrapperClassName?: string,
  accent: boolean,
  elLogo: React.ReactNode | string,
  children: React.ReactNode | string
}

export default function Header (props: props) {
  const { className, wrapperClassName, accent, elLogo, children } = props
  return (
    <header className={ cnHeader(null, [className]) }>
      <div className={ cnHeader('Content', [wrapperClassName]) }>
        { element(elLogo, cnHeader('Logo')) }
        { element(children, cnHeader('Item', { accent })) }
      </div>
    </header>
  )
}