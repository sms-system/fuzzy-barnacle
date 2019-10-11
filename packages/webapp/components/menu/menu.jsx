import React from 'react'
import { cn } from '@bem-react/classname'
import element from '../element.jsx'

import './menu.styl'

const cnMenu = cn('Menu')

export default function Menu ({ className, children }) {
  return (
    <ul className={ cnMenu(null, [className]) }>
      { children.map(Child =>
        <li className={ cnMenu('Item') } key={ Child().key }>
          {element(Child, cnMenu('Link'))}
        </li>
      ) }
    </ul>
  )
}