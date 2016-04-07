var paths = require("../grunt-vars");

module.exports = {
    options: {
        livereload: 35729
    },
    grunt: {
        files: ["Gruntfile.js"],
        tasks: ["refresh"]
    },
    js: {
        files: [paths.sourceJs + "**/*.js"],
        tasks: ["js"]
    },
    less: {
        options: {
            livereload: false
        },
        files: [paths.sourceLess + "**/*.less"],
        tasks: ["less-build"]
    },
    css: {
        files: [paths.distCss + "**/*.css", paths.buildCss + "**/*.css"]
    },
    icons: {
        files: [paths.sourceIcons + "*.svg"],
        tasks: ["refresh"]
    },
    html: {
        files: [paths.projectDir + "**/*.view", paths.projectDir + "**/*.html" ]
    }
};