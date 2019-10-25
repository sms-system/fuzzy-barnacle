import fs from 'fs'
const fsPromise = fs.promises

import path from 'path'
import config from '../config'
import { ChildProcessWithoutNullStreams } from 'child_process'

const GIT_DATA_FOLDER = config.get('git').dataFolder

export function isGitRepo (repoPath: string) {
  return fs.existsSync(path.join(repoPath, GIT_DATA_FOLDER))
}

export function normalizeDirPath (name: string) {
  return path.normalize(name) + '/'
}

export function sanitizeRepositoryId (name: string) {
  const normalizedName = normalizeDirPath(name)
  return !normalizedName ||
         normalizedName.startsWith('../') ||
         normalizedName.slice(0, -1).indexOf(path.sep) !== -1? null : normalizedName
}

export async function rmrf (dirPath: string) {
  // I don't use recursive option in rmdir for backward compatibility with old node versions
  const entries = await fsPromise.readdir(dirPath, { withFileTypes: true })
  await Promise.all(entries.map(entry => {
    const fullPath = path.join(dirPath, entry.name)
    return entry.isDirectory() ? rmrf(fullPath) : fsPromise.unlink(fullPath)
  }))
  await fsPromise.rmdir(dirPath)
}

export function isLooksLikeArg (str: string) {
  return str.startsWith('-')
}

type delimeter = string

export function getDelimeterKey (postfix: string): delimeter {
  return `__RND_DELIMETER__${(Math.random()*10e8).toString(36).replace('.', '_')}__${postfix}__`
}

export function constructGitLogFmtTpl(obj: { [key: string]: string }, quoteDelimeter: delimeter, endOfLineDelimeter: delimeter) {
  const parts = Object.keys(obj).map((key) => `${quoteDelimeter}${key}${quoteDelimeter}: ${quoteDelimeter}${obj[key]}${quoteDelimeter}`)
  return `{${parts.join(',')}}${endOfLineDelimeter}`
}

import * as stream from 'stream'
export function setProcessTimeout (proc: ChildProcessWithoutNullStreams, callback: () => void, time: number) {
  return setTimeout(() => {
    proc.stdout.destroy()
    proc.stderr.destroy()
    proc.kill()
    callback()
  }, time)
}

export function doJSONEscape (str: string) {
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
export function getChunksJSONNormalizer (quoteDelimeter: delimeter, endOfLineDelimeter: delimeter) {
  const endOfLineDelimeterOnTheBorders = endOfLineDelimeter + '\n{'
  const maxRestLength = Math.max(quoteDelimeter.length, endOfLineDelimeterOnTheBorders.length)
  const doReplaces = (chunk: string) => doJSONEscape(
    chunk.replace(new RegExp(endOfLineDelimeterOnTheBorders, 'g'), ',{')
  )
    .replace(new RegExp(quoteDelimeter, 'g'), '"')

  let chunk, lastChunk = ''
  const processor = function(data: Buffer, handler: (processedChunk: string) => void) {
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

export function gitTreeRecordFormat (line: string) {
  const delimeterPos = line.indexOf('\t')
  const fileName = doJSONEscape(line.substr(delimeterPos + 1).replace(/^"|"$/g, ''))
  const [mode, type, objHash, size] = line.substr(0, delimeterPos).split(/\s+/)
  return `{"name": "${fileName}", "type": "${type}", "size": "${size}", "objHash": "${objHash}", "mode": "${mode}"}`
}