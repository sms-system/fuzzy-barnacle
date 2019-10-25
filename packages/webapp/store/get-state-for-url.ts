//@ts-ignore
import createMatcher from '../generated/matcher'
import routes from '../components/pages/routes'

import { baseDataSources, pageDataSources } from '../data-sources/page-data-sources'
import { string } from 'prop-types'

const matcher = createMatcher()

function getPage (url: string) {
  for (let page of Object.keys(routes)) {
    const route = routes[page]
    const [match, params] = matcher(route.path, url)
    if (match === true) {
      const parsedParams: { [key: string]: string } = {}
      Object.keys(params).forEach(key => parsedParams[key] = params[key] && decodeURI(params[key]))
      return [ page, params, parsedParams ]
    }
  }
  return [ null, null, null ]
}

export default async (url: string) => {
  const state: { [key: string]: string } = {}
  let sources = baseDataSources, params = {}
  const [ pageName, routeParams, parsedParams ] = getPage(url)
  if (routeParams) { params = routeParams }
  if (pageName && pageDataSources[pageName]) { sources = { ...sources, ...pageDataSources[pageName](parsedParams) } }

  const data = await Promise.all( Object.values(sources).map(([source, _]) => {
    //@ts-ignore
    let getter = source(params)
    if (getter && getter.catch) { getter = getter.catch((e: any) => {
      return { ERROR: e.ERROR || true }
    }) }
    return getter
  }) )
  Object.keys(sources).forEach((key, i) => {
    state[key] = data[i]
  })

  return state
}