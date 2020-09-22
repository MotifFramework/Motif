var paths = require('../grunt-vars')
var files = {}

files[paths.buildJs + 'global.js'] = [
  paths.sourceJs + 'global.js'
]

module.exports = {
  browserifyOptions: {
    debug: false
  },
  build: {
    files: files
  }
}
