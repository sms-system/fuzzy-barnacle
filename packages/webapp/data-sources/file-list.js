import fetch from 'node-fetch'

import { API_URL } from '../config'

export default async ({ repo, branch, path }) => {
  let url = `${API_URL}/repos/${repo}`
  if (branch) { url += `/tree/${branch}/${path || ''}` }
  const data = await fetch(url)
  const res = await data.json()
  if (res.errorCode) throw { ERROR: res.errorCode }
  return res
}