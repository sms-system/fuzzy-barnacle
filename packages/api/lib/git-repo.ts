import path from 'path'
import { spawn, fork } from 'child_process'
import config from '../config'

const gitConfig = config.get('git')

import ERRORS from './error-codes'
const GIT_BINARY = gitConfig.binary
const COMMITS_PER_PAGE = config.get('commitsPerPage')
const USE_COMMITS_LOG_PAGING = !!COMMITS_PER_PAGE

import {
  constructGitLogFmtTpl,
  doJSONEscape,
  getChunksJSONNormalizer,
  getDelimeterKey,
  gitTreeRecordFormat,
  isGitRepo,
  isLooksLikeArg,
  sanitizeRepositoryId
} from './utils'

export default class GitRepo {
  path: string

  constructor (dirPath: string, repositoryId: string | null, checkIsGitDir = true) {
    if (repositoryId) {
      const sanitizedRepositoryId = sanitizeRepositoryId(repositoryId)
      if (!sanitizedRepositoryId) throw ERRORS.REPO_DOES_NOT_EXISTS
      this.path = path.join(dirPath, sanitizedRepositoryId)
    } else {
      this.path = dirPath
    }
    if (!isGitRepo(this.path) && checkIsGitDir) throw ERRORS.REPO_DOES_NOT_EXISTS
  }

  getCommits (
    commitHash: string,
    pageNum: string | number = 0,
    streamHandler = (data: string) => {},
    errHandler = (data: string) => {},
    closeHandler = (code: number) => {}
  ) {
    if (isLooksLikeArg(commitHash)) return errHandler(ERRORS.HACKING_ATTEMPT)

    const QUOTE_DELIMETER = getDelimeterKey('QUOTE')
    const END_OF_LINE_DELIMETER = getDelimeterKey('EOL')
    const fmtTpl = constructGitLogFmtTpl({
      hash: '%H',
      parent: '%P',
      subject: '%s',
      body: '%b',
      time: '%at',
      author: '%aN <%ae>'
    }, QUOTE_DELIMETER, END_OF_LINE_DELIMETER)

    const fromPos = (parseInt(pageNum.toString()) - 1) * COMMITS_PER_PAGE
    const paginator = USE_COMMITS_LOG_PAGING ? ['--skip', fromPos.toString(), '-n', COMMITS_PER_PAGE.toString()] : []
    const child = spawn(GIT_BINARY, ['log' , ...paginator,`--format=${fmtTpl}`, commitHash, '--'], {
      cwd: this.path, stdio: ['ignore', 'pipe', 'pipe']
    })
    const chunkProcessor = getChunksJSONNormalizer(QUOTE_DELIMETER, END_OF_LINE_DELIMETER)

    let errorMsg = '', outputStarted = false
    child.stderr.on('data', (data: Buffer | string) => { errorMsg = data.toString() })
    child.stdout.on('data', (data) => { chunkProcessor(data, (chunk) => {
      if (!outputStarted) { streamHandler('['); outputStarted = true }
      streamHandler(chunk)
    }) })
    child.on('close', (code) => {
      const lastChunk = chunkProcessor.getLastChunk()
      if (lastChunk) streamHandler(lastChunk + ']')
      if (!code) return closeHandler(code)
      if (errorMsg.startsWith('fatal: bad revision')) return errHandler(ERRORS.BRANCH_OR_COMMIT_DOES_NOT_EXISTS)
      return errHandler(ERRORS.UNEXPECTED_ERROR)
    })
  }

  getCommitDiff (commitHash: string, streamHandler = (data: string) => {}, errHandler = (data: string) => {}, closeHandler = (code: number) => {}) {
    if (isLooksLikeArg(commitHash)) return errHandler(ERRORS.HACKING_ATTEMPT)

    const child = spawn(GIT_BINARY, ['show' , '-m', commitHash, '--'], {
      cwd: this.path, stdio: ['ignore', 'pipe', 'pipe']
    })

    let errorMsg = '', outputStarted = false
    child.stderr.on('data', (data) => { errorMsg = data.toString() })
    child.stdout.on('data', (data) => {
      if (!outputStarted) { streamHandler('{"diffContent":"'); outputStarted = true }
      streamHandler(doJSONEscape(data.toString()))
    })
    child.on('close', (code) => {
      if (outputStarted) { streamHandler('"}') }
      if (!code) return closeHandler(code)
      if (errorMsg.startsWith('fatal: bad revision') || errorMsg.startsWith('fatal: bad object')) {
        return errHandler(ERRORS.BRANCH_OR_COMMIT_DOES_NOT_EXISTS)
      }
      return errHandler(ERRORS.UNEXPECTED_ERROR)
    })
  }

