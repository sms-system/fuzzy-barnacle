//@ts-ignore
import fetch from 'node-fetch'

//@ts-ignore
import { API_URL } from '../generated/config.json'

type repoPos = { repo: string, branch: string, path: string }

export default async ({ repo, branch = 'master', path }: repoPos) => {
  let url = `${API_URL}/repos/${repo}/blob/${branch}/${path || ''}`
  const data = await fetch(url)
  const res = await data.text()
  if (res.errorCode) throw { ERROR: res.errorCode }
  return res
}