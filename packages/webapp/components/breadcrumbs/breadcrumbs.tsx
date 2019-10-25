import React from 'react'
import { Link } from 'wouter'
import { cn } from '@bem-react/classname'

import './breadcrumbs.styl'

const cnBreadcrumbs = cn('Breadcrumbs')

interface props {
  className?: string,
  items?: Array<{ title: string, url: string }>
}

export default function Breadcrumbs (props: props) {
  const { className, items = [] } = props
  return !!items.length? (
    <ul className={ cnBreadcrumbs(null, [className]) }>
      { items.map(({ title, url }, i) =>
        <li className={ cnBreadcrumbs('Item') } key={ i }>
          { i !== items.length - 1 ?
            <Link href={ url } className={ cnBreadcrumbs('Link') }>{ title }</Link> :
            <div className={ cnBreadcrumbs('Link', { active: true }) }>{ title }</div> }
        </li>
      ) }
    </ul>
  ) : <></>
}