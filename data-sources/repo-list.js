import fetch from 'node-fetch'

export default async () => {
  const data = await fetch('https://api.github.com/users/github')
  const json = await data.json()
  return json
}