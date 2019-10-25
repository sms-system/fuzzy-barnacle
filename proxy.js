const config = require('./config').default

// WARNING! // Temporary solution. Replace to Nginx or HAProxy on production

const PROXY = config.get('proxy')
const API = config.get('api')
const WEBAPP = config.get('webapp')

const proxy = require('redbird')({ port: PROXY.port, bunyan: false })

proxy.register(`${PROXY.hostname}`,     `${WEBAPP.hostname}:${WEBAPP.port}`)
proxy.register(`${PROXY.hostname}/api`, `${API.hostname}:${API.port}/api`)
console.log(`Host "${PROXY.hostname}" registered`)

// For docker
proxy.register(`app.internal`,     `${WEBAPP.hostname}:${WEBAPP.port}`)
proxy.register(`app.internal/api`, `${API.hostname}:${API.port}/api`)

console.log(`Web server started on ${PROXY.port}`)