var paths = require('../grunt-vars')
var files = {}
var scripts = {
  helpers: [
    paths.buildJs + 'modernizr.js',
    paths.sourceJs + 'vendor/viewport.js',
    paths.sourceJs + 'utils/motif.utils.load-script.js'
  ],
  main: [
    paths.buildJs + 'actions.js'
  ]
}

files[paths.distJs + 'helpers.' + paths.pkg.name + '.js'] = scripts.helpers
files[paths.distJs + paths.pkg.name + '.js'] = scripts.main

module.exports = {
  build: {
    options: {
      preserveComments: false,
      report: 'gzip',
      sourceMap: true,
      beautify: true,
      mangle: false
    },
    files: files
  },
  dist: {
    options: {
      mangle: true,
      beautify: false,
      sourceMap: false,
      report: 'gzip',
      compress: true
    },
    files: files
  }
}
