import React from 'react'

module.exports = (Component, className, props = {}) => typeof Component === 'function' ?
  <Component className={className} {...props} /> :
  <div className={className} {...props}>{Component}</div>