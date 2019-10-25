import React from 'react'

export default (Component: React.ReactNode | string, className: string, props = {}) => typeof Component === 'function' ?
  <Component className={className} {...props} /> :
  <div className={className} {...props}>{Component}</div>