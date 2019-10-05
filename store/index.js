import { createStore } from 'redux'
import { devToolsEnhancer } from 'redux-devtools-extension'

import reducer from './reducer'

export default function (state) {
  return createStore(reducer, state, devToolsEnhancer())
}