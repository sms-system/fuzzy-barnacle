import { rehydrateMarks } from 'react-imported-component'
import React from 'react'
import { hydrate, render } from 'react-dom'

import App from './App'
import './imported'

const element = document.getElementById('app')
const app = <App />

document.addEventListener('DOMContentLoaded', () => {
  if (process.env.NODE_ENV === 'production') {
    rehydrateMarks().then(() => { hydrate(app, element) })
  } else {
    render(app, element)
  }
})