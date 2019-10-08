const sendFile = require('@sifrr/server/src/server/sendfile')
const { mimes } = require('@sifrr/server/src/server/mime')
const path = require('path')
const fs = require('fs')

Object.keys(mimes).forEach(ext => {
  if (
    mimes[ext].startsWith('text/') ||
    mimes[ext] === 'application/javascript'
  ) {
    mimes[ext] += '; charset=utf-8'
  }
})

module.exports = (server) => {
  server.__proto__.folder = function (url, folder) {
    fs.readdirSync(folder).forEach(file => {
      const filePath = path.join(folder, file)
      const fileUrl = url + '/' + file

      if (fs.statSync(filePath).isDirectory()) {
        this.folder(fileUrl, filePath)
      } else {
        this.get(fileUrl,
          (res, req) => { sendFile(res, req, filePath) }
        )
      }
    })
    return this
  }
}