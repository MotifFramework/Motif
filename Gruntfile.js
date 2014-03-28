module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Build jQuery versions
        jquery: {

            // Client
            client: {

                // Options
                options: {
                    prefix: "jquery-",
                    minify: false
                },

                // Output directory
                output: "<%= r_js %>libs",

                // Versions
                versions: {
                    "2.0.3": [ "deprecated" ],
                    "1.8.3": [ "deprecated" ]
                }
            }
        },

        // Concatenate JS files
        concat: {

            // Client
            client: {
                files: {

                    // Build Helpers
                    "<%= c_js %>helpers.<%= pkg.name %>.js": [
                        "<%= r_js_client %>modernizr.js",
                        "<%= r_js %>helpers/viewport.js",
                        "<%= r_js %>helpers/loadScript.js"
                    ],

                    // Build Global JS
                    "<%= c_js %><%= pkg.name %>.js": [
                        "<%= r_js %>libs/jquery-2.0.3.js",
                        "<%= r_js_client %>utils/utils.js",
                        "<%= r_js_client %>apps/ajaxForm.js",
                        "<%= r_js_client %>apps/validateForms.js",
                        "<%= r_js_client %>apps/reveal.js",
                        "<%= r_js_client %>apps/scrollFire.js",
                        "<%= r_js_client %>apps/StickySide.js",
                        "<%= r_js_client %>apps/ScrollPatrol.js",
                        "<%= r_js_client %>apps/scrollEvents.js",
                        "<%= r_js %>plugins/jquery.lb-scrolling.js",
                        "<%= r_js_client %>actions.js"
                    ],

                    // Build Global JS for IE
                    "<%= c_js %><%= pkg.name %>-ie8.js": [
                        "<%= r_js %>libs/jquery-1.8.3.js",
                        "<%= r_js_client %>utils/utils.js",
                        "<%= r_js_client %>apps/ajaxForm.js",
                        "<%= r_js_client %>apps/validateForms.js",
                        "<%= r_js_client %>apps/reveal.js",
                        "<%= r_js_client %>apps/scrollFire.js",
                        "<%= r_js_client %>apps/StickySide.js",
                        "<%= r_js_client %>apps/ScrollPatrol.js",
                        "<%= r_js_client %>apps/scrollEvents.js",
                        "<%= r_js %>plugins/jquery.lb-scrolling.js",
                        "<%= r_js_client %>actions.js"
                    ],

                    // Build Validation plugin
                    "<%= c_js %>jquery.lb-validation.min.js": [
                        "<%= r_js %>plugins/jquery.lb-validation.js"
                    ]
                }
            },

            // Client
            admin: {
                files: {

                    // Build Helpers
                    "<%= c_js %>helpers.admin.js": [
                        "<%= r_js_admin %>modernizr.js",
                        "<%= r_js %>helpers/viewport.js",
                        "<%= r_js %>helpers/loadScript.js"
                    ]
                }
            }
        },

        // Compress JS
        uglify: {

            // Client
            js: {
                files: [{
                    expand: true,

                    // Current Working Directory
                    cwd: '<%= c_js %>',

                    // Source Files
                    src: '*.js',

                    // Destination (Same as CWD)
                    dest: '<%= c_js %>'
                }]
            }
        },

        // Build LESS
        less: {
            options: {
                paths: ["docroot/resources/less"]
            },

            // Admin
            admin: {
                options: {
                    report: "min"
                },
                files: [
                    {
                        expand: true,
                        cwd: "<%= r_less %>",
                        src: "admin/!(_*).less",
                        dest: "<%= c_css %>",
                        rename: function( dest, src ) {
                            var source = src.substr( src.indexOf("/") + 1 );

                            source = source.replace( "global", "admin" );

                            return dest + source.substr( 0, source.indexOf(".") ) + ".css";
                        }
                    }
                ]
            },

            // Development Build
            developmentGlobal: {
                options: {
                    paths: ["<%= r_less_client"],
                    sourceMap: true,
                    sourceMapFilename: '<%= c_css %><%= project %>.css.map',
                    sourceMapRootpath: "../../",
                    sourceMapBasepath: "<%= resources %>",
                    sourceMapURL: "<%= project %>.css.map",
                    cleancss: false
                },
                files: {
                    "<%= c_css %><%= project %>.css": "<%= r_less_client %>global.less"
                }
            },
            developmentGlobalFixed: {
                options: {
                    paths: ["<%= r_less_client"],
                    sourceMap: true,
                    sourceMapFilename: '<%= c_css %><%= project %>-fixed.css.map',
                    sourceMapRootpath: "../../",
                    sourceMapBasepath: "<%= resources %>",
                    sourceMapURL: "<%= project %>-fixed.css.map",
                    cleancss: false
                },
                files: {
                    "<%= c_css %><%= project %>-fixed.css": "<%= r_less_client %>global-fixed.less"
                }
            },

            // Production Build
            productionGlobal: {
                options: {
                    paths: ["<%= r_less_client"],
                    sourceMap: true,
                    sourceMapFilename: '<%= c_css %><%= project %>.css.map',
                    sourceMapRootpath: "../../",
                    sourceMapBasepath: "<%= resources %>",
                    sourceMapURL: "<%= project %>.css.map",
                    cleancss: true,
                    report: "gzip"
                },
                files: {
                    "<%= c_css %><%= project %>.css": "<%= r_less_client %>global.less"
                }
            },
            productionGlobalFixed: {
                options: {
                    paths: ["<%= r_less_client"],
                    sourceMap: true,
                    sourceMapFilename: '<%= c_css %><%= project %>-fixed.css.map',
                    sourceMapRootpath: "../../",
                    sourceMapBasepath: "<%= resources %>",
                    sourceMapURL: "<%= project %>-fixed.css.map",
                    cleancss: true,
                    report: "gzip"
                },
                files: {
                    "<%= c_css %><%= project %>-fixed.css": "<%= r_less_client %>global-fixed.less"
                }
            }
        },

        // Build Icons Webfont
        webfont: {

            // Icons
            clientIcons: {

                // Source SVGs
                src: "<%= r_fonts %><%= pkg.name %>-icons/svg/*.svg",

                // Destination Folder
                dest: '<%= c_fonts %><%= pkg.name %>-icons/',

                // Destination CSS
                destCss: "<%= c_less %>",
                options: {
                    font: '<%= pkg.name %>-icons',
                    types: "eot,woff,ttf,svg",
                    hashes: false,
                    relativeFontPath: "<%= c_fonts %><%= pkg.name %>-icons/",
                    template: "<%= r_fonts %><%= pkg.name %>-icons/template/template.css",
                    stylesheet: "less",
                    destHtml: "<%= c_fonts %><%= pkg.name %>-icons/",
                    startCodepoint: 0xE400,
                    embed: true
                }
            },

            // Icons
            adminIcons: {

                // Source SVGs
                src: "<%= r_fonts %>admin-icons/svg/*.svg",

                // Destination Folder
                dest: '<%= c_fonts %>admin-icons/',

                // Destination CSS
                destCss: "<%= c_less %>",
                options: {
                    font: 'admin-icons',
                    types: "eot,woff,ttf,svg",
                    hashes: false,
                    relativeFontPath: "<%= c_fonts %>admin-icons/",
                    template: "<%= r_fonts %>admin-icons/template/template.css",
                    stylesheet: "less",
                    destHtml: "<%= c_fonts %>admin-icons/",
                    embed: true
                }
            }
        },

        watch: {
            options: {
                livereload: 35729
            },
            html: {
                files: ['<%= docroot %>**/*.view']
            },
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['refresh']
            },
            js: {
                files: ['<%= r_js_client %>**/*.js'],
                tasks: ['js']
            },
            less: {
                options: {
                    livereload: false
                },
                files: ['<%= r_less_client %>**/*.less'],
                tasks: ['less:developmentGlobal']
            },
            css: {
                files: ['<%= c_css %>**/*.css']
            }
        },

        "string-replace": {
            development: {
                files: {
                    "<%= r_less_client %>global.less": ["<%= r_less_client %>global.less"],
                    "npm-shrinkwrap.json": ["npm-shrinkwrap.json"],
                    "<%= docs %>patterns.php": ["<%= docs %>patterns.php"],
                    "<%= views %>bases/foundation.view": ["<%= views %>bases/foundation.view"]
                },
                options: {
                    replacements: [{
                        pattern: /lb-core/gi,
                        replacement: '<%= pkg.name %>'
                    }]
                }
            }
        },

        copy: {
            icons: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= r_fonts %>lb-core-icons/",
                        src: "**",
                        dest: "<%= r_fonts %><%= pkg.name %>-icons/"
                    }
                ]
            }
        },

        // Other Vars
        project: "<%= pkg.name %>",
        docroot: "../docroot/",
        docs: "<%= docroot %>docs/",
        views: "<%= docroot %>views/",
        resources: "<%= docroot %>resources/",
        compiled: "<%= resources %>c/",

        c_less: "<%= compiled %>less/",
        c_css: "<%= compiled %>css/",
        c_fonts: "<%= compiled %>fonts/",
        c_js: "<%= compiled %>js/",

        r_less: "<%= resources %>less/",
        r_less_client: "<%= r_less %>client/",
        r_less_admin: "<%= r_less %>admin/",

        r_fonts: "<%= resources %>fonts/",

        r_js: "<%= resources %>js/",
        r_js_client: "<%= r_js %>client/",
        r_js_admin: "<%= r_js %>admin/",

        r_images: "<%= resources %>images/",
        r_images_client: "<%= r_images %>client/",
        r_images_admin: "<%= r_images %>admin/"
    });

    // Load the plugins that provide the tasks.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks("grunt-jquery-builder");
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['less:developmentGlobal', 'less:developmentGlobalFixed', 'concat:client']);

    // Run on Init
    grunt.registerTask('init', ['copy', 'string-replace', 'webfont:clientIcons', 'less:developmentGlobal', 'less:developmentGlobalFixed', 'jquery', 'concat:client', 'webfont:adminIcons', 'less:admin', 'concat:admin']);

    // Run when you want to refresh everything
    grunt.registerTask('refresh', ['webfont:clientIcons', 'less:developmentGlobal', 'less:developmentGlobalFixed', 'jquery', 'concat:client', 'webfont:adminIcons', 'less:admin', 'concat:admin']);

    // Production Build
    grunt.registerTask('build', ['webfont:clientIcons', 'less:productionGlobal', 'less:productionGlobalFixed', 'concat:client', 'uglify']);

    // Admin Build
    grunt.registerTask('admin', ['webfont:adminIcons', 'less:admin', 'concat:admin']);

    // Compile Webfonts
    grunt.registerTask('fonts', ['webfont']);

    // Compile Dev LESS Files
    grunt.registerTask('lesscss', ['less:developmentGlobal', 'less:developmentGlobalFixed']);

    // Build jQuery Versions
    grunt.registerTask('jq', ['jquery']);

    // Compile and Minify JS
    grunt.registerTask('js', ['concat:client']);

};
