module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jquery: {
            client: {
                options: {
                    prefix: "jquery-",
                    minify: false
                },
                output: "<%= js_dir %>libs",
                versions: {
                    "2.0.3": [ "deprecated" ],
                    "1.8.3": [ "deprecated" ]
                }
            }
        },

        // Concatenate JS files
        concat: {
            client: {
                files: {

                    // Build Helpers
                    "<%= js_c_client_dir %>helpers.min.js": [
                        "<%= js_client_dir %>modernizr.js",
                        "<%= js_dir %>helpers/viewport.js",
                        "<%= js_dir %>helpers/loadScript.js"
                    ],

                    // Build Global JS
                    "<%= js_c_client_dir %>global.min.js": [
                        "<%= js_dir %>libs/jquery-2.0.3.js",
                        "<%= js_dir %>plugins/jquery.lb-reveal.js",
                        "<%= js_client_dir %>actions.js"
                    ],

                    // Build Global JS for IE
                    "<%= js_c_client_dir %>global-ie8.min.js": [
                        "<%= js_dir %>libs/jquery-1.8.3.js",
                        "<%= js_dir %>plugins/jquery.lb-reveal.js",
                        "<%= js_client_dir %>actions.js"
                    ],

                    // Build Global JS for IE
                    "<%= js_c_client_dir %>jquery.lb-validation.min.js": [
                        "<%= js_dir %>plugins/jquery.lb-validation.js"
                    ]
                }
            }
        },
        uglify: {
            client: {
                files: [{
                    expand: true,
                    cwd: '<%= js_c_client_dir %>',
                    src: '*.js',
                    dest: '<%= js_c_client_dir %>'
                }]
            }
        },
        less: {
            options: {
                paths: ["docroot/resources/less"]
            },
            admin: {
                options: {
                    report: "min"
                },
                files: [
                    {
                        expand: true,
                        cwd: "<%= less_dir %>admin/",
                        src: "**/!(_*).less",
                        dest: "<%= css_dir %>admin/",
                        ext: ".css"
                    }
                ]
            },
            development: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= less_dir %>client/",
                        src: "**/!(_*).less",
                        dest: "<%= css_dir %>client/",
                        ext: ".css"
                    }
                ]
            },
            production: {
                options: {
                    yuicompress: true,
                    report: "min"
                },
                files: [
                    {
                        expand: true,
                        cwd: "<%= less_dir %>client/",
                        src: "**/!(_*).less",
                        dest: "<%= css_dir %>client/",
                        ext: ".css"
                    }
                ]
            }
        },
        webfont: {
            icons: {
                src: '<%= image_dir %>icons/*.svg',
                dest: '<%= font_dir %><%= pkg.name %>-icons/',
                options: {
                    font: '<%= pkg.name %>-icons',
                    hashes: false,
                    relativeFontPath: "/resources/fonts/<%= pkg.name %>-icons/"
                }
            },
            symbolset: {
                src: '<%= font_dir %>symbolset-icons/*.svg',
                dest: '<%= font_dir %>symbolset-font/',
                options: {
                    font: 'symbolset',
                    hashes: false,
                    relativeFontPath: "/resources/fonts/symbolset-font/"
                }
            }
        },
        resources_dir: "../docroot/resources/",
        compiled_dir: "<%= resources_dir %>c/",
        css_dir: "<%= compiled_dir %>css/",
        image_dir: "<%= resources_dir %>images/",
        font_dir: "<%= resources_dir %>fonts/",
        js_dir: "<%= resources_dir %>js/",
        js_c_dir: "<%= compiled_dir %>js/",
        js_client_dir: "<%= js_dir %>client/",
        js_c_client_dir: "<%= js_c_dir %>client/",
        less_dir: "<%= resources_dir %>less/"
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks("grunt-jquery-builder");

    // Default task(s).
    grunt.registerTask('default', ['less:development', 'jquery', 'concat:client', 'webfont',]);
    grunt.registerTask('build', ['less:production', 'webfont', 'concat:client', 'uglify:client']);
    grunt.registerTask('fonts', ['webfont']);
    grunt.registerTask('jq', ['jquery']);

};
