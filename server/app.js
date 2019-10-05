const fs = require('fs')
const path = require('path')

import React from 'react'

import { renderToString } from 'react-dom/server'
import { printDrainHydrateMarks } from 'react-imported-component'

import { Router } from 'wouter'
import staticLocationHook from 'wouter/static-location'

import App from '../app/App'

const INDEX_PAGE_PATH = path.resolve('dist', 'client', 'index.html')

const template = fs.readFileSync(INDEX_PAGE_PATH, 'utf8')
const templateParts = template.split('<div id="app"></div>')
const pageStart = templateParts[0] + '<div id="app">'
const pageEnd = '</div>' + templateParts[1]

function generateHtml (content) {
  return pageStart + content + printDrainHydrateMarks() + pageEnd
}

export default (res, req) => {
  const url = req.getUrl()
  const app = renderToString(
    <Router hook={staticLocationHook(url)}>
      <App />
    </Router>
  )

  res.end(generateHtml(app))
}