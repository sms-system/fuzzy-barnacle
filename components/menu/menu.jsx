import React from 'react'
import { cn } from '@bem-react/classname'
import element from '../../helpers/element.jsx'

const cnMenu = cn('Menu')

export default function Menu ({ className }) {
  return (
    <div className={ cnMenu(null, [className]) }>
      MENU
    </div>
  )
}