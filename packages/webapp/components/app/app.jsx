import React from 'react'
import { Switch, Route } from 'wouter'

import routes from '../pages/routes'
import '../base.styl'

export default function App () {
  return (
    <Switch>
      { Object.keys(routes).map((route) => (
        <Route key={ route }  { ...routes[route] } />
      )) }
    </Switch>
  )
}