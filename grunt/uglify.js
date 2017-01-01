var paths = require("../grunt-vars");
var buildFiles = {};
var distFiles = {};
var scripts = {
    helpers: [
        // paths.sourceJs + "vendor/modernizr.js",
        paths.sourceJs + "vendor/viewport.js",
        paths.sourceJs + "utils/motif.utils.load-script.js"
    ],
    main: [
        paths.sourceJs + "vendor/jquery-2.1.4.js",
	    paths.sourceJs + "vendor/modernizr.js", // <- It works if lib is here
        paths.sourceJs + "vendor/requestAnimFrame.js",
        paths.sourceJs + "utils/motif.utils.plugins.js",
        paths.sourceJs + "forms/motif.gauntlet.js",
        paths.sourceJs + "forms/motif.ajax-submission.js",
        paths.sourceJs + "ui/motif.reveal.js",
        paths.sourceJs + "ui/motif.tabs.js",
        paths.sourceJs + "vendor/holder.js",
        paths.sourceJs + "actions.js"
    ]
};

buildFiles[paths.buildJs + "helpers." + paths.pkg.name + ".js"] = scripts.helpers;
buildFiles[paths.buildJs + paths.pkg.name + ".js"] = scripts.main;

distFiles[paths.distJs + "helpers." + paths.pkg.name + ".js"] = scripts.helpers;
distFiles[paths.distJs + paths.pkg.name + ".js"] = scripts.main;

module.exports = {
    build: {
        options: {
            mangle: false,
            beautify: true,
            preserveComments: "all",
            sourceMap: true,
            report: "gzip",
            compress: false
        },
        files: buildFiles
    },
    dist: {
        options: {
            mangle: true,
            beautify: false,
            sourceMap: false,
            report: "gzip",
            compress: true
        },
        files: distFiles
    },
    motifDist: {
        options: {
            mangle: true,
            beautify: false,
            preserveComments: "some",
            report: "gzip",
            compress: true
        },
        files: [{
            expand: true,

            // Current Working Directory
            cwd: paths.sourceJs,

            // Source Files
            src: ["**/*.js", "!**/vendor/*.js", "!*.js"],

            // Destination
            dest: paths.distJs,

            rename: function ( destBase, destPath ) {
                return destBase + destPath.replace(".js", ".min.js");
            }
        }]
    }
};