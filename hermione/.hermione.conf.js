module.exports = {
  baseUrl: 'http://app.internal:8005',

  sets: {
    desktop: {
      files: 'tests/desktop'
    }
  },

  screenshotPath: 'hermione-screenshots',
  resetCursor: true,
  compositeImage: true,
  tolerance: 5,
  antialiasingTolerance: 5,
  retry: 2,

  browsers: {
    chrome: {
      gridUrl: 'http://chrome:4444/wd/hub',
      desiredCapabilities: { browserName: 'chrome' }
    },
    firefox: {
      gridUrl: 'http://firefox:4444/wd/hub',
      desiredCapabilities: { browserName: 'firefox' }
    }
  },

  plugins: {
    'html-reporter/hermione': {
        enabled: true,
        path: 'hermione-reports',
        defaultView: 'all',
        baseHost: 'test.com',
        errorPatterns: [
            'Parameter .* must be a string', {
                name: 'Cannot read property of undefined',
                pattern: 'Cannot read property .* of undefined'
            }
        ]
    }
},
}