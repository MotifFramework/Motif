module.exports = function (grunt) {

  // Load the plugins that provide the tasks.
  require('load-grunt-config')(grunt)

  // Default task, compiles LESS and JS into "build" folder
  grunt.registerTask('default', [
    'svgstore:build',
    'sass:globalBuild',
    'sass:globalFixedBuild',
    'less:globalBuild',
    'less:globalFixedBuild',
    'uglify:build'
  ])

  // Run when you want to refresh everything
  grunt.registerTask('refresh', [
    'svgstore:build',
    'sass:globalBuild',
    'sass:globalFixedBuild',
    'less:globalBuild',
    'less:globalFixedBuild',
    'uglify:build'
  ])
  grunt.registerTask('build', [
    'svgstore:build',
    'sass:globalBuild',
    'sass:globalFixedBuild',
    'less:globalBuild',
    'less:globalFixedBuild',
    'uglify:build'
  ])

  // Distribution Build
  grunt.registerTask('dist', [
    'svgmin:dist',
    'svgstore:dist',
    'sass:globalDist',
    'sass:globalFixedDist',
    'less:globalDist',
    'less:globalFixedDist',
    'uglify:dist'
  ])

  // Compile Dev Sass Files
  grunt.registerTask('sass-build', [
    'sass:globalBuild',
    'sass:globalFixedBuild'
  ])
  grunt.registerTask('sass-dist', [
    'sass:globalDist',
    'sass:globalFixedDist'
  ])

  // Compile Dev Icons
  grunt.registerTask('icons', [
    'svgstore:build'
  ])
  grunt.registerTask('icons-build', [
    'svgstore:build'
  ])
  grunt.registerTask('icons-dist', [
    'svgmin:dist',
    'svgstore:dist'
  ])

  // Compile Dev LESS Files
  grunt.registerTask('less-build', [
    'less:globalBuild',
    'less:globalFixedBuild'
  ])
  grunt.registerTask('less-dist', [
    'less:globalDist',
    'less:globalFixedDist'
  ])

  // Compile Dev JS
  grunt.registerTask('js', [
    'uglify:build'
  ])
  grunt.registerTask('js-build', [
    'uglify:build'
  ])
  grunt.registerTask('js-dist', [
    'uglify:dist'
  ])
}
