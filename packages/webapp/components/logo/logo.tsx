import React from 'react'
import { cn } from '@bem-react/classname'
import Svg from '../svg'
//@ts-ignore
import logo from './logo.svg'
import { Link } from 'wouter'

const cnLogo = cn('Logo')

interface props {
  className: string
}

export default function Logo (props: props) {
  const { className } = props
  return (
    <div className={ cnLogo(null, [className]) }>
      <Link href="/"><Svg icon={ logo } /> </Link>
    </div>
  )
}