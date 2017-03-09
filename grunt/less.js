var paths = require('../grunt-vars')
var globalFiles = {}

globalFiles[paths.distCss + paths.project + '.css'] = paths.sourceLess + 'global.less'

module.exports = {
  options: {
    paths: [ paths.sourceLess ]
  },

  global: {
    options: {
      paths: [ paths.sourceLess ],
      sourceMap: true,
      sourceMapFilename: paths.distCss + paths.project + '.css.map',
      sourceMapRootpath: '../../',
      sourceMapBasepath: paths.sourceDir,
      sourceMapURL: paths.project + '.css.map',
      cleancss: false
    },
    files: globalFiles
  }
}
