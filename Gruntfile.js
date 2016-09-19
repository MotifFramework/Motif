module.exports = function (grunt) {

  // Load the plugins that provide the tasks.
  require('load-grunt-config')(grunt)

  // Default task, compiles LESS and JS into "build" folder
  grunt.registerTask('default', [
    'sass:globalBuild',
    'sass:globalFixedBuild',
    'uglify:build'
  ])

  // Run when you want to refresh everything
  grunt.registerTask('refresh', [
    'webfont:iconsBuild',
    'sass:globalBuild',
    'sass:globalFixedBuild',
    'uglify:build'
  ])
  grunt.registerTask('build', [
    'webfont:iconsBuild',
    'sass:globalBuild',
    'sass:globalFixedBuild',
    'uglify:build'
  ])

  // Distribution Build
  grunt.registerTask('dist', [
    'webfont:iconsDist',
    'sass:globalDist',
    'sass:globalFixedDist',
    'uglify:dist'
  ])

  // Compile Dev Webfonts
  grunt.registerTask('fonts', [
    'webfont:iconsBuild'
  ])

  // Compile Dev LESS Files
  grunt.registerTask('sass-build', [
    'sass:globalBuild',
    'sass:globalFixedBuild'
  ])

  // Compile Dev JS
  grunt.registerTask('js', [
    'uglify:build'
  ])
}
