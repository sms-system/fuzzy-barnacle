const { assert } = require('chai')

describe('File Content page', function() {
  it('file content shown on direct access', function() {
    return this.browser
      .url('/repos/refactored-waddle/blob/master/package.json')
      .pause(100)
      .assertView('base', '#app')
  })
  it('click on file open it\'s content', function() {
    return this.browser
      .url('/repos/refactored-waddle')
      .pause(100)
      .click('.Table-Row:nth-child(4) .Link')
      .pause(100)
      .getUrl().then(url => { assert.equal(url, 'http://app.internal:8005/repos/refactored-waddle/blob/master/index.js') })
      .assertView('base', '#app')
  })
})