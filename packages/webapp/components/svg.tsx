import React from 'react'

interface props {
  className?: string,
  icon: string
}

export default function Svg (props: props) {
  return (
    <span dangerouslySetInnerHTML={{ __html: props.icon }} />
  )
}