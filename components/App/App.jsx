import React from 'react'
import { Switch, Route } from 'wouter'

import routes from '../pages/routes'

export default function App () {
  return (
    <Switch>
      { Object.keys(routes).map((route) => (
        <Route key={ route }  path={ route } component={ routes[route].component } />
      )) }
    </Switch>
  )
}