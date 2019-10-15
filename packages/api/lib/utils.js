const fs = require('fs')
const fsPromise = fs.promises
const path = require('path')
const config = require('../config')

const GIT_DATA_FOLDER = config.get('git').dataFolder

function isGitRepo (repoPath) {
  return fs.existsSync(path.join(repoPath, GIT_DATA_FOLDER))
}

function normalizeDirPath (name) {
  return path.normalize(name) + '/'
}

function sanitizeRepositoryId (name) {
  const normalizedName = normalizeDirPath(name)
  return !normalizedName || normalizedName.startsWith('../') ? null : normalizedName
}

async function rmrf (dirPath) {
  // I don't use recursive option in rmdir for backward compatibility with old node versions
  const entries = await fsPromise.readdir(dirPath, { withFileTypes: true })
  await Promise.all(entries.map(entry => {
    const fullPath = path.join(dirPath, entry.name)
    return entry.isDirectory() ? rmrf(fullPath) : fsPromise.unlink(fullPath)
  }))
  await fsPromise.rmdir(dirPath)
}

function isLooksLikeArg (str) {
  return str.startsWith('-')
}

function getDelimeterKey (postfix) {
  // return `__RND_DELIMETER__${(Math.random()*10e8).toString(36).replace('.', '_')}__${postfix}__`
  return `__RND__${postfix}__`
}

function constructGitLogFmtTpl(obj, quoteDelimeter, endOfLineDelimeter) {
  const parts = Object.keys(obj).map((key) => `${quoteDelimeter}${key}${quoteDelimeter}: ${quoteDelimeter}${obj[key]}${quoteDelimeter}`)
  return `{${parts.join(',')}}${endOfLineDelimeter}`
}

function setProcessTimeout (proc, callback, time) {
  return setTimeout(() => {
    proc.stdout.destroy()
    proc.stderr.destroy()
    proc.kill()
    callback()
  }, time)
}

function doJSONEscape (str) {
  return str
  .replace(/\\/g, '\\\\')
  .replace(/\r\n/g, '\\n')
  .replace(/\n/g, '\\n')
  .replace(/\t/g, '\\t')
  .replace(/"/g, '\\\"')
  .replace(/\u0008/g, '\\b')
  .replace(/[\u007F-\uFFFF]/g, (chr) => {
    return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
  })
}

// Страшно выглядящая функция, для магии потокового эскепинга двойных кавычек в строке и экранирующая переносы
function getChunksJSONNormalizer (quoteDelimeter, endOfLineDelimeter) {
  const endOfLineDelimeterOnTheBorders = endOfLineDelimeter + '\n{'
  const maxRestLength = Math.max(quoteDelimeter.length, endOfLineDelimeterOnTheBorders.length)
  const doReplaces = (chunk) => doJSONEscape(
    chunk.replace(new RegExp(endOfLineDelimeterOnTheBorders, 'g'), ',{')
  )
    .replace(new RegExp(quoteDelimeter, 'g'), '"')

  let chunk, lastChunk = null
  const processor = function(data, handler) {
    if (!lastChunk) { lastChunk = data.toString(); return }
    const currentChunk = data.toString()
    const lastPlaceholderPos = Math.max(currentChunk.lastIndexOf(quoteDelimeter), currentChunk.lastIndexOf(endOfLineDelimeterOnTheBorders))
    if (lastPlaceholderPos !== -1) {
      chunk = lastChunk + currentChunk.substr(0, lastPlaceholderPos)
      lastChunk = currentChunk.substr(lastPlaceholderPos)
    } else {
      chunk = lastChunk + currentChunk.slice(0, -maxRestLength)
      lastChunk = currentChunk.slice(-maxRestLength)
    }
    handler(doReplaces(chunk))
  }
  processor.getLastChunk = () => lastChunk && doReplaces(lastChunk.replace(new RegExp(endOfLineDelimeter+'\n', 'g'), ''))

  return processor
}

function gitTreeRecordFormat (line) {
  const delimeterPos = line.indexOf('\t')
  const fileName = doJSONEscape(line.substr(delimeterPos + 1).replace(/^"|"$/g, ''))
  const [mode, type, objHash, size] = line.substr(0, delimeterPos).split(/\s+/)
  return `{"name": "${fileName}", "type": "${type}", "size": "${size}", "objHash": "${objHash}", "mode": "${mode}"}`
}

module.exports = {
  constructGitLogFmtTpl,
  doJSONEscape,
  getChunksJSONNormalizer,
  getDelimeterKey,
  gitTreeRecordFormat,
  isGitRepo,
  isLooksLikeArg,
  normalizeDirPath,
  rmrf,
  sanitizeRepositoryId,
  setProcessTimeout
}