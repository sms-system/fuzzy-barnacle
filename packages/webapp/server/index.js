const path = require('path')

import config from '../config'

const { App } = require('uWebSockets.js')
const useFolderServe = require('./utils/folder-serve-handler')
import appHandler from './app'

const PORT = config.get('webapp').port
const ASSETS_PATH = path.resolve(__dirname, '..', 'client')

const server = new App()
useFolderServe(server)

server
  .folder('/assets', ASSETS_PATH)
  .any('/*', appHandler)

  .listen(PORT, () => {
    console.log(`App started on ${PORT}`)
  })