import convict from 'convict'
import yaml from 'js-yaml'
import path from 'path'
import schema from './schema'

convict.addParser({ extension: ['yml', 'yaml'], parse: yaml.safeLoad })

const config = convict({
  env: {
    doc: 'The application environment',
    format: ['production', 'development', 'test'],
    default: 'production',
    env: 'NODE_ENV'
  },
  ...schema
})

try {
  config.loadFile(path.resolve(__dirname, 'env', `${config.get('env')}.yaml`))
}
catch (e) {
  
}

export default config