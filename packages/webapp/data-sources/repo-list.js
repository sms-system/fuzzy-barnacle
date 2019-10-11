import fetch from 'node-fetch'

import { API_URL } from '../config.json'

export default async () => {
  const data = await fetch(`${API_URL}/repos`)
  return await data.json()
}