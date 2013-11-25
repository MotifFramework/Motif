module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
                        ext: ".min.css"
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
        less_dir: "<%= resources_dir %>less/"
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-webfont');

    // Default task(s).
    grunt.registerTask('default', ['less:development']);
    grunt.registerTask('build', ['less:production', 'webfont']);
    grunt.registerTask('fonts', ['webfont']);

};
