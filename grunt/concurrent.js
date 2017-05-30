var paths = require('../grunt-vars')

module.exports = {
  buildPreCSSModernizrSvg: [
    paths.pkg.preCSS + ':global',
    'svgstore:build',
    'svgmin:resources',
    'modernizr:dist',
    'browserify:build'
  ],
  buildCssJs: [
    'postcss:build',
    'uglify:build'
  ],
  distSvgLessModernizr: [
    paths.pkg.preCSS + ':global',
    'modernizr:dist',
    'svgmin:resources',
    'svgmin:dist',
    'browserify:build'
  ],
  distSvgCssJs: [
    'postcss:dist',
    'svgstore:dist',
    'uglify:dist'
  ],
  buildModernizrBrowserify: [
    'modernizr:dist',
    'browserify:build'
  ]
}
