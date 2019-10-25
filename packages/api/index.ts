import config  from './config'
import express from 'express'
import mime from 'mime-types'
import path from 'path'
import { GitReposDir, GitRepo } from './lib'
import { Response } from 'express-serve-static-core'

const PORT = config.get('api').port
let REPOS_DIR = config.get('reposDir') || process.argv[2]

if (!REPOS_DIR) {
  throw 'Missed REPOS_DIR argument. Usage: "npm run start -- /path/to/repos" or "yarn start /path/to/repos" '
}

if (!path.isAbsolute(REPOS_DIR)) {
  REPOS_DIR = path.resolve(__dirname, '..', '..', REPOS_DIR)
}

const errHandler = (res: express.Response, code: number) => (errorCode: string) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.status(code).json({ errorCode })
}

const app: express.Application = express()
app.use(express.json())

interface GitRepoRequest extends express.Request {
  repo?: GitRepo,
  reposDir?: GitReposDir
}

app.param('repositoryId', (req: GitRepoRequest, res, next, repositoryId: string) => {
  try {
    req.repo = new GitRepo(REPOS_DIR, repositoryId)
    next()
  }
  catch (err) {
    errHandler(res, 404)(err)
  }
})

app.use((req: GitRepoRequest, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  if (req.repo) return next()
  try {
    req.reposDir = new GitReposDir(REPOS_DIR)
    next()
  }
  catch (err) {
    errHandler(res, 404)(err)
  }
})

function blobMiddleware (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.setHeader('Content-Type', mime.lookup(req.url) || 'application/octet-stream')
  return next()
}

app.get('/api/repos', async (req: GitRepoRequest, res) => {
  res.json(await req.reposDir!.list())
})

// Send page positiion with `page` query
// Example: /api/repos/cool-timer/commits/master?page=3
app.get('/api/repos/:repositoryId/commits/:commitHash', (req: GitRepoRequest, res) => {
  const { commitHash } = req.params
  const { page } = req.query
  req.repo!.getCommits(commitHash, page,
    (data) => res.write(data),
    errHandler(res, 500),
    () => res.end()
  )
})

app.get('/api/repos/:repositoryId/commits/:commitHash/diff', (req: GitRepoRequest, res) => {
  const { commitHash } = req.params
  req.repo!.getCommitDiff(commitHash,
    (data) => res.write(data),
    errHandler(res, 500),
    () => res.end()
  )
})

function getTreeHandler (req: GitRepoRequest, res: Response) {
  const { commitHash, path } = req.params
  req.repo!.getTree(commitHash, path, {},
    (data) => res.write(data),
    errHandler(res, 500),
    () => res.end()
  )
}

app.get('/api/repos/:repositoryId', getTreeHandler)
app.get('/api/repos/:repositoryId/tree/:commitHash/:path(*)', getTreeHandler)

app.get('/api/repos/:repositoryId/blob/:commitHash/:pathToFile(*)', blobMiddleware, (req: GitRepoRequest, res) => {
  const { commitHash, pathToFile } = req.params
  req.repo!.getBlobContent(commitHash, pathToFile,
    (data) => res.write(data),
    errHandler(res, 500),
    () => res.end()
  )
})

app.delete('/api/repos/:dirRepositoryId', (req: GitRepoRequest, res) => {
  const { dirRepositoryId } = req.params
  req.reposDir!.removeRepo(dirRepositoryId)
    .then(() => res.json({ status: 'OK' }))
    .catch(errHandler(res, 500))
})

app.post('/api/repos', (req: GitRepoRequest, res) => {
  const { url, repositoryId } = req.body
  req.reposDir!.cloneRepo(url, repositoryId)
    .then(() => res.json({ status: 'OK' }))
    .catch(errHandler(res, 500))
})

app.get('/api/repos/:repositoryId/charsCount/:commitHash', (req: GitRepoRequest, res) => {
  const { commitHash } = req.params
  req.repo!.getSymbolsCount(commitHash, true,
    errHandler(res, 500),
    (data) => res.json(data)
  )
})

app.listen(PORT, () => console.log(`Web server started on port ${PORT}`))