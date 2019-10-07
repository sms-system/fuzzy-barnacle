import fetch from 'node-fetch'

export default async ({ path }) => {
  // const data = await fetch('https://api.github.com/users/github')
  // const json = await data.json()
  return [
    '/file/1',
    Math.random() + (path || '</>'),
    '/file/2',
    '/file/3'
  ]
}