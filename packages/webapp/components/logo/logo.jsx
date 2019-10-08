import React from 'react'
import { cn } from '@bem-react/classname'
import Svg from '../svg'
import logo from './logo.svg'

const cnLogo = cn('Logo')

export default function Logo ({ className }) {
  return (
    <div className={ cnLogo(null, [className]) }>
      <Svg icon={ logo } />
    </div>
  )
}