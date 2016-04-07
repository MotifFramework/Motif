module.exports = function ( grunt ) {

    // Load the plugins that provide the tasks.
    require("load-grunt-config")(grunt);

    // Default task, compiles LESS and JS into "build" folder
    grunt.registerTask("default", [
        "less:globalBuild",
        "less:globalFixedBuild",
        "uglify:build"
    ]);

    // Run when you want to refresh everything
    grunt.registerTask("refresh", [
        "svgstore:build",
        "less:globalBuild",
        "less:globalFixedBuild",
        "uglify:build"
    ]);
    grunt.registerTask("build", [
        "svgstore:build",
        "less:globalBuild",
        "less:globalFixedBuild",
        "uglify:build"
    ]);

    // Distribution Build
    grunt.registerTask("dist", [
        "svgmin:dist",
        "svgstore:dist",
        "less:globalDist",
        "less:globalFixedDist",
        "uglify:dist"
    ]);

    // Compile Dev Webfonts
    grunt.registerTask("fonts", [
        "svgstore:build"
    ]);

    // Compile Dev LESS Files
    grunt.registerTask("less-build", [
        "less:globalBuild",
        "less:globalFixedBuild"
    ]);

    // Compile Dev JS
    grunt.registerTask("js", [
        "uglify:build"
    ]);

};
