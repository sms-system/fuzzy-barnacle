const rewire = require('rewire')
const ERROR_CODES = require('../lib/error-codes')
const config = require('../config')

const GIT_BINARY = config.get('git').binary
const REPOS_DIR = '../../fixtures/repos'
const NON_EXISTS_REPOS_DIR = '../../fixtures/non_exists_repos'

function nextTick (fn) { setTimeout(fn, 0) }

function GitReposDirGetter ({ rmFn = () => {}, spawnParams = [] } = {}) {
  const GitReposDir = rewire('../lib/git-repos-dir')
  GitReposDir.__set__({
    rmrf: rmFn,
    spawn: (program, args, opts) => {
      const [ cwd, argsString, doResolve ] = spawnParams
      expect(program).toBe(GIT_BINARY)
      expect(args.join(' ')).toBe(argsString)
      expect(opts).toEqual({ cwd, stdio: [ 'ignore', 'ignore', 'pipe' ] })
      return {
        stderr: { on () {}, destroy () {} },
        stdout: { on () {}, destroy () {} },
        kill () {},
        on (event, fn) {
          if (!doResolve) { return }
          expect(event).toBe('close')
          nextTick(fn(0))
        }
      }
    }
  })
  return GitReposDir
}

describe('Git Repos dir', () => {

  describe('constructor', () => {

    test('creates instance of GitReposDir class for exists folder', () => {
      const GitReposDir = GitReposDirGetter()
      const dir = new GitReposDir(REPOS_DIR)

      expect(dir).toBeInstanceOf(GitReposDir)
    })

    test('throw error for nonexistent directory', () => {
      const GitReposDir = GitReposDirGetter()
      const nonExistsDir = _ => new GitReposDir(NON_EXISTS_REPOS_DIR)

      expect(nonExistsDir).toThrowError(ERROR_CODES.REPOS_DIR_NOT_EXISTS)
    })

  })

  describe('list', () => {

    test('all repos are shown', async () => {
      const GitReposDir = GitReposDirGetter()
      const dir = new GitReposDir(REPOS_DIR)

      await expect(dir.list()).resolves.toEqual([ 'refactored-waddle', 'xo' ])
    })

  })

  describe('removeRepo', () => {

    test('correctly removes repo dirrectory', async () => {
      const spy = jest.fn()
      const GitReposDir = GitReposDirGetter({ rmFn: spy })
      const dir = new GitReposDir(REPOS_DIR)

      await dir.removeRepo('xo')

      expect(spy).toHaveBeenCalledWith(`${REPOS_DIR}/xo/`)
    })

    test('hacking attempt prevention for path traversal', async () => {
      const spy = jest.fn()
      const GitReposDir = GitReposDirGetter({ rmFn: spy })
      const dir = new GitReposDir(REPOS_DIR)
      
      const fn1 = dir.removeRepo('/foo/bar')
      const fn2 = dir.removeRepo('../foo')
      const fn3 = dir.removeRepo('..')

      await expect(fn1).rejects.toBe(ERROR_CODES.HACKING_ATTEMPT)
      await expect(fn2).rejects.toBe(ERROR_CODES.HACKING_ATTEMPT)
      await expect(fn3).rejects.toBe(ERROR_CODES.HACKING_ATTEMPT)
      expect(spy).not.toHaveBeenCalled()
    })

    test('throw error on not found repo', async () => {
      const spy = jest.fn()
      const GitReposDir = GitReposDirGetter({ rmFn: spy })
      const dir = new GitReposDir(REPOS_DIR)
      
      const fn = dir.removeRepo('foo')

      await expect(fn).rejects.toBe(ERROR_CODES.REPO_DOES_NOT_EXISTS)
      expect(spy).not.toHaveBeenCalled()
    })
  
  })

  describe('cloneRepo', () => {

    test('git clone calls correctly', async () => {
      const GitReposDir = GitReposDirGetter({ spawnParams: [
        `${REPOS_DIR}/`,
        'clone -- foo bar/',
        true
      ] })
      const dir = new GitReposDir(REPOS_DIR)

      await dir.cloneRepo('foo', 'bar')
    })

    test('throw error on clone timeout', async () => {
      const GitReposDir = GitReposDirGetter({ spawnParams: [
        `${REPOS_DIR}/`,
        'clone -- foo bar/'
      ] })
      const dir = new GitReposDir(REPOS_DIR)

      await expect(dir.cloneRepo('foo', 'bar')).rejects.toBe(ERROR_CODES.TIMEOUT_EXCEEDED)
    })

    test('hacking attempt prevention for path traversal', async () => {
      const spy = jest.fn()
      const GitReposDir = GitReposDirGetter()
      const dir = new GitReposDir(REPOS_DIR)
      
      const fn1 = dir.cloneRepo('foo', '/foo/bar')
      const fn2 = dir.cloneRepo('foo', '../foo')
      const fn3 = dir.cloneRepo('foo', '..')

      await expect(fn1).rejects.toBe(ERROR_CODES.HACKING_ATTEMPT)
      await expect(fn2).rejects.toBe(ERROR_CODES.HACKING_ATTEMPT)
      await expect(fn3).rejects.toBe(ERROR_CODES.HACKING_ATTEMPT)
      expect(spy).not.toHaveBeenCalled()
    })

  })

})