'use strict';

module.exports = function (grunt) {
    // Load tasks from grunt-* dependencies in package.json
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take
    require('time-grunt')(grunt);

    // Project configuration
    grunt.initConfig({
        path: {
            app: 'app',
            dist: 'dist'
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    '<%= path.dist %>/index.html': '<%= path.app %>/index.html',
                }
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= path.dist %>/hasher.min.css': [
                        '<%= path.app %>/styles/**/*.css'
                    ]
                }
            }
        },
        uglify: {
            dist: {
                options: {
                    compress: true,
                },
                files: {
                    '<%= path.dist %>/hasher.min.js': [
                        '<%= path.app %>/scripts/**/*.js'
                    ]
                }
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                hostname: 'localhost',
                base: '<%= path.dist %>'
            },
            livereload: {
                options: {
                    open: true
                }
            }
        },
        watch: {
            scripts: {
                files: '<%= path.app %>/scripts/**/*.js',
                tasks: ['uglify']
            },
            styles: {
                files: '<%= path.app %>/styles/**/*.css',
                tasks: ['cssmin']
            },
            views: {
                files: '<%= path.app %>/**/*.html',
                tasks: ['htmlmin']
            },
            livereload: {
                files: [
                    'index.html',
                    'dist/*.js'
                ],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
        }
    });

    // Project tasks
    grunt.registerTask('build', [
        'htmlmin',
        'cssmin',
        'uglify'
    ]);
    grunt.registerTask('serve', [
        'connect',
        'watch'
    ]);
    grunt.registerTask('default', [
        'build'
    ]);
};