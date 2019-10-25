import React from 'react'
import { cn } from '@bem-react/classname'
import element from '../element.jsx'

import './title.styl'

const cnTitle = cn('Title')

interface props {
  className?: string,
  elSuffix?: React.ReactNode | string,
  elSubheader?: React.ReactNode | string,
  children?: React.ReactNode | string
}

export default function Title (props: props) {
  const { className, children, elSuffix, elSubheader } = props
  return (
    <div className={ cnTitle(null, [ className ]) }>
      { element(children, cnTitle('Header')) }
      { element(elSuffix, cnTitle('Header_suffix')) }
      { element(elSubheader, cnTitle('Subheader')) }
    </div>
  )
}