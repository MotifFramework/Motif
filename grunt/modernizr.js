var paths = require('../grunt-vars')

module.exports = {
  dist: {
    dest: paths.buildJs + 'modernizr.js',
    crawl: true,
    customTests: [],
    tests: [],
    options: [
      'setClasses'
    ],
    uglify: false,
    files: {
      src: [
        'dist/css/*.css',
        'js/**/*.js',
        '!js/vendor/*.js'
      ]
    }
  }
}
