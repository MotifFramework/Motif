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
        "webfont:iconsBuild",
        "less:globalBuild",
        "less:globalFixedBuild",
        "uglify:build"
    ]);
    grunt.registerTask("build", [
        "webfont:iconsBuild",
        "less:globalBuild",
        "less:globalFixedBuild",
        "uglify:build"
    ]);

    // Distribution Build
    grunt.registerTask("dist", [
        "webfont:iconsDist",
        "less:globalDist",
        "less:globalFixedDist",
        "uglify:dist"
    ]);

    // Compile Dev Webfonts
    grunt.registerTask("fonts", [
        "webfont:iconsBuild"
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
