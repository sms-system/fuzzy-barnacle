import React from 'react'
import { Link } from 'wouter'

export default function NotFound () {
  return (
    <div>
      <Link href="/monorepo/tree">/monorepo/tree!</Link>
      <Link href="/">Main!</Link>
      NotFound
    </div>
  )
}