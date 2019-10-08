import React from 'react'
import path from 'path'

const ASSETS_SLUG = '/assets'

import { renderToString } from 'react-dom/server'
import { printDrainHydrateMarks } from 'react-imported-component'
import {discoverProjectStyles, getUsedStyles} from 'used-styles'
import renderHtml from './utils/render-html'

const ASSETS_PATH = path.resolve(__dirname, '..', 'client')

const CLIENT_BUNDLE = 'index.js'
const manifest = require('../generated/client.manifest.json')
const scriptInject = `<script src="${ manifest[CLIENT_BUNDLE] }"></script>`
const stylesLookup = discoverProjectStyles(ASSETS_PATH)

import App from '../components/app/app@server'
import getState from '../store/get-state-for-url'

export default async (res, req) => {
  const url = req.getUrl()
  res.onAborted(() => {
    res.writeStatus('500').end('Internal web server error.')
  })

  await stylesLookup

  const state = await getState(url)
  const serializedState = JSON.stringify(state)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
  const serializedStateScript = `<script>window.__PRELOADED_STATE__=${serializedState}</script>`

  const content = renderToString(<App
    url={ url }
    state={ state }
  />)

  const usedStyles = getUsedStyles(content, stylesLookup)

  const html = renderHtml(
    content,
    usedStyles.map(style => `<link  rel="stylesheet" href="${ASSETS_SLUG}/${style}">`).join(''),
    serializedStateScript + printDrainHydrateMarks() + scriptInject
  )
  res.end(html)
}