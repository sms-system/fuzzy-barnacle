import React from 'react'
import { cn } from '@bem-react/classname'
import element from '../element.jsx'

const cnDropdown = cn('Dropdown')

export default function Dropdown ({ className, currentItemText, children }) {
  return (
    <div className={ cnDropdown(null, [className]) } tabIndex="0">
      <div className={ cnDropdown('Current') }><span>{ currentItemText }</span></div>
      { element(children, cnDropdown('Content')) }
    </div>
  )
}