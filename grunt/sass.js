var paths = require('../grunt-vars')
var globalBuildFiles = {}
var globalFixedBuildFiles = {}
var globalDistFiles = {}
var globalFixedDistFiles = {}

globalBuildFiles[paths.buildCss + paths.project + '.css'] = paths.sourceSass + 'global.scss'
globalFixedBuildFiles[paths.buildCss + paths.project + '-fixed.css'] = paths.sourceSass + 'global-fixed.scss'
globalDistFiles[paths.distCss + paths.project + '.css'] = paths.sourceSass + 'global.scss'
globalFixedDistFiles[paths.distCss + paths.project + '-fixed.css'] = paths.sourceSass + 'global-fixed.scss'

module.exports = {
  options: {
    paths: [ paths.sourceSass ]
  },

  // Development Build
  globalBuild: {
    options: {
      paths: [ paths.sourceSass ],
      sourceMap: true,
      outputStyle: 'expanded'
    },
    files: globalBuildFiles
  },
  globalFixedBuild: {
    options: {
      paths: [ paths.sourceSass ],
      sourceMap: true,
      outputStyle: 'expanded'
    },
    files: globalFixedBuildFiles
  },

  // Distribution Build
  globalDist: {
    options: {
      outputStyle: 'compressed'
    },
    files: globalDistFiles
  },
  globalFixedDist: {
    options: {
      outputStyle: 'compressed'
    },
    files: globalFixedDistFiles
  }
}