  getTree (commitHash = 'master', dirPath: string | null, {
    isRecursive = false,
    isJSONStr = true
  }, streamHandler = (data: string | any[]) => {}, errHandler = (data: string) => {}, closeHandler = (code: number) => {}) {
    const recursiveFlags = isRecursive ? [ '-r' ] : []
    const child = spawn(GIT_BINARY, ['ls-tree' , '-l', ...recursiveFlags, '--', commitHash + (dirPath? ':' + dirPath : '')], {
      cwd: this.path, stdio: ['ignore', 'pipe', 'pipe']
    })

    let errorMsg = '', JSONOutputStarted = false, prevChunk = '', isFirstChunk = true
    child.stderr.on('data', (data) => { errorMsg = data.toString() })
    child.stdout.on('data', (data) => {
      if (!JSONOutputStarted && isJSONStr) { streamHandler('['); JSONOutputStarted = true }
      const lines = (prevChunk + data.toString()).split('\n')
      prevChunk = lines.pop() || ''
      if (lines.length) {
        if (!isFirstChunk && isJSONStr) { streamHandler(',') }
        isFirstChunk = false
        const processedPart = isJSONStr ?
          lines.map(line => gitTreeRecordFormat(line)).join(',') :
          lines.map(line => JSON.parse(gitTreeRecordFormat(line)))
        streamHandler(processedPart)
      }
    })
    child.on('close', (code) => {
      if (prevChunk.length) {
        const processedPart = isJSONStr ?
          ',' + gitTreeRecordFormat(prevChunk) :
          JSON.parse(gitTreeRecordFormat(prevChunk))
        streamHandler(processedPart)
      }
      if (JSONOutputStarted) { streamHandler(']') }
      if (!code) return closeHandler(code)
      if (errorMsg.startsWith('fatal: Not a valid object name')) return errHandler(ERRORS.BRANCH_OR_COMMIT_OR_PATH_DOES_NOT_EXISTS)
      if (errorMsg.startsWith('fatal: not a tree object')) return errHandler(ERRORS.IS_NOT_A_DIRECTORY)
      return errHandler(ERRORS.UNEXPECTED_ERROR)
    })
  }

  getBlobContent (commitHash: string, filePath: string, streamHandler = (data: string) => {}, errHandler = (data: string) => {}, closeHandler = (code: number) => {}) {
    if (isLooksLikeArg(commitHash) || commitHash.indexOf(':') >= 0) return errHandler(ERRORS.HACKING_ATTEMPT)

    const child = spawn(GIT_BINARY, ['show' ,`${commitHash}:${filePath}`], {
      cwd: this.path, stdio: ['ignore', 'pipe', 'pipe']
    })

    let errorMsg = ''
    child.stderr.on('data', (data) => { errorMsg = data.toString() })
    child.stdout.on('data', (data) => { streamHandler(data) })
    child.on('close', (code) => {
      if (!code) return closeHandler(code)
      if (errorMsg.startsWith('fatal: Invalid object name')) return errHandler(ERRORS.BRANCH_OR_COMMIT_DOES_NOT_EXISTS)
      if (errorMsg.startsWith('fatal: Path')) return errHandler(ERRORS.FILE_NOT_FOUND)
      return errHandler(ERRORS.UNEXPECTED_ERROR)
    })
  }

  getSymbolsCount (commitHash: string, ignoreBinary = true, streamHandler = (data: string) => {}, errHandler = (data: string) => {}, closeHandler = (obj: { [key:string]: string }) => {}) {
    const globalSymbols: { [key:string]: string } = {}
    let workersCount = 0, isEnded = false
    this.getTree(commitHash, null, { isRecursive: true, isJSONStr: false }, (tree) => {
      const fileList = (tree as any[]).filter(entry => entry.type === 'blob')
      const child = fork('./lib/symbol-counter.js')
      workersCount++
      child.send({ fileList, repoPath: this.path, commitHash, ignoreBinary })
      child.on('message', ({ symbols, ignoredFiles }) => {
        Object.keys(symbols).forEach(key => {
          globalSymbols[key] = globalSymbols[key] ? globalSymbols[key] + symbols[key] : symbols[key]
        })
        // ignoredFilesHandler(ignoredFiles)
        workersCount--
        child.kill()
        if (!workersCount && isEnded) { closeHandler(globalSymbols) }
      })
    }, errHandler, () => {
      isEnded = true
      if (!workersCount) { isEnded = false, closeHandler(globalSymbols) }
    })
  }
}