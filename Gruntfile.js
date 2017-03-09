module.exports = function (grunt) {
  var pkg = grunt.file.readJSON('package.json')

  // Load the plugins that provide the tasks.
  require('load-grunt-config')(grunt)

  grunt.registerTask('default', [
    'node_version',
    'svgstore:build',
    pkg.preCSS + ':global',
    'postcss:build',
    'modernizr:dist',
    'browserify:build',
    'uglify:build',
    'cachebuster:dist'
  ])
  grunt.registerTask('refresh', [
    'node_version',
    'svgstore:build',
    pkg.preCSS + ':global',
    'postcss:build',
    'modernizr:dist',
    'browserify:build',
    'uglify:build',
    'cachebuster:dist'
  ])
  grunt.registerTask('build', [
    'node_version',
    'svgstore:build',
    pkg.preCSS + ':global',
    'postcss:build',
    'modernizr:dist',
    'browserify:build',
    'uglify:build',
    'cachebuster:dist'
  ])

  // Distribution Build
  grunt.registerTask('dist', [
    'node_version',
    'svgmin:dist',
    'svgstore:dist',
    pkg.preCSS + ':global',
    'postcss:dist',
    'modernizr:dist',
    'browserify:build',
    'uglify:dist',
    'cachebuster:dist'
  ])

  grunt.registerTask('css', [
    'node_version',
    pkg.preCSS + ':global',
    'postcss:build',
    'cachebuster:dist'
  ])

  // Compile Dev Sass Files
  grunt.registerTask('sass-build', [
    'node_version',
    'sass:global',
    'postcss:build',
    'cachebuster:dist'
  ])
  grunt.registerTask('sass-dist', [
    'node_version',
    'sass:global',
    'postcss:dist',
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
    'modernizr:dist',
    'browserify:build',
    'uglify:build',
    'cachebuster:dist'
  ])
  grunt.registerTask('js-build', [
    'node_version',
    'modernizr:dist',
    'browserify:build',
    'uglify:build',
    'cachebuster:dist'
  ])
  grunt.registerTask('js-dist', [
    'node_version',
    'modernizr:dist',
    'browserify:build',
    'uglify:dist',
    'cachebuster:dist'
  ])
}
