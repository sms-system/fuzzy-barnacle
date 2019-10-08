const convict = require('convict')
const yaml = require('js-yaml')
const path = require('path')

convict.addParser({ extension: ['yml', 'yaml'], parse: yaml.safeLoad })
const schema = require('./schema.js')

const config = convict({
  env: {
    doc: 'The application environment',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  ...schema
})

try {
  config.loadFile(path.resolve(__dirname, 'env', `${config.get('env')}.yaml`))
}
catch (e) {
  
}

module.exports = config