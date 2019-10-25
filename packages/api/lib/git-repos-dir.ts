import fs from 'fs'
const fsPromise = fs.promises

import path from 'path'
import { spawn } from 'child_process'
import config from '../config'
import ERRORS from './error-codes'

const gitConfig = config.get('git')

const GIT_BINARY = gitConfig.binary
const GIT_CLONE_TIMEOUT = gitConfig.cloneTimeout

import {
  isGitRepo,
  normalizeDirPath,
  rmrf,
  sanitizeRepositoryId,
  setProcessTimeout
} from './utils'

export default class GitReposDir {
  path: string

  constructor (dirPath: string) {
    this.path = normalizeDirPath(dirPath)
    if (!fs.existsSync(this.path)) throw ERRORS.REPOS_DIR_NOT_EXISTS
  }

  async list () {
    const entries = await fsPromise.readdir(this.path, { withFileTypes: true })
    return entries
      .filter(entry => entry.isDirectory() && isGitRepo(path.join(this.path, entry.name)))
      .map(entry => entry.name)
  }

  async removeRepo (repositoryId: string) {
    const sanitizedRepositoryId = sanitizeRepositoryId(repositoryId)

    if (!sanitizedRepositoryId) throw ERRORS.HACKING_ATTEMPT
    const repoPath = path.join(this.path, sanitizedRepositoryId)
    if (!isGitRepo(repoPath)) throw ERRORS.REPO_DOES_NOT_EXISTS

    await rmrf(repoPath)
  }

  cloneRepo (url: string, repositoryId: string) {
    return new Promise((resolve, reject) => {
      const args = ['clone', '--', url]

      if (repositoryId) {
        const sanitizedRepositoryId = sanitizeRepositoryId(repositoryId)
        if (!sanitizedRepositoryId) { return reject(ERRORS.HACKING_ATTEMPT) }
        args.push(sanitizedRepositoryId)
      }

      const child = spawn(GIT_BINARY, args, {
        cwd: this.path
      })
      const execTimeout = setProcessTimeout(child, () => reject(ERRORS.TIMEOUT_EXCEEDED), GIT_CLONE_TIMEOUT)

      let errorMsg = ''
      child.stderr.on('data', (data) => { errorMsg = data.toString() })

      child.on('close', (code) => {
        clearTimeout(execTimeout)
        if (!code) return resolve()
        if (errorMsg.endsWith('already exists and is not an empty directory.\n')) return reject(ERRORS.REPO_ALREADY_EXISTS)
        if (errorMsg.startsWith('fatal: unable to access ')) return reject(ERRORS.INVALID_GIT_REPO_URL)
        reject(ERRORS.UNEXPECTED_ERROR)
      })
    })
  }
}