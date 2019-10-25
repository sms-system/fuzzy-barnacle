import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'wouter'
import staticLocationHook from 'wouter/static-location'

import createStore from '../../store'

import BaseApp from './app'

interface props {
  url: string,
  state: { [key: string]: any }
}

export default function App (props: props) {
  const { url, state } = props
  return (
    <Provider store={createStore(state)}>
      <Router hook={ staticLocationHook(url) }>
        <html lang="ru">
          <head>
            <meta charSet="UTF-8" />
            <title>Title</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body>
            <div id="app" className="Layout Typography"><BaseApp /></div>
          </body>
        </html>
      </Router>
    </Provider>
  )
}