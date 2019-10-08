import React from 'react'

import { Router } from 'wouter'
import { Provider } from 'react-redux'

import createStore from '../../store'

import BaseApp from './app'

export default function App ({ state }) {
  return (
    <Provider store={createStore(state)}>
      <Router>
        <BaseApp />
      </Router>
    </Provider>
  )
}