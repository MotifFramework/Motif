var paths = require("../grunt-vars");

module.exports = {
    plugins: [{
        removeViewBox: false
    }],
    resources: {
        files: [{
            expand: true,
            cwd: paths.sourceImages,
            src: ['*.svg'],
            dest: paths.distImages
        }]
    },
    dist: {
        files: [{
            expand: true,
            cwd: paths.sourceIcons,
            src: ['*.svg'],
            dest: paths.buildIcons
        }]
    }
};