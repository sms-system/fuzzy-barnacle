import fetch from 'node-fetch'

import { API_URL } from '../config.json'

export default async ({ repo, branch = 'master', path }) => {
  let url = `${API_URL}/repos/${repo}/blob/${branch}/${path || ''}`
  const data = await fetch(url)
  const res = await data.text()
  if (res.errorCode) throw { ERROR: res.errorCode }
  return res
}