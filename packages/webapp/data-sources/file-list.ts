//@ts-ignore
import fetch from 'node-fetch'

//@ts-ignore
import { API_URL } from '../generated/config.json'

type repoPos = { repo: string, branch: string, path: string }

export default async ({ repo, branch, path }: repoPos) => {
  let url = `${API_URL}/repos/${repo}`
  if (branch) { url += `/tree/${branch}/${path || ''}` }
  const data = await fetch(url)
  const res = await data.json()
  if (res.errorCode) throw { ERROR: res.errorCode }
  return Array.isArray(res)?
    res.sort((a, b) => { return (a.type === b.type ?
      a.name.localeCompare(b.name) : (a.type === 'blob' ? 1 : -1)
    ) }) : res
}