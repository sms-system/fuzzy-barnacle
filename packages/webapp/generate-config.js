const config = require('../../config')

const API_URL = config.get('api').url

console.log(JSON.stringify({
  API_URL
}))