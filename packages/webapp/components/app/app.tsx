import React from 'react'
import imported from 'react-imported-component'
import { Switch, Route } from 'wouter'

import routes from '../pages/routes'
import '../base.styl'

const NotFound = imported(() => import('../pages/404/404'))

export default function App () {
  return (
    <Switch>
      { Object.keys(routes).map((route) => (
        <Route key={ route }  { ...routes[route] } />
      )).concat([
        <Route key="404" path="/:rest*"><NotFound/></Route>
      ]) }
    </Switch>
  )
}