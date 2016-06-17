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
        mkdir: {
            dist: {
                options: {
                    create: ['dist/views']
                }
            }
        },
        browserify: {
            dist: {
                files: {
                    '<%= path.dist %>/hasher.min.js': [
                        '<%= path.app %>/scripts/**/*.js'
                    ]
                },
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                expand: true,
                cwd: '<%= path.app %>/',
                src: ['**/*.html'],
                dest: '<%= path.dist %>/'
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
                        '<%= path.dist %>/hasher.min.js'
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
                tasks: ['browserify', 'uglify']
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
                    '<%= path.dist %>/*.html',
                    '<%= path.dist %>/*.css',
                    '<%= path.dist %>/*.js'
                ],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
        }
    });

    // Project tasks
    grunt.registerTask('build', [
        'mkdir',
        'browserify',
        'htmlmin',
        'cssmin',
        'uglify',
    ]);
    grunt.registerTask('serve', [
        'connect',
        'watch',
    ]);
    grunt.registerTask('default', [
        'build',
        'serve',
    ]);
};
