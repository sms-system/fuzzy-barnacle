const rewire = require('rewire')
const ERROR_CODES = require('../lib/error-codes')
const config = require('../config')

const REPOS_DIR = '../../fixtures/repos'
const GIT_BINARY = config.get('git').binary
const NOT_GIT_DIR = '../../fixtures/not_git'
const NON_EXISTS_REPOS_DIR = '../../fixtures/non_exists_repos'

const FAKE_HASH = 'b48f1a70be84937897e1013ed8f3abbffa6a53db'

function nextTick (fn) { setTimeout(fn, 0) }

// Monkey patch spawn method
function GitRepoGetter (cwd, argsString, stdout = [], stderr = [], code = 0) {
  const GitRepo = rewire('../lib/git-repo')
  GitRepo.__set__({
    getDelimeterKey: (postfix) => `__RND__${postfix}__`,
    spawn: (program, args, opts) => {
      expect(program).toBe(GIT_BINARY)
      expect(args.join(' ')).toBe(argsString)
      expect(opts).toEqual({ cwd, stdio: [ 'ignore', 'pipe', 'pipe' ] })
      return {
        stderr: { on (event, fn) {
          expect(event).toBe('data')
          stderr.forEach(data => fn(data))
        }},
        stdout: { on (event, fn) {
          expect(event).toBe('data')
          stdout.forEach(data => fn(data))
        }},
        on (event, fn) {
          expect(event).toBe('close')
          nextTick(fn(code))
        }
      }
    }
  })
  return GitRepo
}

