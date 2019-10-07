const path = require('path')

import config from '../config.json'

const { App } = require('uWebSockets.js')
const useFolderServe = require('./utils/folder-serve-handler')
import appHandler from './app'

const PORT = 8080
const ASSETS_PATH = path.resolve('dist', 'client')

const server = new App()
useFolderServe(server)

server
  .folder(config.assetsUrl, ASSETS_PATH)
  .any('/*', appHandler)

  .listen(PORT, () => {
    console.log(`App started on ${PORT}`)
  })