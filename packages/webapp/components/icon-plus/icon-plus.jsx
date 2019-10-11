import React from 'react'
import { cn } from '@bem-react/classname'
import element from '../element.jsx'

import './icon-plus.styl'

const cnIconPlus = cn('IconPlus')

export default function IconPlus ({ className, children, elIcon }) {
  return (
    <div className={ cnIconPlus(null, [className]) }>
      { element(elIcon, cnIconPlus('Icon')) }
      { element(children, cnIconPlus('Content')) }
    </div>
  )
}