import React from 'react'
import { RawHTML } from 'react-dom'

// TODO! // Rewrite to svg-sprites

export default function Svg ({ icon }) {
  return (
    <span dangerouslySetInnerHTML={{ __html: icon }} />
  )
}