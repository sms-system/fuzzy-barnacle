const config = require('./config')

const PROXY = config.get('proxy')
const API = config.get('api')
const WEBAPP = config.get('webapp')

const proxy = require('redbird')({ port: PROXY.port })

proxy.register(`${PROXY.hostname}`,     `http://${WEBAPP.hostname}:${WEBAPP.port}`)
proxy.register(`${PROXY.hostname}/api`, `http://${API.hostname}:${API.port}/api`)

console.log(`Web server started on ${PROXY.port}`)