module.exports = {
  commitsPerPage: {
    doc: 'Commits count per page. 0 - disable paging',
    format: Number,
    default: 0,
    env: 'COMMITS_PER_PAGE'
  },
  reposDir: {
    doc: 'Directory with repositories',
    format: String,
    default: null,
    env: 'REPOS_DIR',
    arg: 'repos-dir'
  },
  api: {
    port: {
      doc: 'The port to bind api',
      format: 'port',
      default: 8001,
      env: 'API_PORT'
    }
  },
  webapp: {
    port: {
      doc: 'The port to bind webapp',
      format: 'port',
      default: 8000,
      env: 'WEBAPP_PORT'
    }
  },
  git: {
    dataFolder: {
      doc: 'Git meta files folder',
      format: String,
      default: '.git/',
      env: 'GIT_DATA_FOLDER'
    },
    binary: {
      doc: 'Git executable file',
      format: String,
      default: 'git',
      env: 'GIT_BINARY'
    },
    cloneTimeout: {
      doc: 'Git clone command timeout',
      format: Number,
      default: 60000,
      env: 'GIT_CLONE_TIMEOUT'
    }
  }
}