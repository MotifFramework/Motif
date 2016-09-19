var paths = require('../grunt-vars')

module.exports = {
  plugins: [{
    removeViewBox: false
  }],
  dist: {
    files: [{
      expand: true,
      cwd: paths.sourceIcons,
      src: ['*.svg'],
      dest: paths.buildIcons
    }]
  }
}
