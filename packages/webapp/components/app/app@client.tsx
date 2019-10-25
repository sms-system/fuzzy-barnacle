import React from 'react'

import { Router } from 'wouter'
import { Provider } from 'react-redux'

import createStore from '../../store'

import BaseApp from './app'

interface props {
  state: { [key: string]: any }
}

export default function App (props: props) {
  return (
    <Provider store={createStore(props.state)}>
      <Router>
        <BaseApp />
      </Router>
    </Provider>
  )
}