describe('Git Repo class', () => {

  describe('constructor', () => {
    test('throw error for nonexistent directory or repo', () => {
      const GitRepo = GitRepoGetter()
      const repoNotGit = _ => new GitRepo(NOT_GIT_DIR, 'foo')
      const repoNonExistsDir = _ => new GitRepo(NON_EXISTS_REPOS_DIR, 'foo')
      const repoNonExistsRepo = _ => new GitRepo(REPOS_DIR, 'foo')

      expect(repoNotGit).toThrowError(ERROR_CODES.REPO_DOES_NOT_EXISTS)
      expect(repoNonExistsDir).toThrowError(ERROR_CODES.REPO_DOES_NOT_EXISTS)
      expect(repoNonExistsRepo).toThrowError(ERROR_CODES.REPO_DOES_NOT_EXISTS)
    })

    test('not check for repo folder exists with "checkIsGitDir" flag disabled', () => {
      const GitRepo = GitRepoGetter()
      const repoNotGit = new GitRepo(NOT_GIT_DIR, 'foo', false)
      const repoNonExistsDir =  new GitRepo(NON_EXISTS_REPOS_DIR, 'foo', false)

      expect(repoNotGit).toBeInstanceOf(GitRepo)
      expect(repoNonExistsDir).toBeInstanceOf(GitRepo)
    })

    test('creates instance of GitRepo class for git repo', () => {
      const GitRepo = GitRepoGetter()
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')

      expect(repo).toBeInstanceOf(GitRepo)
    })
  })

  describe('getCommits', () => {
    test('basic scenario', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `log --format={__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__%H__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__%P__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__%s__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE__%b__RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__%at__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__%aN <%ae>__RND__QUOTE__}__RND__EOL__ ${FAKE_HASH} --`,
        [
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__a6166f3b952b4c9616cd99c9eee9446cab1b8b0c__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__ab857baf019303d30f651629f530664734ef6414__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Added char counter api method__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568580204__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__ab857baf019303d30f651629f530664734ef6414__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__e253163d8967909eb466703d15ac175738cfa20b__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Option for stream objects data on commits log__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568547195__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__e253163d8967909eb466703d15ac175738cfa20b__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__b48f1a70be84937897e1013ed8f3abbffa6a53db__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Removed body-parser dependency (part of express)__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568544454__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__b48f1a70be84937897e1013ed8f3abbffa6a53db__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__b6e6b7595f787635fe685ebdb11e4b4f43d3ea78__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Added offset pagination__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568543787__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__b6e6b7595f787635fe685ebdb11e4b4f43d3ea78__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__4e0c8601d869396015b68f4008d6f5402b891ae6__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Process argument as repo path__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568537740__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__4e0c8601d869396015b68f4008d6f5402b891ae6__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__f2568049dd8cf3b857ada1f07cd341dcd8d22792__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Send errors as JSON__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568536165__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__f2568049dd8cf3b857ada1f07cd341dcd8d22792__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__7ac6312a90f6c47aaa226e1675e48ac0f4f3784e__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Added express api__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568535603__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__7ac6312a90f6c47aaa226e1675e48ac0f4f3784e__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__eb4707030b34f41056eb9c06e35d8c210e078bbf__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Json escape bug fixes, errorHandlers__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568533521__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__eb4707030b34f41056eb9c06e35d8c210e078bbf__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__f4fe9f2df2b5b9342e823d7e26cd02e61f1e7cc2__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Added all basic commands__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568494531__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__f4fe9f2df2b5b9342e823d7e26cd02e61f1e7cc2__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__6af3a8e0388cd1ec6253a90f1156933a5e804d13__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Add commit list getter func__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568447630__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__6af3a8e0388cd1ec6253a90f1156933a5e804d13__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__def55283be9a49987766cd141894a19648f60e58__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Added git-client reopos dir methods__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568315955__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__def55283be9a49987766cd141894a19648f60e58__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Initial commit__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568279090__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n'
        ]
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')

      let stdout = '', stderr = ''
      repo.getCommits(FAKE_HASH, 0, (data) => { stdout += data }, (data) => { stderr += data }, (code) => {
        expect(code).toBe(0)
        expect(stdout).toBe(`[{"hash": "a6166f3b952b4c9616cd99c9eee9446cab1b8b0c","parent": "ab857baf019303d30f651629f530664734ef6414","subject": "Added char counter api method","body": "","time": "1568580204","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "ab857baf019303d30f651629f530664734ef6414","parent": "e253163d8967909eb466703d15ac175738cfa20b","subject": "Option for stream objects data on commits log","body": "","time": "1568547195","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "e253163d8967909eb466703d15ac175738cfa20b","parent": "b48f1a70be84937897e1013ed8f3abbffa6a53db","subject": "Removed body-parser dependency (part of express)","body": "","time": "1568544454","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "b48f1a70be84937897e1013ed8f3abbffa6a53db","parent": "b6e6b7595f787635fe685ebdb11e4b4f43d3ea78","subject": "Added offset pagination","body": "","time": "1568543787","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "b6e6b7595f787635fe685ebdb11e4b4f43d3ea78","parent": "4e0c8601d869396015b68f4008d6f5402b891ae6","subject": "Process argument as repo path","body": "","time": "1568537740","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "4e0c8601d869396015b68f4008d6f5402b891ae6","parent": "f2568049dd8cf3b857ada1f07cd341dcd8d22792","subject": "Send errors as JSON","body": "","time": "1568536165","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "f2568049dd8cf3b857ada1f07cd341dcd8d22792","parent": "7ac6312a90f6c47aaa226e1675e48ac0f4f3784e","subject": "Added express api","body": "","time": "1568535603","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "7ac6312a90f6c47aaa226e1675e48ac0f4f3784e","parent": "eb4707030b34f41056eb9c06e35d8c210e078bbf","subject": "Json escape bug fixes, errorHandlers","body": "","time": "1568533521","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "eb4707030b34f41056eb9c06e35d8c210e078bbf","parent": "f4fe9f2df2b5b9342e823d7e26cd02e61f1e7cc2","subject": "Added all basic commands","body": "","time": "1568494531","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "f4fe9f2df2b5b9342e823d7e26cd02e61f1e7cc2","parent": "6af3a8e0388cd1ec6253a90f1156933a5e804d13","subject": "Add commit list getter func","body": "","time": "1568447630","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "6af3a8e0388cd1ec6253a90f1156933a5e804d13","parent": "def55283be9a49987766cd141894a19648f60e58","subject": "Added git-client reopos dir methods","body": "","time": "1568315955","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "def55283be9a49987766cd141894a19648f60e58","parent": "","subject": "Initial commit","body": "","time": "1568279090","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"}]`)
        expect(stderr).toBe('')
      })
    })
    test('on very fragmented spawn stream', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `log --format={__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__%H__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__%P__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__%s__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE__%b__RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__%at__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__%aN <%ae>__RND__QUOTE__}__RND__EOL__ ${FAKE_HASH} --`,
        [
          '{__RND__QUOTE__hash__RND__QU',
          'OTE__: __RND__QUOTE__a6166f3b952b4c9616cd99c9e',
          'ee9446cab1b8b0c__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__ab857baf019303d30f651629f530664734ef6414__RND__QUOTE__,__RND__QUOTE__subj',
          'ect__RND__QUOTE__: __RND__QUOTE__Added char counter api method__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE_',
          '_: __RND__QUOTE__1568580204__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__ab857baf019303d30f65',
          '1629f530664734ef6414__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__e253163d8967909eb466703d15ac175738cfa20b__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Option for stream objects data on commits log__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568547195__RND__QUOT',
          'E__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__e253163d8967909eb466703d15ac175738cfa20b__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__b48f1a70be84937897e1013e',
          'd8f3abbffa6a53db__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Removed body-parser dependency (part of express)__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568544454__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smi',
          'rnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n{__RND__QUOTE_',
          '_hash__RND__QUOTE__: __RND__QUOTE__b48f1a70be84937897e1013ed8f3abbffa6a53db__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__b6e6b7595f787635fe685ebdb11e4b4f43d3ea78__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Added offset pagination__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568543787__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__b6e6b7595f787635fe685ebdb11e4b4f43d3ea78__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__4e0c8601d869396015b68f4008d6f5402b891ae6__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Process argument as repo path__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568537740__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__4e0c8601d869396015b68f4008d6f5402b891ae6__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__f2568049dd8cf3b857ada1f07cd341dcd8d22792__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Send errors as JSON__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568536165__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__f2568049dd8cf3b857ada1f07cd341dcd8d22792__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__7ac6312a90f6c47aaa226e1675e48ac0f4f3784e__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Added express api__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568535603__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__',
          '\n{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__7ac6312a90f6c47aaa226e1675e48ac0f4f3784e__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__eb4707030b34f41056eb9c06e35d8c210e078bbf__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Json escape bug fixes, errorHandlers__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568533521__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__eb4707030b34f41056eb9c06e35d8c210e078bbf__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__f4fe9f2df2b5b9342e823d7e26cd02e61f1e7cc2__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Added all basic commands__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568494531__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__f4fe9f2df2b5b9342e823d7e26cd02e61f1e7cc2__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__6af3a8e0388cd1ec6253a90f1156933a5e804d13__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Add commit list getter func__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568447630__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__6af3a8e0388cd1ec6253a90f1156933a5e804d13__RND__QUOTE__,__RND__QUOT',
          'E__parent__RND__QUOTE__: __RND__QUOTE__def55283be9a49987766cd141894a19648f60e58__RND__QUOTE__,__RND__QUOTE__subject',
          '__RND__QUOTE__: __RND__QUOTE__Added git-client reopos dir methods__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __',
          'RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__1568315955__RND__QUOTE__,__RND__QUOTE__au',
          'thor__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@shri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n',
          '{__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__def55283be9a49987766cd141894a19648f60e58__RND__QUOTE__,__RND__QUOT',
          'E__parent__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__Initial co',
          'mmit__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE____RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: ',
          '__RND__QUOTE__1568279090__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__Serge Smirnov <sms-system@s',
          'hri2018.yaconnect.com>__RND__QUOTE__}__RND__EOL__\n'
        ]
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')

      let stdout = '', stderr = ''
      repo.getCommits(FAKE_HASH, 0, (data) => { stdout += data }, (data) => { stderr += data }, (code) => {
        expect(code).toBe(0)
        expect(stdout).toBe(`[{"hash": "a6166f3b952b4c9616cd99c9eee9446cab1b8b0c","parent": "ab857baf019303d30f651629f530664734ef6414","subject": "Added char counter api method","body": "","time": "1568580204","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "ab857baf019303d30f651629f530664734ef6414","parent": "e253163d8967909eb466703d15ac175738cfa20b","subject": "Option for stream objects data on commits log","body": "","time": "1568547195","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "e253163d8967909eb466703d15ac175738cfa20b","parent": "b48f1a70be84937897e1013ed8f3abbffa6a53db","subject": "Removed body-parser dependency (part of express)","body": "","time": "1568544454","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "b48f1a70be84937897e1013ed8f3abbffa6a53db","parent": "b6e6b7595f787635fe685ebdb11e4b4f43d3ea78","subject": "Added offset pagination","body": "","time": "1568543787","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "b6e6b7595f787635fe685ebdb11e4b4f43d3ea78","parent": "4e0c8601d869396015b68f4008d6f5402b891ae6","subject": "Process argument as repo path","body": "","time": "1568537740","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "4e0c8601d869396015b68f4008d6f5402b891ae6","parent": "f2568049dd8cf3b857ada1f07cd341dcd8d22792","subject": "Send errors as JSON","body": "","time": "1568536165","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "f2568049dd8cf3b857ada1f07cd341dcd8d22792","parent": "7ac6312a90f6c47aaa226e1675e48ac0f4f3784e","subject": "Added express api","body": "","time": "1568535603","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "7ac6312a90f6c47aaa226e1675e48ac0f4f3784e","parent": "eb4707030b34f41056eb9c06e35d8c210e078bbf","subject": "Json escape bug fixes, errorHandlers","body": "","time": "1568533521","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "eb4707030b34f41056eb9c06e35d8c210e078bbf","parent": "f4fe9f2df2b5b9342e823d7e26cd02e61f1e7cc2","subject": "Added all basic commands","body": "","time": "1568494531","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "f4fe9f2df2b5b9342e823d7e26cd02e61f1e7cc2","parent": "6af3a8e0388cd1ec6253a90f1156933a5e804d13","subject": "Add commit list getter func","body": "","time": "1568447630","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "6af3a8e0388cd1ec6253a90f1156933a5e804d13","parent": "def55283be9a49987766cd141894a19648f60e58","subject": "Added git-client reopos dir methods","body": "","time": "1568315955","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"},{"hash": "def55283be9a49987766cd141894a19648f60e58","parent": "","subject": "Initial commit","body": "","time": "1568279090","author": "Serge Smirnov <sms-system@shri2018.yaconnect.com>"}]`)
        expect(stderr).toBe('')
      })
    })

    test('primitive hacking attemt prevention works', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `log --format={__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__%H__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__%P__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__%s__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE__%b__RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__%at__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__%aN <%ae>__RND__QUOTE__}__RND__EOL__ --flag --`
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')
      const prohibited = jest.fn()

      repo.getCommits('--flag', 0, prohibited, (data) => {
        expect(data).toBe(ERROR_CODES.HACKING_ATTEMPT)
        expect(prohibited).not.toHaveBeenCalled()
      }, prohibited)
    })

    test('throw error on nonexistent hash or branch', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `log --format={__RND__QUOTE__hash__RND__QUOTE__: __RND__QUOTE__%H__RND__QUOTE__,__RND__QUOTE__parent__RND__QUOTE__: __RND__QUOTE__%P__RND__QUOTE__,__RND__QUOTE__subject__RND__QUOTE__: __RND__QUOTE__%s__RND__QUOTE__,__RND__QUOTE__body__RND__QUOTE__: __RND__QUOTE__%b__RND__QUOTE__,__RND__QUOTE__time__RND__QUOTE__: __RND__QUOTE__%at__RND__QUOTE__,__RND__QUOTE__author__RND__QUOTE__: __RND__QUOTE__%aN <%ae>__RND__QUOTE__}__RND__EOL__ ${FAKE_HASH} --`,
        [],
        [ `fatal: bad revision '${FAKE_HASH}'` ],
        128
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')
      const prohibited = jest.fn()

      repo.getCommits(FAKE_HASH, 0, prohibited, (data) => {
        expect(data).toBe(ERROR_CODES.BRANCH_OR_COMMIT_DOES_NOT_EXISTS)
        expect(prohibited).not.toHaveBeenCalled()
      }, prohibited)
    })
  })

  describe('getCommitDiff', () => {
    test('basic scenario', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `show -m ${FAKE_HASH} --`,
        [`commit b48f1a70be84937897e1013ed8f3abbffa6a53db
Author: Serge Smirnov <sms-system@shri2018.yaconnect.com>
Date:   Sun Sep 15 13:36:27 2019 +0300

    Added offset pagination

diff --git a/index.js b/index.js
index f46629a..bc59143 100644
--- a/index.js
+++ b/index.js
@@ -49,9 +49,12 @@ app.get('/api/repos', async (req, res) => {
   res.json(await req.reposDir.list())
 })
 
+// Send page positiion with \`page\` query
+// Example: /api/repos/cool-timer/commits/master?page=3
 app.get('/api/repos/:repositoryId/commits/:commitHash', (req, res) => {
   const { commitHash } = req.params
-  req.repo.getCommits(commitHash,
+  const { page } = req.query
+  req.repo.getCommits(commitHash, page,
     (data) => res.write(data),
     errHandler(res, 500),
     () => res.end()
@@ -67,22 +70,17 @@ app.get('/api/repos/:repositoryId/commits/:commitHash/diff', (req, res) => {
   )
 })
 
-app.get('/api/repos/:repositoryId', (req, res) => {
-  req.repo.getTree(undefined, undefined, false,
-    (data) => res.write(data),
-    errHandler(res, 500),
-    () => res.end()
-  )
-})
-
-app.get('/api/repos/:repositoryId/tree/:commitHash/:path(*)', (req, res) => {
+function getTreeHandler (req, res) {
   const { commitHash, path } = req.params
   req.repo.getTree(commitHash, path, false,
     (data) => res.write(data),
     errHandler(res, 500),
     () => res.end()
   )
-})
+}
+
+app.get('/api/repos/:repositoryId', getTreeHandler)
+app.get('/api/repos/:repositoryId/tree/:commitHash/:path(*)', getTreeHandler)
 
 app.get('/api/repos/:repositoryId/blob/:commitHash/:pathToFile(*)', blobMiddleware, (req, res) => {
   const { commitHash, pathToFile } = req.params
diff --git a/lib/git-client/index.js b/lib/git-client/index.js
index 13e7d35..690a3d2 100644
--- a/lib/git-client/index.js
+++ b/lib/git-client/index.js
@@ -7,6 +7,8 @@ const ERRORS = require('./error-codes')
 const GIT_DATA_FOLDER = '.git/'
 const GIT_BINARY = 'git'
 const GIT_CLONE_TIMEOUT = 60000
+const USE_COMMITS_LOG_PAGING = true
+const COMMITS_PER_PAGE = 20
 
 function isGitRepo (repoPath) {
   return fs.existsSync(path.join(repoPath, GIT_DATA_FOLDER))
@@ -161,7 +163,7 @@ class GitRepo {
     if (!isGitRepo(this.path)) throw ERRORS.REPO_DOES_NOT_EXISTS
   }
 
-  getCommits (commitHash, streamHandler = () => {}, errHandler = () => {}, closeHandler = () => {}) {
+  getCommits (commitHash, pageNum = 0, streamHandler = () => {}, errHandler = () => {}, closeHandler = () => {}) {
     if (isLooksLikeArg(commitHash)) return errHandler(ERRORS.HACKING_ATTEMPT)
 
     const QUOTE_DELIMETER = getDelimeterKey('QUOTE')
@@ -175,7 +177,9 @@ class GitRepo {
       author: '%aN <%ae>'
     }, QUOTE_DELIMETER, END_OF_LINE_DELIMETER)
 
-    const child = spawn(GIT_BINARY, ['log' , \`--format=\${fmtTpl}\`, commitHash, '--'], {
+    const fromPos = Number.parseInt(pageNum - 1) * COMMITS_PER_PAGE
+    const paginator = USE_COMMITS_LOG_PAGING ? ['--skip', fromPos, '-n', COMMITS_PER_PAGE] : []
+    const child = spawn(GIT_BINARY, ['log' , ...paginator,\`--format=\${fmtTpl}\`, commitHash, '--'], {
       cwd: this.path, stdio: ['ignore', 'pipe', 'pipe']
     })
     const chunkProcessor = getChunksJSONNormalizer(QUOTE_DELIMETER, END_OF_LINE_DELIMETER)
`])

      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')

      let stdout = '', stderr = ''
      repo.getCommitDiff(FAKE_HASH, (data) => { stdout += data }, (data) => { stderr += data }, (code) => {
        expect(code).toBe(0)
        expect(stdout).toBe(`{"diffContent":"commit b48f1a70be84937897e1013ed8f3abbffa6a53db\\nAuthor: Serge Smirnov <sms-system@shri2018.yaconnect.com>\\nDate:   Sun Sep 15 13:36:27 2019 +0300\\n\\n    Added offset pagination\\n\\ndiff --git a/index.js b/index.js\\nindex f46629a..bc59143 100644\\n--- a/index.js\\n+++ b/index.js\\n@@ -49,9 +49,12 @@ app.get('/api/repos', async (req, res) => {\\n   res.json(await req.reposDir.list())\\n })\\n \\n+// Send page positiion with \`page\` query\\n+// Example: /api/repos/cool-timer/commits/master?page=3\\n app.get('/api/repos/:repositoryId/commits/:commitHash', (req, res) => {\\n   const { commitHash } = req.params\\n-  req.repo.getCommits(commitHash,\\n+  const { page } = req.query\\n+  req.repo.getCommits(commitHash, page,\\n     (data) => res.write(data),\\n     errHandler(res, 500),\\n     () => res.end()\\n@@ -67,22 +70,17 @@ app.get('/api/repos/:repositoryId/commits/:commitHash/diff', (req, res) => {\\n   )\\n })\\n \\n-app.get('/api/repos/:repositoryId', (req, res) => {\\n-  req.repo.getTree(undefined, undefined, false,\\n-    (data) => res.write(data),\\n-    errHandler(res, 500),\\n-    () => res.end()\\n-  )\\n-})\\n-\\n-app.get('/api/repos/:repositoryId/tree/:commitHash/:path(*)', (req, res) => {\\n+function getTreeHandler (req, res) {\\n   const { commitHash, path } = req.params\\n   req.repo.getTree(commitHash, path, false,\\n     (data) => res.write(data),\\n     errHandler(res, 500),\\n     () => res.end()\\n   )\\n-})\\n+}\\n+\\n+app.get('/api/repos/:repositoryId', getTreeHandler)\\n+app.get('/api/repos/:repositoryId/tree/:commitHash/:path(*)', getTreeHandler)\\n \\n app.get('/api/repos/:repositoryId/blob/:commitHash/:pathToFile(*)', blobMiddleware, (req, res) => {\\n   const { commitHash, pathToFile } = req.params\\ndiff --git a/lib/git-client/index.js b/lib/git-client/index.js\\nindex 13e7d35..690a3d2 100644\\n--- a/lib/git-client/index.js\\n+++ b/lib/git-client/index.js\\n@@ -7,6 +7,8 @@ const ERRORS = require('./error-codes')\\n const GIT_DATA_FOLDER = '.git/'\\n const GIT_BINARY = 'git'\\n const GIT_CLONE_TIMEOUT = 60000\\n+const USE_COMMITS_LOG_PAGING = true\\n+const COMMITS_PER_PAGE = 20\\n \\n function isGitRepo (repoPath) {\\n   return fs.existsSync(path.join(repoPath, GIT_DATA_FOLDER))\\n@@ -161,7 +163,7 @@ class GitRepo {\\n     if (!isGitRepo(this.path)) throw ERRORS.REPO_DOES_NOT_EXISTS\\n   }\\n \\n-  getCommits (commitHash, streamHandler = () => {}, errHandler = () => {}, closeHandler = () => {}) {\\n+  getCommits (commitHash, pageNum = 0, streamHandler = () => {}, errHandler = () => {}, closeHandler = () => {}) {\\n     if (isLooksLikeArg(commitHash)) return errHandler(ERRORS.HACKING_ATTEMPT)\\n \\n     const QUOTE_DELIMETER = getDelimeterKey('QUOTE')\\n@@ -175,7 +177,9 @@ class GitRepo {\\n       author: '%aN <%ae>'\\n     }, QUOTE_DELIMETER, END_OF_LINE_DELIMETER)\\n \\n-    const child = spawn(GIT_BINARY, ['log' , \`--format=\${fmtTpl}\`, commitHash, '--'], {\\n+    const fromPos = Number.parseInt(pageNum - 1) * COMMITS_PER_PAGE\\n+    const paginator = USE_COMMITS_LOG_PAGING ? ['--skip', fromPos, '-n', COMMITS_PER_PAGE] : []\\n+    const child = spawn(GIT_BINARY, ['log' , ...paginator,\`--format=\${fmtTpl}\`, commitHash, '--'], {\\n       cwd: this.path, stdio: ['ignore', 'pipe', 'pipe']\\n     })\\n     const chunkProcessor = getChunksJSONNormalizer(QUOTE_DELIMETER, END_OF_LINE_DELIMETER)\\n"}`)
        expect(stderr).toBe('')
      })
    })

    test('primitive hacking attemt prevention works', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `show -m ${FAKE_HASH} --`
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')
      const prohibited = jest.fn()

      repo.getCommitDiff('--flag', prohibited, (data) => {
        expect(data).toBe(ERROR_CODES.HACKING_ATTEMPT)
        expect(prohibited).not.toHaveBeenCalled()
      }, prohibited)
    })

    test('throw error on nonexistent hash or branch', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `show -m ${FAKE_HASH} --`,
        [],
        [ `fatal: bad revision '${FAKE_HASH}'` ],
        128
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')
      const prohibited = jest.fn()

      repo.getCommitDiff(FAKE_HASH, prohibited, (data) => {
        expect(data).toBe(ERROR_CODES.BRANCH_OR_COMMIT_DOES_NOT_EXISTS)
        expect(prohibited).not.toHaveBeenCalled()
      }, prohibited)
    })
  })
})