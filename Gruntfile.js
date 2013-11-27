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
                        cwd: "<%= less_dir %>",
                        src: "admin/!(_*).less",
                        dest: "<%= css_dir %>",
                        ext: ".css"
                    }
                ]
            },
            development: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= less_dir %>",
                        src: "client/!(_*).less",
                        dest: "<%= css_dir %>",
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
                        cwd: "<%= less_dir %>",
                        src: "client/!(_*).less",
                        dest: "<%= css_dir %>",
                        ext: ".css"
                    }
                ]
            }
        },
        webfont: {
            icons: {
                src: "<%= font_dir %>icons/svg/*.svg",
                dest: '<%= compiled_dir %>fonts/client/icons/',
                destCss: "<%= less_dir %>client/type/",
                options: {
                    font: 'icons',
                    types: "eot,woff,ttf,svg",
                    hashes: false,
                    relativeFontPath: "/resources/fonts/icons/",
                    template: "<%= font_dir %>icons/template/template.css",
                    stylesheet: "less",
                    destHtml: "<%= font_dir %>icons/",
                    embed: true
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
    grunt.registerTask('default', ['less:development', 'concat:client']);
    grunt.registerTask('init', ['webfont', 'less:development', 'jquery', 'concat:client']);
    grunt.registerTask('build', ['webfont', 'less:production', 'concat:client', 'uglify:client']);
    grunt.registerTask('fonts', ['webfont']);
    grunt.registerTask('jq', ['jquery']);
    grunt.registerTask('js', ['concat:client', 'uglify:client']);

};
