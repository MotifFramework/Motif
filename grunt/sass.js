var paths = require('../grunt-vars')
var globalFiles = {}

globalFiles[paths.buildCss + paths.project + '.css'] = paths.sourceSass + 'global.scss'

module.exports = {
  options: {
    paths: [ paths.sourceSass ]
  },

  global: {
    options: {
      paths: [ paths.sourceSass ],
      sourceMap: true,
      outputStyle: 'expanded'
    },
    files: globalFiles
  }
}
