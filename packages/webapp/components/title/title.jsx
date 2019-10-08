import React from 'react'
import { cn } from '@bem-react/classname'
import element from '../element.jsx'

import './title.styl'

const cnTitle = cn('Title')

export default function Title ({ className, children, elSuffix, elSubheader }) {
  return (
    <div className={ cnTitle(null, [ className ]) }>
      { element(children, cnTitle('Header')) }
      { element(elSuffix, cnTitle('Header_suffix')) }
      { element(elSubheader, cnTitle('Subheader')) }
    </div>
  )
}