var paths = require("../grunt-vars");
var globalBuildFiles = {};
var globalFixedBuildFiles = {};
var globalDistFiles = {};
var globalFixedDistFiles = {};

globalBuildFiles[paths.buildCss + paths.project + ".css"] = paths.sourceLess + "global.less";
globalFixedBuildFiles[paths.buildCss + paths.project + "-fixed.css"] = paths.sourceLess + "global-fixed.less";
globalDistFiles[paths.distCss + paths.project + ".css"] = paths.sourceLess + "global.less";
globalFixedDistFiles[paths.distCss + paths.project + "-fixed.css"] = paths.sourceLess + "global-fixed.less";

module.exports = {
    options: {
        paths: [ paths.sourceLess ]
    },

    // Development Build
    globalBuild: {
        options: {
            paths: [ paths.sourceLess ],
            sourceMap: true,
            sourceMapFilename: paths.buildCss + paths.project + ".css.map",
            sourceMapRootpath: "../../",
            sourceMapBasepath: paths.sourceDir,
            sourceMapURL: paths.project + ".css.map",
            cleancss: false,
            report: "gzip"
        },
        files: globalBuildFiles
    },
    globalFixedBuild: {
        options: {
            paths: [ paths.sourceLess ],
            sourceMap: true,
            sourceMapFilename: paths.buildCss + paths.project + "-fixed.css.map",
            sourceMapRootpath: "../../",
            sourceMapBasepath: paths.sourceDir,
            sourceMapURL: paths.project + "-fixed.css.map",
            cleancss: false,
            report: "gzip"
        },
        files: globalFixedBuildFiles
    },

    // Distribution Build
    globalDist: {
        options: {
            compress: true,
            cleancss: true,
            report: "gzip"
        },
        files: globalDistFiles
    },
    globalFixedDist: {
        options: {
            compress: true,
            cleancss: true,
            report: "gzip"
        },
        files: globalFixedDistFiles
    }
};