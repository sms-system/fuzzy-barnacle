import React, { useState, ReactNode } from 'react'
import { cn } from '@bem-react/classname'
import element from '../element'

import './dropdown.styl'

const cnDropdown = cn('Dropdown')

interface props {
  className?: string,
  currentItemText: ReactNode | string,
  children: ReactNode | string
}

export default function Dropdown (props: props) {
  const { className, currentItemText, children } = props
  const [ isOpenned, setOpenned ] = useState(false)

  function handleFocus() {
    isOpenned? setTimeout(() => setOpenned(false), 200) : setOpenned(true)
  }

  return (
    <div className={ [cnDropdown(null, [className]), cnDropdown({ 'is-openned': isOpenned })].join(' ') } tabIndex={0} onFocus={handleFocus} onBlur={handleFocus}>
      <div className={ cnDropdown('Current') }><span>{ currentItemText }</span></div>
      { element(children, cnDropdown('Content')) }
    </div>
  )
}