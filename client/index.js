import React from 'react'

import { rehydrateMarks } from 'react-imported-component'
import { hydrate, render } from 'react-dom'

import App from '../components/App/App@client'
import '../generated/imports'

const element = document.getElementById('app')

document.addEventListener('DOMContentLoaded', () => {
  const state = window.__PRELOADED_STATE__
  const app = <App state={ state } />
  if (process.env.NODE_ENV === 'production') {
    rehydrateMarks().then(() => { hydrate(app, element) })
  } else {
    render(app, element)
  }
})