var paths = require('../grunt-vars')
var files = {}

files[paths.distCss + paths.pkg.name + '.css'] = paths.buildCss + paths.pkg.name + '.css'

module.exports = {
  options: {
    map: {
      prev: paths.buildCss,
      inline: false,
      annotation: paths.buildCss + 'maps/'
    }
  },
  build: {
    files: files,
    options: {
      processors: [
        require('autoprefixer')({
          browsers: ['last 2 versions']
        })
      ]
    }
  },
  dist: {
    files: files,
    options: {
      processors: [
        require('autoprefixer')({
          browsers: [
            'last 3 versions',
            'ie >= 10',
            'iOS >= 7',
            'Firefox ESR',
            'Android >= 4'
          ]
        }),
        require('cssnano')({
          reduceTransforms: false,
          zindex: false
        })
      ]
    }
  }
}
