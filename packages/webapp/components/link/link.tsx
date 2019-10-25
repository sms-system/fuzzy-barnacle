import React from 'react'
import { cn } from '@bem-react/classname'
import { Link } from 'wouter'

import './link.styl'

const cnLink = cn('Link')

interface props {
  href: string,
  children: React.ReactNode | string,
  mods?: { [key: string]: string | boolean }
}

export default function (props: props) {
  const { children, href, mods={} } = props
  return (
    <Link className={ cnLink(mods) } href={ href } >
      { children }
    </Link>
  )
}