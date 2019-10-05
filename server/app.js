import React from 'react'

import { renderToString } from 'react-dom/server'
import { printDrainHydrateMarks } from 'react-imported-component'
import renderHtml from './utils/render-html'

const CLIENT_BUNDLE = 'index.js'

import App from '../components/App/App@server'
import { stat } from 'fs'
const manifest = require('../generated/client.manifest.json')

const scriptInject = `<script src="${ manifest[CLIENT_BUNDLE] }"></script>`

export default (res, req) => {
  const state = {
    name: 'test',
    data: null
  }
  const serializedState = JSON.stringify(state)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
  const serializedStateScript = `<script>window.__PRELOADED_STATE__=${serializedState}</script>`

  const content = renderToString(<App
    url={ req.getUrl() }
    state={ state }
  />)
  const html = renderHtml(content, serializedStateScript + printDrainHydrateMarks() + scriptInject)
  res.end(html)
}