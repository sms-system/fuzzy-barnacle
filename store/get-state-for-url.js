import createMatcher from '../generated/node_modules/wouter/matcher'
import routes from '../components/pages/routes'

import { baseDataSources, pageDataSources } from '../data-sources/page-data-sources'

const matcher = createMatcher()

function getPage (url) {
  for (let page of Object.keys(routes)) {
    const route = routes[page]
    const [match, params] = matcher(route.path, url)
    if (match === true) {
      return [ page, params ]
    }
  }
  return [ null, null ]
}

export default async (url) => {
  const state = {}
  let sources = baseDataSources, params = {}
  const [ pageName, routeParams ] = getPage(url)
  if (routeParams) { params = routeParams }
  if (pageName) { sources = { ...sources, ...pageDataSources[pageName](params) } }

  const data = await Promise.all( Object.values(sources).map(([source]) => source(params)) )
  Object.keys(sources).forEach((key, i) => {
    state[key] = data[i]
  })

  return state
}