import React from 'react'
import { Link, Route } from 'wouter'

import importedComponent from 'react-imported-component'

// const HelloWorld = importedComponent(() => new Promise((resolve) => {
//   setTimeout(() => resolve(import //('./HelloWorld')), 1000)
// }))

const HelloWorld = importedComponent(() => import('./HelloWorld'))

export default function App() {
  return (
    <div>
      <Link href="/users/1">
        <a className="link">Profile</a>
      </Link>

      <Route path="/users/:name/:rest*">
        {params => <HelloWorld name={ params.name } rand={ Math.random() }/>}
      </Route>
    </div>
  )
}