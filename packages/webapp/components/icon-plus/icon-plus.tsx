import React from 'react'
import { cn } from '@bem-react/classname'
import element from '../element.jsx'

import './icon-plus.styl'

const cnIconPlus = cn('IconPlus')

interface props {
  className?: string,
  elIcon: React.ReactNode | string,
  children: React.ReactNode | string
}

export default function IconPlus (props: props) {
  const { className, children, elIcon } = props
  return (
    <div className={ cnIconPlus(null, [className]) }>
      { element(elIcon, cnIconPlus('Icon')) }
      { element(children, cnIconPlus('Content')) }
    </div>
  )
}