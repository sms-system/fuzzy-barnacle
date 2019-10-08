import React, { Fragment } from 'react'
import { Link } from 'wouter'
import { cn } from '@bem-react/classname'

import './tabs.styl'

const cnTabs = cn('Tabs')

export default function Tabs ({ className, items = [] }) {
  return !!items.length && (
    <nav className={ cnTabs(null, [className]) }>
      { items.map(({ title, url, isActive }, i) => <Fragment key={ i }>{
        isActive ?
          <div className={ cnTabs('Tab', { active: true }) }>{ title }</div> :
          <Link href={ url } className={ cnTabs('Tab') }>{ title }</Link>
      }</Fragment>
      ) }
    </nav>
  )
}