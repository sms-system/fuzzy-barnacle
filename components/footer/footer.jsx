import React from 'react'
import { cn } from '@bem-react/classname'
import element from '../element.jsx'

import './footer.styl'

const cnFooter = cn('Footer')

export default function Footer ({ className, children, elInfo }) {
  return (
    <div className={ cnFooter(null, [className]) }>
      { element(children, cnFooter('Main')) }
      { elInfo.map((Info, i) =>
        <div className={ cnFooter('Info') } key={ i }>{ Info }</div>
      ) }
    </div>
  )
}