import React from 'react'
import { cn } from '@bem-react/classname'
import element from '../element.jsx'

const cnBreadcrumbs = cn('Breadcrumbs')

export default function Breadcrumbs ({ className }) {
  return (
    <div className={ cnBreadcrumbs(null, [className]) }>
      Breadcrumbs
    </div>
  )
}