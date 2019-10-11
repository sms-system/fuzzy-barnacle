import React, { useState } from 'react'
import { cn } from '@bem-react/classname'
import element from '../element.jsx'

import './dropdown.styl'

const cnDropdown = cn('Dropdown')

export default function Dropdown ({ className, currentItemText, children }) {
  const [ isOpenned, setOpenned ] = useState(false)

  function handleFocus(e) {
    isOpenned? setTimeout(() => setOpenned(false), 200) : setOpenned(true)
  }

  return (
    <div className={ [cnDropdown(null, [className]), cnDropdown({ 'is-openned': isOpenned })].join(' ') } tabIndex="0" onFocus={handleFocus} onBlur={handleFocus}>
      <div className={ cnDropdown('Current') }><span>{ currentItemText }</span></div>
      { element(children, cnDropdown('Content')) }
    </div>
  )
}