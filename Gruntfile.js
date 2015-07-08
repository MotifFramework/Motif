module.exports = function ( grunt ) {

    // Project configuration.

    // Build = Local development
    // Dist = Motif distribution packages

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // Folder Vars
        project: "<%= pkg.name %>",
        sourceDir: "",
        distDir: "<%= sourceDir %>dist/",
        buildDir: "<%= sourceDir %>build/",

        dist: {
            css: "<%= distDir %>css/",
            fonts: "<%= distDir %>fonts/",
            js: "<%= distDir %>js/",
        },

        build: {
            less: "<%= buildDir %>less/",
            css: "<%= buildDir %>css/",
            fonts: "<%= buildDir %>fonts/",
            js: "<%= buildDir %>js/",
        },

        source: {
            less: "<%= sourceDir %>less/",
            js: "<%= sourceDir %>js/",
            fonts: "<%= sourceDir %>fonts/",
        },

        scripts: {
            groups: {
                helpers: [
                    "<%= source.js %>vendor/modernizr.js",
                    "<%= source.js %>vendor/viewport.js",
                    "<%= source.js %>utils/motif.utils.load-script.js"
                ],
                main: [
                    "<%= source.js %>vendor/jquery-2.1.4.js",
                    "<%= source.js %>vendor/requestAnimFrame.js",
                    "<%= source.js %>utils/motif.utils.plugins.js",
                    "<%= source.js %>forms/motif.gauntlet.js",
                    "<%= source.js %>forms/motif.ajax-submission.js",
                    "<%= source.js %>ui/motif.reveal.js",
                    "<%= source.js %>ui/motif.tabs.js",
                    "<%= source.js %>vendor/holder.js",
                    "<%= source.js %>actions.js"
                ],
                ie8: [
                    "<%= source.js %>vendor/jquery-1.11.3.js",
                    "<%= source.js %>utils/motif.utils.plugins.js",
                    "<%= source.js %>forms/motif.gauntlet.js",
                    "<%= source.js %>forms/motif.ajax-submission.js",
                    "<%= source.js %>ui/motif.reveal.js",
                    "<%= source.js %>ui/motif.tabs.js",
                    "<%= source.js %>vendor/holder.js",
                    "<%= source.js %>actions.js"
                ]
            },
            config: {
                build: {
                    // Build Helper JS
                    "<%= build.js %>helpers.<%= pkg.name %>.js": "<%= scripts.groups.helpers %>",

                    // Build Global JS
                    "<%= build.js %><%= pkg.name %>.js": "<%= scripts.groups.main %>",

                    // Build Global JS (IE8)
                    "<%= build.js %><%= pkg.name %>-ie8.js": "<%= scripts.groups.ie8 %>"
                },
                dist: {

                    // Dist Helper JS
                    "<%= dist.js %><%= pkg.name %>.js": "<%= scripts.groups.helpers %>",

                    // Dist Global JS
                    "<%= dist.js %><%= pkg.name %>.js": "<%= scripts.groups.main %>",

                    // Dist Global JS (IE8)
                    "<%= dist.js %><%= pkg.name %>-ie8.js": "<%= scripts.groups.ie8 %>"
                }
            }
        },

        // Tasks

        // Concat and Compress JS
        uglify: {
            build: {
                options: {
                    mangle: false,
                    beautify: true,
                    preserveComments: "all",
                    sourceMap: true,
                    report: "gzip",
                    compress: false
                },
                files: "<%= scripts.config.build %>"
            },
            dist: {
                options: {
                    mangle: true,
                    beautify: false,
                    sourceMap: false,
                    report: "gzip",
                    compress: true
                },
                files: "<%= scripts.config.dist %>"
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
                    cwd: "<%= source.js %>",

                    // Source Files
                    src: ["**/*.js", "!**/vendor/*.js", "!*.js"],

                    // Destination
                    dest: "<%= dist.js %>",

                    rename: function ( destBase, destPath ) {
                        return destBase + destPath.replace(".js", ".min.js");
                    }
                }]
            }
        },

        // Build LESS
        less: {
            options: {
                paths: ["<%= source.less %>"]
            },

            // Development Build
            globalBuild: {
                options: {
                    paths: ["<%= source.less %>"],
                    sourceMap: true,
                    sourceMapFilename: "<%= build.css %><%= project %>.css.map",
                    sourceMapRootpath: "../../",
                    sourceMapBasepath: "<%= sourceDir %>",
                    sourceMapURL: "<%= project %>.css.map",
                    cleancss: false,
                    report: "gzip"
                },
                files: {
                    "<%= build.css %><%= project %>.css": "<%= source.less %>global.less"
                }
            },
            globalFixedBuild: {
                options: {
                    paths: ["<%= source.less %>"],
                    sourceMap: true,
                    sourceMapFilename: "<%= build.css %><%= project %>-fixed.css.map",
                    sourceMapRootpath: "../../",
                    sourceMapBasepath: "<%= sourceDir %>",
                    sourceMapURL: "<%= project %>-fixed.css.map",
                    cleancss: false,
                    report: "gzip"
                },
                files: {
                    "<%= build.css %><%= project %>-fixed.css": "<%= source.less %>global-fixed.less"
                }
            },

            // Distribution Build
            globalDist: {
                options: {
                    compress: true,
                    cleancss: true,
                    report: "gzip"
                },
                files: {
                    "<%= dist.css %><%= project %>.css": "<%= source.less %>global.less"
                }
            },
            globalFixedDist: {
                options: {
                    compress: true,
                    cleancss: true,
                    report: "gzip"
                },
                files: {
                    "<%= dist.css %><%= project %>-fixed.css": "<%= source.less %>global-fixed.less"
                }
            }
        },

        // Build Icons Webfont
        webfont: {

            // Icons
            iconsBuild: {

                // Source SVGs
                src: "<%= source.fonts %><%= pkg.name %>-icons/svg/*.svg",

                // Destination Folder
                dest: "<%= build.fonts %><%= pkg.name %>-icons/",

                // Destination CSS
                destCss: "<%= source.less %>type/",
                options: {
                    engine: "node",
                    autoHint: false,
                    font: "<%= pkg.name %>-icons",
                    types: "eot,woff,ttf,svg",
                    hashes: false,
                    relativeFontPath: "../fonts/<%= pkg.name %>-icons/",
                    template: "<%= source.fonts %><%= pkg.name %>-icons/template/template.css",
                    stylesheet: "less",
                    destHtml: "<%= build.fonts %><%= pkg.name %>-icons/",
                    startCodepoint: 0xF101
                }
            },
            iconsDist: {

                // Source SVGs
                src: "<%= source.fonts %><%= pkg.name %>-icons/svg/*.svg",

                // Destination Folder
                dest: "<%= dist.fonts %><%= pkg.name %>-icons/",

                // Destination CSS
                destCss: "<%= source.less %>type/",
                options: {
                    engine: "node",
                    autoHint: false,
                    font: "<%= pkg.name %>-icons",
                    types: "eot,woff,ttf,svg",
                    hashes: false,
                    relativeFontPath: "../fonts/<%= pkg.name %>-icons/",
                    template: "<%= source.fonts %><%= pkg.name %>-icons/template/template.css",
                    stylesheet: "less",
                    destHtml: "<%= dist.fonts %><%= pkg.name %>-icons/",
                    startCodepoint: 0xF101
                }
            }
        },

        watch: {
            options: {
                livereload: 35729
            },
            grunt: {
                files: ["Gruntfile.js"],
                tasks: ["refresh"]
            },
            js: {
                files: ["<%= source.js %>**/*.js"],
                tasks: ["js"]
            },
            less: {
                options: {
                    livereload: false
                },
                files: ["<%= source.less %>**/*.less"],
                tasks: ["less-build"]
            },
            css: {
                files: ["<%= dist.css %>**/*.css", "<%= build.css %>**/*.css"]
            },
            fonts: {
                files: ["<%= source.fonts %>**/*.svg"],
                tasks: ["refresh"]
            }
        }
    });

    // Load the plugins that provide the tasks.
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-webfont");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // Default task, compiles LESS and JS into "build" folder
    grunt.registerTask("default", ["less:globalBuild", "less:globalFixedBuild", "uglify:build"]);

    // Run when you want to refresh everything
    grunt.registerTask("refresh", ["webfont:iconsBuild", "less:globalBuild", "less:globalFixedBuild", "uglify:build"]);
    grunt.registerTask("build", ["webfont:iconsBuild", "less:globalBuild", "less:globalFixedBuild", "uglify:build"]);

    // Distribution Build
    grunt.registerTask("dist", ["webfont:iconsDist", "less:globalDist", "less:globalFixedDist", "less:globalDist", "less:globalFixedDist", "uglify:dist"]);

    // Compile Dev Webfonts
    grunt.registerTask("fonts", ["webfont:iconsBuild"]);

    // Compile Dev LESS Files
    grunt.registerTask("less-build", ["less:globalBuild", "less:globalFixedBuild"]);

    // Compile Dev JS
    grunt.registerTask("js", ["uglify:build"]);

};
