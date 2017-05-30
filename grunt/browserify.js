var paths = require('../grunt-vars')
var files = {}

files[paths.buildJs + 'actions.js'] = [
  paths.sourceJs + 'actions.js'
]

module.exports = {
  browserifyOptions: {
    debug: false
  },
  build: {
    files: files
  }
}
