export const config = require('../../config')

export const API_URL = `${config.get('api').hostname}:${config.get('api').port}`