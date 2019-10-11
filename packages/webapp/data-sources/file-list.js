import fetch from 'node-fetch'

import { API_URL } from '../config.json'

export default async ({ repo, branch, path }) => {
  let url = `${API_URL}/repos/${repo}`
  if (branch) { url += `/tree/${branch}/${path || ''}` }
  const data = await fetch(url)
  const res = (await data.json())
    .sort((a, b) => { return (a.type === b.type ?
      a.name.localeCompare(b.name) : (a.type === 'blob' ? 1 : -1)
    ) })
  if (res.errorCode) throw { ERROR: res.errorCode }
  return res
}