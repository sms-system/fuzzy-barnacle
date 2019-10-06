import React from 'react'

import { rehydrateMarks } from 'react-imported-component'
import { hydrate, render } from 'react-dom'

import App from '../components/app/app@client'
if (process.env.NODE_ENV === 'production') { require('../generated/imports') }

const element = document.getElementById('app')

document.addEventListener('DOMContentLoaded', () => {
  if (process.env.NODE_ENV === 'production') {
    const state = window.__PRELOADED_STATE__
    rehydrateMarks().then(() => { hydrate(<App state={ state } />, element) })
  } else {
    const getState = require('../store/get-state-for-url').default
    getState(window.location.pathname).then(( state ) => render(<App state={ state } />, element))
  }
})