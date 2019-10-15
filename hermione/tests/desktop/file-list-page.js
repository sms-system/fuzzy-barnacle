const { assert } = require('chai')

describe('File List page', function() {
  it('page must be shown after click on repo in repo list on main page', function() {
    return this.browser
      .url('/')
      .click('.Table-Row:nth-child(1) .Link')
      .pause(100)
      .getUrl().then(url => { assert.equal(url, 'http://app.internal:8005/repos/refactored-waddle') })
      .assertView('base', '#app')
  })
  it('folder navigation works', function() {
    return this.browser
      .url('/repos/refactored-waddle')
      .pause(100)
      .assertView('base', '#app')
      .click('.Table-Row:nth-child(1) .Link')
      .pause(100)
      .getUrl().then(url => { assert.equal(url, 'http://app.internal:8005/repos/refactored-waddle/tree/master/lib') })
      .assertView('subfolder', '#app')
  })
  it('breadcrumbs navigation works', function() {
    return this.browser
      .url('/repos/refactored-waddle/tree/master/lib')
      .pause(100)
      .assertView('subfolder', '#app')
      .click('.Breadcrumbs-Item:nth-child(1) .Breadcrumbs-Link')
      .pause(100)
      .getUrl().then(url => { assert.equal(url, 'http://app.internal:8005/repos/refactored-waddle') })
      .assertView('base', '#app')
  })
  it('repo navigation from dropdown works', function() {
    return this.browser
      .url('/repos/refactored-waddle')
      .pause(100)
      .assertView('base', '#app')
      .click('.Header-Content .Dropdown')
      .pause(100)
      .assertView('openned_dropdown', '#app')
      .click('.Header-Content .Dropdown .Menu-Item:nth-child(2) .Menu-Link')
      .pause(300)
      .getUrl().then(url => { assert.equal(url, 'http://app.internal:8005/repos/xo') })
      .assertView('swithed_repo', '#app')
  })
  it('404 page on non exists path', function() {
    return this.browser
      .url('/repos/refactored-waddle/tree/master/404')
      .pause(100)
      .assertView('base', '#app')
  })
})