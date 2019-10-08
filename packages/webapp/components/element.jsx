import React from 'react'

export default (Component, className, props = {}) => typeof Component === 'function' ?
  <Component className={className} {...props} /> :
  <div className={className} {...props}>{Component}</div>