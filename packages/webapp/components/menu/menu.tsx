import React from 'react'
import { cn } from '@bem-react/classname'
import element from '../element.jsx'

import './menu.styl'

const cnMenu = cn('Menu')

interface props {
  className?: string,
  children: Array<React.ReactNode | string>
}

export default function Menu (props: props) {
  const { className, children } = props
  return (
    <ul className={ cnMenu(null, [className]) }>
      { children.map((Child, i) =>
        <li className={ cnMenu('Item') } key={ i }>
          {element(Child, cnMenu('Link'))}
        </li>
      ) }
    </ul>
  )
}