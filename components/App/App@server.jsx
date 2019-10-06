import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'wouter'
import staticLocationHook from 'wouter/static-location'

import createStore from '../../store'

import BaseApp from './app'

export default function App ({ url, state }) {
  return (
    <Provider store={createStore(state)}>
      <Router hook={ staticLocationHook(url) }>
        <html lang="ru">
          <head>
            <title>Title</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body>
            <div id="app"><BaseApp /></div>
          </body>
        </html>
      </Router>
    </Provider>
  )
}