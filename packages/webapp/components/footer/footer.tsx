import React from 'react'
import { cn } from '@bem-react/classname'
import element from '../element.jsx'

import './footer.styl'

const cnFooter = cn('Footer')

interface props {
  className: string,
  children: React.ReactNode | string,
  elInfo: Array<React.ReactNode | string>
}

export default function Footer (props: props) {
  const { className, children, elInfo } = props
  return (
    <div className={ cnFooter(null, [className]) }>
      { element(children, cnFooter('Main')) }
      { elInfo.map((Info: React.ReactNode | string, i: number) =>
        <div className={ cnFooter('Info') } key={ i }>{ Info }</div>
      ) }
    </div>
  )
}