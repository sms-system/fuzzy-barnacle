import imported from 'react-imported-component'

const Home = imported(() => import('./repo-list'))
const NotFound = imported(() => import('./404'))

import PAGES from './page-names'

export default {
  '/': { component: Home, name: PAGES.REPO_LIST },
  '/:rest*': { component: NotFound, name: PAGES.NOT_FOUND }
}