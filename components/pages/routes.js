import imported from 'react-imported-component'

const Home = imported(() => import('./repo-list'))
const RepoPage = imported(() => import('./repo-page'))

import PAGES from './page-names'

export default {
  [PAGES.REPO_LIST]: { path: '/', component: Home },
  [PAGES.REPO_PAGE]: { path: '/:repo/:view_type?/:branch?/:path*', component: RepoPage }
}