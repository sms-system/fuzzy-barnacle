import React from 'react'
import { cn } from '@bem-react/classname'
import { Link } from 'wouter'

import './link.styl'

const cnLink = cn('Link')

export default function ({ children, href, mods={} }) {
  return (
    <Link className={ cnLink(mods) } href={ href } >
      { children }
    </Link>
  )
}