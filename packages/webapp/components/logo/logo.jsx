import React from 'react'
import { cn } from '@bem-react/classname'
import Svg from '../svg'
import logo from './logo.svg'
import { Link } from 'wouter'

const cnLogo = cn('Logo')

export default function Logo ({ className }) {
  return (
    <div className={ cnLogo(null, [className]) }>
      <Link href="/"><Svg icon={ logo } /> </Link>
    </div>
  )
}