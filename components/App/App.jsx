import React from 'react'
import { Switch, Route } from 'wouter'

import imported from 'react-imported-component'

const Home = imported(() => import('../pages/repo-list'))
const NotFound = imported(() => import('../pages/404'))

export default function App () {
  return (
    <Switch>
      <Route path="/"><Home /></Route>
      <Route path="/:rest*"><NotFound /></Route>
    </Switch>
  )
}