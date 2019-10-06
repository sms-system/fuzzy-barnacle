import React from 'react'
import { cn } from '@bem-react/classname'

const cnLogo = cn('Logo')

export default function Logo ({ className }) {
  return (
    <div className={ cnLogo(null, [className]) }>
      LOGO
    </div>
  )
}