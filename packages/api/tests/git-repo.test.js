const rewire = require('rewire')
const ERROR_CODES = require('../lib/error-codes').default
const config = require('../config').default

const GIT_BINARY = config.get('git').binary
const REPOS_DIR = '../../fixtures/repos'
const NOT_GIT_DIR = '../../fixtures/not_git'
const NON_EXISTS_REPOS_DIR = '../../fixtures/non_exists_repos'

const FAKE_HASH = 'b48f1a70be84937897e1013ed8f3abbffa6a53db'

function nextTick (fn) { setTimeout(fn, 0) }

// Monkey patch spawn method
function GitRepoGetter (cwd, argsString, stdout = [], stderr = [], code = 0) {
  const GitRepo = rewire('../lib/git-repo')
  GitRepo.__set__('utils_1', {
    ...require('../lib/utils'),
    getDelimeterKey: (postfix) => `__RND__${postfix}__`,
  })
  GitRepo.__set__('child_process_1', {
    ...require('child_process'),
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
  return GitRepo.default
}

describe('Git Repo class', () => {

  describe('constructor', () => {

    test('creates instance of GitRepo class for git repo', () => {
      const GitRepo = GitRepoGetter()
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')

      expect(repo).toBeInstanceOf(GitRepo)
    })

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
        ['FOO', 'BAR', '"\n\''])

      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')

      let stdout = '', stderr = ''
      repo.getCommitDiff(FAKE_HASH, (data) => { stdout += data }, (data) => { stderr += data }, (code) => {
        expect(code).toBe(0)
        expect(stdout).toBe(`{"diffContent":"FOOBAR\\\"\\n'"}`)
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

  describe('getTree', () => {

    test('show content for root', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `ls-tree -l -- ${FAKE_HASH}`,
        [
          '100644 blob 91a196c94559e760a527f944b2d973908e593abb     130	.editorconfig\n',
          '100644 blob b512c09d476623ff4bf8d0d63c29b784925dbdf8      12	.gitignore\n',
          '100644 blob 1b0d8e5c0a12fe3c967198d540fd50233a761ce9      88	README.md\n',
          '100644 blob 3a76b27876c207c3a11e66e50326763af7617581    3149	index.js\n',
          '040000 tree 65e9481353ae1257eff5b1e4b2bd4b707bf905e9       -	lib\n',
          '100644 blob 7c5cb3266f4338a1aa1a82a36eca3032e81504c0     357	package.json\n',
          '100644 blob 8fc51459a65bfb5b218b94ad3d6147e01e0ec5aa   15709	yarn.lock\n'
        ]
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')

      let stdout = '', stderr = ''
      repo.getTree(FAKE_HASH, undefined, {}, (data) => { stdout += data }, (data) => { stderr += data }, (code) => {
        expect(code).toBe(0)
        expect(stdout).toBe('[{"name": ".editorconfig", "type": "blob", "size": "130", "objHash": "91a196c94559e760a527f944b2d973908e593abb", "mode": "100644"},{"name": ".gitignore", "type": "blob", "size": "12", "objHash": "b512c09d476623ff4bf8d0d63c29b784925dbdf8", "mode": "100644"},{"name": "README.md", "type": "blob", "size": "88", "objHash": "1b0d8e5c0a12fe3c967198d540fd50233a761ce9", "mode": "100644"},{"name": "index.js", "type": "blob", "size": "3149", "objHash": "3a76b27876c207c3a11e66e50326763af7617581", "mode": "100644"},{"name": "lib", "type": "tree", "size": "-", "objHash": "65e9481353ae1257eff5b1e4b2bd4b707bf905e9", "mode": "040000"},{"name": "package.json", "type": "blob", "size": "357", "objHash": "7c5cb3266f4338a1aa1a82a36eca3032e81504c0", "mode": "100644"},{"name": "yarn.lock", "type": "blob", "size": "15709", "objHash": "8fc51459a65bfb5b218b94ad3d6147e01e0ec5aa", "mode": "100644"}]')
        expect(stderr).toBe('')
      })
    })

    test('on fragmented spawn stream', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `ls-tree -l -- ${FAKE_HASH}`,
        [
          '100644 blob 91a196c94559e760a527f94',
          '4b2d973908e593abb     130	.editorconfig\n100644 blob b512c09d476623',
          'ff4bf8d0d63c29b784925dbdf8      12	.gitignore\n100644 blob 1b0d8e5c0',
          'a12fe3c967198d540fd50233a761ce9      88	README.md\n100644 blob 3a76',
          'b27876c207c3a11e66e50326763af7617581    3149	index.js\n040000 tree 6',
          '5e9481353ae1257eff5b1e4b2bd4b707bf905e9       -	lib\n100644 blob 7c',
          '5cb3266f4338a1aa1a82a36eca3032e81504c0     357	package.json\n',
          '100644 blob 8fc51459a65bfb5b218b94ad3d6147e01e0ec5aa   15709	yarn.lock\n'
        ]
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')

      let stdout = '', stderr = ''
      repo.getTree(FAKE_HASH, undefined, {}, (data) => { stdout += data }, (data) => { stderr += data }, (code) => {
        expect(code).toBe(0)
        expect(stdout).toBe('[{"name": ".editorconfig", "type": "blob", "size": "130", "objHash": "91a196c94559e760a527f944b2d973908e593abb", "mode": "100644"},{"name": ".gitignore", "type": "blob", "size": "12", "objHash": "b512c09d476623ff4bf8d0d63c29b784925dbdf8", "mode": "100644"},{"name": "README.md", "type": "blob", "size": "88", "objHash": "1b0d8e5c0a12fe3c967198d540fd50233a761ce9", "mode": "100644"},{"name": "index.js", "type": "blob", "size": "3149", "objHash": "3a76b27876c207c3a11e66e50326763af7617581", "mode": "100644"},{"name": "lib", "type": "tree", "size": "-", "objHash": "65e9481353ae1257eff5b1e4b2bd4b707bf905e9", "mode": "040000"},{"name": "package.json", "type": "blob", "size": "357", "objHash": "7c5cb3266f4338a1aa1a82a36eca3032e81504c0", "mode": "100644"},{"name": "yarn.lock", "type": "blob", "size": "15709", "objHash": "8fc51459a65bfb5b218b94ad3d6147e01e0ec5aa", "mode": "100644"}]')
        expect(stderr).toBe('')
      })
    })

    test('show content for subtree', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `ls-tree -l -- ${FAKE_HASH}:lib`,
        [
          '100644 blob 91a196c94559e760a527f944b2d973908e593abb     130	.editorconfig\n',
          '100644 blob b512c09d476623ff4bf8d0d63c29b784925dbdf8      12	.gitignore\n',
          '100644 blob 1b0d8e5c0a12fe3c967198d540fd50233a761ce9      88	README.md\n',
          '100644 blob 3a76b27876c207c3a11e66e50326763af7617581    3149	index.js\n',
          '040000 tree 65e9481353ae1257eff5b1e4b2bd4b707bf905e9       -	lib\n',
          '100644 blob 7c5cb3266f4338a1aa1a82a36eca3032e81504c0     357	package.json\n',
          '100644 blob 8fc51459a65bfb5b218b94ad3d6147e01e0ec5aa   15709	yarn.lock\n'
        ]
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')

      let stdout = '', stderr = ''
      repo.getTree(FAKE_HASH, 'lib', {}, (data) => { stdout += data }, (data) => { stderr += data }, (code) => {
        expect(code).toBe(0)
        expect(stdout).toBe('[{"name": ".editorconfig", "type": "blob", "size": "130", "objHash": "91a196c94559e760a527f944b2d973908e593abb", "mode": "100644"},{"name": ".gitignore", "type": "blob", "size": "12", "objHash": "b512c09d476623ff4bf8d0d63c29b784925dbdf8", "mode": "100644"},{"name": "README.md", "type": "blob", "size": "88", "objHash": "1b0d8e5c0a12fe3c967198d540fd50233a761ce9", "mode": "100644"},{"name": "index.js", "type": "blob", "size": "3149", "objHash": "3a76b27876c207c3a11e66e50326763af7617581", "mode": "100644"},{"name": "lib", "type": "tree", "size": "-", "objHash": "65e9481353ae1257eff5b1e4b2bd4b707bf905e9", "mode": "040000"},{"name": "package.json", "type": "blob", "size": "357", "objHash": "7c5cb3266f4338a1aa1a82a36eca3032e81504c0", "mode": "100644"},{"name": "yarn.lock", "type": "blob", "size": "15709", "objHash": "8fc51459a65bfb5b218b94ad3d6147e01e0ec5aa", "mode": "100644"}]')
        expect(stderr).toBe('')
      })
    })

    test('recursive list content', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `ls-tree -l -r -- ${FAKE_HASH}`,
        [
          '100644 blob 91a196c94559e760a527f944b2d973908e593abb     130	.editorconfig\n',
          '100644 blob b512c09d476623ff4bf8d0d63c29b784925dbdf8      12	.gitignore\n',
          '100644 blob 1b0d8e5c0a12fe3c967198d540fd50233a761ce9      88	README.md\n',
          '100644 blob 3a76b27876c207c3a11e66e50326763af7617581    3149	index.js\n',
          '100644 blob 9c4e5b1da8e57e263297e770c0f0ec5638c188a4     567	lib/git-client/error-codes.js\n',
          '100644 blob 5ad0503156768f12126879e31ff5ef7af5339ff5   12284	lib/git-client/index.js\n',
          '100644 blob b05c599744b8274f77a97e2c6ac40c209f54ab5f    1621	lib/symbolCounter.js\n',
          '100644 blob 7c5cb3266f4338a1aa1a82a36eca3032e81504c0     357	package.json\n',
          '100644 blob 8fc51459a65bfb5b218b94ad3d6147e01e0ec5aa   15709	yarn.lock\n'
        ]
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')

      let stdout = '', stderr = ''
      repo.getTree(FAKE_HASH, undefined, { isRecursive: true }, (data) => { stdout += data }, (data) => { stderr += data }, (code) => {
        expect(code).toBe(0)
        expect(stdout).toBe('[{"name": ".editorconfig", "type": "blob", "size": "130", "objHash": "91a196c94559e760a527f944b2d973908e593abb", "mode": "100644"},{"name": ".gitignore", "type": "blob", "size": "12", "objHash": "b512c09d476623ff4bf8d0d63c29b784925dbdf8", "mode": "100644"},{"name": "README.md", "type": "blob", "size": "88", "objHash": "1b0d8e5c0a12fe3c967198d540fd50233a761ce9", "mode": "100644"},{"name": "index.js", "type": "blob", "size": "3149", "objHash": "3a76b27876c207c3a11e66e50326763af7617581", "mode": "100644"},{"name": "lib/git-client/error-codes.js", "type": "blob", "size": "567", "objHash": "9c4e5b1da8e57e263297e770c0f0ec5638c188a4", "mode": "100644"},{"name": "lib/git-client/index.js", "type": "blob", "size": "12284", "objHash": "5ad0503156768f12126879e31ff5ef7af5339ff5", "mode": "100644"},{"name": "lib/symbolCounter.js", "type": "blob", "size": "1621", "objHash": "b05c599744b8274f77a97e2c6ac40c209f54ab5f", "mode": "100644"},{"name": "package.json", "type": "blob", "size": "357", "objHash": "7c5cb3266f4338a1aa1a82a36eca3032e81504c0", "mode": "100644"},{"name": "yarn.lock", "type": "blob", "size": "15709", "objHash": "8fc51459a65bfb5b218b94ad3d6147e01e0ec5aa", "mode": "100644"}]')
        expect(stderr).toBe('')
      })
    })

    test('throw error on nonexistent hash or branch', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `ls-tree -l -- ${FAKE_HASH}:package.json`,
        [],
        [ `fatal: Not a valid object name master:foo` ],
        128
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')
      const prohibited = jest.fn()

      repo.getTree(FAKE_HASH, 'package.json', {}, (data) => {
        expect(data).toBe(ERROR_CODES.BRANCH_OR_COMMIT_OR_PATH_DOES_NOT_EXISTS)
        expect(prohibited).not.toHaveBeenCalled()
      }, prohibited)
    })

    test('throw error on not tree object type', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `ls-tree -l -- ${FAKE_HASH}:package.json`,
        [],
        [ `fatal: not a tree object` ],
        128
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')
      const prohibited = jest.fn()

      repo.getTree(FAKE_HASH, 'package.json', {}, (data) => {
        expect(data).toBe(ERROR_CODES.IS_NOT_A_DIRECTORY)
        expect(prohibited).not.toHaveBeenCalled()
      }, prohibited)
    })

  })

  describe('getBlobContent', () => {

    test('show content of blob', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `show ${FAKE_HASH}:test`,
        [ 'FOO', 'BAR' ],
        [],
        0
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')

      let stdout = '', stderr = ''
      repo.getBlobContent(FAKE_HASH, 'test', (data) => { stdout += data }, (data) => { stderr += data }, (code) => {
        expect(code).toBe(0)
        expect(stdout).toBe('FOOBAR')
        expect(stderr).toBe('')
      })
    })

    test('primitive hacking attemt prevention works', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        'show --flag:foo',
        [],
        [],
        0
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')
      const prohibited = jest.fn()

      repo.getBlobContent('--flag', 'foo', prohibited, (data) => {
        expect(data).toBe(ERROR_CODES.HACKING_ATTEMPT)
        expect(prohibited).not.toHaveBeenCalled()
      }, prohibited)
    })

    test('throw error on nonexistent hash or branch', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        'show foo:foo',
        [],
        [ `fatal: Invalid object name 'foo'` ],
        128
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')
      const prohibited = jest.fn()

      repo.getBlobContent('foo', 'foo', prohibited, (data) => {
        expect(data).toBe(ERROR_CODES.BRANCH_OR_COMMIT_DOES_NOT_EXISTS)
        expect(prohibited).not.toHaveBeenCalled()
      }, prohibited)
    })

    test('throw error on file not found', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `show ${FAKE_HASH}:foo`,
        [],
        [ `fatal: Path 'foo' does not exist in 'master'` ],
        128
      )
      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')
      const prohibited = jest.fn()

      repo.getBlobContent(FAKE_HASH, 'foo', prohibited, (data) => {
        expect(data).toBe(ERROR_CODES.FILE_NOT_FOUND)
        expect(prohibited).not.toHaveBeenCalled()
      }, prohibited)
    })

  })

  describe('getSymbolsCount', () => {

    test('character counting works', () => {
      const GitRepo = GitRepoGetter(
        '../../fixtures/repos/refactored-waddle/',
        `ls-tree -l -r -- ${FAKE_HASH}`,
        [
          '100644 blob 91a196c94559e760a527f944b2d973908e593abb     130	.editorconfig\n',
          '100644 blob b512c09d476623ff4bf8d0d63c29b784925dbdf8      12	.gitignore\n',
          '100644 blob 1b0d8e5c0a12fe3c967198d540fd50233a761ce9      88	README.md\n',
          '100644 blob 3a76b27876c207c3a11e66e50326763af7617581    3149	index.js\n',
          '100644 blob 9c4e5b1da8e57e263297e770c0f0ec5638c188a4     567	lib/git-client/error-codes.js\n',
          '100644 blob 5ad0503156768f12126879e31ff5ef7af5339ff5   12284	lib/git-client/index.js\n',
          '100644 blob b05c599744b8274f77a97e2c6ac40c209f54ab5f    1621	lib/symbolCounter.js\n',
          '100644 blob 7c5cb3266f4338a1aa1a82a36eca3032e81504c0     357	package.json\n',
          '100644 blob 8fc51459a65bfb5b218b94ad3d6147e01e0ec5aa   15709	yarn.lock\n'
        ],
        [],
        0
      )

      const repo = new GitRepo(REPOS_DIR, 'refactored-waddle')
      const prohibited = jest.fn()

      repo.getSymbolsCount(FAKE_HASH, prohibited, (data) => {
        expect(prohibited).not.toHaveBeenCalled()
        expect(data).toEqual({0:438,1:561,2:353,3:254,4:253,5:259,6:256,7:225,8:210,9:224,r:1555,o:1072,t:1506," ":3800,"=":342,u:368,e:2062,"\n":905,"[":35,"*":5,"]":35,i:1052,n:957,d:751,_:179,s:1279,y:426,l:578,p:646,a:1035,c:703,z:132,h:478,f:416,"-":341,m:466,g:478,w:133,"#":61,N:162,J:79,S:209,H:167,k:195,M:125,G:112,v:215,"`":22,"/":420,q:131,"(":429,"'":297,")":429,x:107,"{":175,R:285,D:146,",":273,"}":173,".":981,b:287,P:176,O:237,T:225,E:278,I:212,"!":24,U:83,":":222,'"':495,">":88,C:166,j:89,";":9,"|":7,"?":11,F:96,B:90,K:56,$:20,X:91,A:115,L:98,Y:64,V:61,"+":75,W:56,"\\":32,"С":1,"т":3,"р":5,"а":7,"ш":1,"н":6,"о":9,"в":5,"ы":4,"г":4,"л":2,"я":6,"д":3,"щ":2,"ф":1,"у":2,"к":7,"ц":1,"и":6,"м":1,"п":3,"э":2,"с":3,"е":5,"й":1,"х":1,"ч":1,"ю":1,"&":16,"^":13,Q:72,"%":7,"<":9,"@":61,"~":63,Z:66})
      })
    })

  })

})