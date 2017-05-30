module.exports = function (grunt) {
  var pkg = grunt.file.readJSON('package.json')

  // Load the plugins that provide the tasks.
  require('load-grunt-config')(grunt)

  grunt.registerTask('refresh', [
    'node_version',
    'concurrent:buildPreCSSModernizrSvg',
    'concurrent:buildCssJs',
    'cachebuster:dist'
  ])
  grunt.registerTask('default', [
    'refresh'
  ])
  grunt.registerTask('build', [
    'refresh'
  ])

  // CI Build (Non-Concurrent)
  grunt.registerTask('ci-build', [
    'node_version',
    'svgmin:dist',
    'svgmin:resources',
    'svgstore:dist',
    pkg.preCSS + ':global',
    'postcss:dist',
    'modernizr:dist',
    'browserify:build',
    'uglify:dist',
    'cachebuster:dist'
  ])

  // Distribution Build
  grunt.registerTask('dist', [
    'node_version',
    'concurrent:distSvgLessModernizr',
    'concurrent:distSvgCssJs',
    'cachebuster:dist'
  ])

  grunt.registerTask('css', [
    'node_version',
    pkg.preCSS + ':global',
    'postcss:build',
    'cachebuster:dist'
  ])

  // Compile Dev Icons
  grunt.registerTask('icons', [
    'node_version',
    'svgstore:build',
    'cachebuster:dist'
  ])
  grunt.registerTask('icons-build', [
    'node_version',
    'svgstore:build',
    'cachebuster:dist'
  ])
  grunt.registerTask('icons-dist', [
    'node_version',
    'svgmin:dist',
    'svgstore:dist',
    'cachebuster:dist'
  ])

  // Compile Dev LESS Files
  grunt.registerTask('less-build', [
    'node_version',
    'less:global',
    'postcss:build',
    'cachebuster:dist'
  ])
  grunt.registerTask('less-dist', [
    'node_version',
    'less:global',
    'postcss:dist',
    'cachebuster:dist'
  ])

  // Compile Dev JS
  grunt.registerTask('js', [
    'node_version',
    'concurrent:buildModernizrBrowserify',
    'uglify:build',
    'cachebuster:dist'
  ])
  grunt.registerTask('js-build', [
    'node_version',
    'concurrent:buildModernizrBrowserify',
    'uglify:build',
    'cachebuster:dist'
  ])
  grunt.registerTask('js-dist', [
    'node_version',
    'concurrent:buildModernizrBrowserify',
    'uglify:dist',
    'cachebuster:dist'
  ])
}
