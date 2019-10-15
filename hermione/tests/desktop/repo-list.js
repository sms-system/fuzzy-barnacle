describe('Repo List page', function() {
  it('should render page on root url', function() {
    return this.browser
      .url('/')
      .pause(100)
      .assertView('base', '#app')
  })
  it('should render page on /repos url', function() {
    return this.browser
      .url('/repos')
      .pause(100)
      .assertView('base', '#app')
  })
})