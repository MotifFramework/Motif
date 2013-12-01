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
                        "<%= r_js %>plugins/jquery.lb-reveal.js",
                        "<%= r_js_client %>actions.js"
                    ],

                    // Build Global JS for IE
                    "<%= c_js %><%= pkg.name %>-ie8.js": [
                        "<%= r_js %>libs/jquery-1.8.3.js",
                        "<%= r_js %>plugins/jquery.lb-reveal.js",
                        "<%= r_js_client %>actions.js"
                    ],

                    // Build Validation plugin
                    "<%= c_js %>jquery.lb-validation.min.js": [
                        "<%= r_js %>plugins/jquery.lb-validation.js"
                    ]
                }
            }
        },

        // Compress JS
        uglify: {

            // Client
            client: {
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
                            return dest + "admin.css";
                        }
                    }
                ]
            },

            // Development Build
            development: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= r_less %>",
                        src: "client/!(_*).less",
                        dest: "<%= c_css %>",
                        rename: function( dest, src ) {
                            var source = src.substr( src.indexOf("/") + 1 );

                            source = source.replace( "global", "<%= project %>" );

                            return dest + source.substr( 0, source.indexOf(".") ) + ".css";
                        }
                    }
                ]
            },

            // Production Build
            production: {
                options: {
                    yuicompress: true,
                    report: "min"
                },
                files: [
                    {
                        expand: true,
                        cwd: "<%= r_less %>",
                        src: "client/!(_*).less",
                        dest: "<%= c_css %>",
                        rename: function( dest, src ) {
                            var source = src.substr( src.indexOf("/") + 1 );

                            source = source.replace( "global", "<%= project %>" );

                            return dest + source.substr( 0, source.indexOf(".") ) + ".css";
                        }
                    }
                ]
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
                    destHtml: "<%= r_fonts %><%= pkg.name %>-icons/",
                    embed: true
                }
            }
        },

        // Other Vars
        project: "<%= pkg.name %>",
        resources: "../docroot/resources/",
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

    // Default task.
    grunt.registerTask('default', ['less:development', 'concat:client']);

    // Run on Init
    grunt.registerTask('init', ['webfont', 'less:development', 'jquery', 'concat:client']);

    // Production Build
    grunt.registerTask('build', ['webfont', 'less:production', 'concat:client', 'uglify:client']);

    // Compile Webfonts
    grunt.registerTask('fonts', ['webfont']);

    // Build jQuery Versions
    grunt.registerTask('jq', ['jquery']);

    // Compile and Minify JS
    grunt.registerTask('js', ['concat:client', 'uglify:client']);

};
