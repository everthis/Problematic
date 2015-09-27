/*jshint node:true*/

// Generated on 2015-07-04 using
// generator-webapp 0.6.2
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required grunt tasks
  require('jit-grunt')(grunt, {
      useminPrepare: 'grunt-usemin'
  });

  // Configurable paths
  var config = {
    app: 'app',
    tmp: '.tmp',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint']
      },
      jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      // sass: {
      compass: {
        files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        // tasks: ['sass:server', 'postcss']
        tasks: ['compass:server', 'postcss', 'csscomb:dist']
      },
      styles: {
        files: ['<%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'postcss']
      }
    },

    browserSync: {
      options: {
        notify: false,
        background: true
      },
      livereload: {
        options: {
          files: [
            '<%= config.app %>/{,*/}*.html',
            '<%= config.app %>/styles/**/*.css',
            '<%= config.app %>/images/{,*/}*',
            '<%= config.app %>/scripts/{,*/}*.js'
          ],
          port: 9000,
          server: {
            baseDir: ['.tmp', config.app],
            routes: {
              '/bower_components': './bower_components'
            }
          }
        }
      },
      test: {
        options: {
          port: 9001,
          open: false,
          logLevel: 'silent',
          host: 'localhost',
          server: {
            baseDir: ['.tmp', './test', config.app],
            routes: {
              '/bower_components': './bower_components'
            }
          }
        }
      },
      dist: {
        options: {
          background: false,
          server: '<%= config.dist %>'
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%= browserSync.test.options.host %>:<%= browserSync.test.options.port %>/index.html']
        }
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    // sass: {
    //   options: {
    //     indentedSyntax: true,
    //     indentWidth: 4,
    //     outputStyle: 'expanded',
    //     sourceMap: true,
    //     sourceMapEmbed: true,
    //     sourceMapContents: true,
    //     includePaths: ['bower_components']
    //   },
    //   dist: {
    //     files: [{
    //       expand: true,
    //       cwd: '<%= config.app %>/styles',
    //       src: ['*.{scss,sass}'],
    //       dest: '.tmp/styles',
    //       ext: '.css'
    //     }]
    //   },
    //   server: {
    //     files: [{
    //       expand: true,
    //       cwd: '<%= config.app %>/styles',
    //       src: ['*.{scss,sass}'],
    //       dest: '.tmp/styles',
    //       ext: '.css'
    //     }]
    //   }
    // },

    compass: {
      options: {
        sassDir: '<%= config.app %>/styles',
        cssDir: '.tmp/styles',
        imagesDir: '<%= config.app %>/images',
        javascriptsDir: '<%= config.app %>/scripts',
        fontsDir: '<%= config.app %>/styles/fonts',
        generatedImagesDir: '.tmp/images/generated',
        importPath: 'bower_components',
        httpImagesPath: '../images',
        httpGeneratedImagesPath: '../images/generated',
        httpFontsPath: 'fonts',
        relativeAssets: false,
        sourcemap: true,
        assetCacheBuster: false
      },
      dist: {
        options: {
          sassDir: '<%= config.app %>/styles',
          cssDir: '.tmp/styles',
          sourcemap: false,
          noLineComments: true,
          generatedImagesDir: '<%= config.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: false
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      }
    },

     csscomb: {
        dist: {
            expand: true,
            cwd: '.tmp/styles/',
            src: ['*.css', '!*.resorted.css'],
            dest: '.tmp/styles/',
            ext: '.css'
            // files: {
            //     '.tmp/css/*.css': ['.tmp/styles/*.css']
            // }
        }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          // Add vendor prefixed styles
          require('autoprefixer-core')({
            // browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']  // for desktop
            browsers: ['ios > 5']  // for mobile
          })
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    inline: {
        dist: {
            options:{
                cssmin: false
            },
            src: '<%= config.app %>/redirect.html',
            dest: '<%= config.dist %>/redirect.html'
        }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        src: ['<%= config.app %>/*.html'],
        ignorePath: /^<%= config.app %>\/|\.\.\//
      },
      sass: {
        src: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= config.dist %>/scripts/{,*/}*.js',
          '<%= config.dist %>/styles/{,*/}*.css',
          '<%= config.dist %>/images/{,*/}*.*',
          '<%= config.dist %>/styles/fonts/{,*/}*.*',
          '<%= config.dist %>/*.{ico,png}'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: '<%= config.app %>/*.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/images',
          '<%= config.dist %>/styles'
        ]
      },
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/styles/{,*/}*.css']
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
       // concat, minify and revision files. Creates configurations in memory so
       // additional tasks can operate on them
       // useminPrepare: {
       //   html: '<%= config.app %>/*.html',
       //   options: {
       //     dest: '<%= config.dist %>',
       //     flow: {
       //       html: {
       //         steps: {
       //           js: ['concat', 'uglifyjs'],
       //           css: ['cssmin']
       //         },
       //         post: {}
       //       }
       //     }
       //   }
       // },

       // // Performs rewrites based on filerev and the useminPrepare configuration
       // usemin: {
       //   html: ['<%= config.dist %>/{,*/}*.html'],
       //   css: ['<%= config.dist %>/styles/{,*/}*.css'],
       //   options: {
       //     assetsDirs: ['<%= config.dist %>','<%= config.dist %>/images']
       //   }
       // },



    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: false,
          collapseWhitespace: false,
          conservativeCollapse: false,
          removeAttributeQuotes: false,
          removeCommentsFromCDATA: false,
          removeEmptyAttributes: false,
          removeOptionalTags: false,
          // true would impact styles with attribute selectors
          removeRedundantAttributes: false,
          useShortDoctype: false
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/styles/index.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= config.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/scripts/scripts.js': [
    //         '<%= config.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.webp',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*'
          ]
        }]
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        // 'sass:server'
        'compass:server'
      ],
      test: [
      ],
      dist: [
        // 'sass',
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    rename: {
      main: {
        files: [
            {src: ['<%= config.dist %>/index.html'], dest: '<%= config.dist %>/yly.tpl'},
            {src: ['<%= config.dist %>/redirect.html'], dest: '<%= config.dist %>/ylyActivity.tpl'},
            {src: ['<%= config.dist %>/push_redirect.html'], dest: '<%= config.dist %>/ylyActivityPush.tpl'},
            {src: ['<%= config.dist %>/signup_success.html'], dest: '<%= config.dist %>/ylySignupSuccess.tpl'}
        ]
      }
    },

    'string-replace': {
      inline: {
        files: {
          '<%= config.dist %>/': '<%= config.dist %>/**.tpl',
        },
        options: {
          replacements: [
            {
              pattern: 'href="styles/',
              replacement: 'href="{%$tplData.fe%}styles/'
            }, {
              pattern: /url\('images/g,
              replacement: "url('{%$tplData.fe%}images"
            }, {
              pattern: '<script src="scripts/',
              replacement: '<script src="{%$tplData.fe%}scripts/'
            }
          ]
        }
      }
    }

  });


  grunt.registerTask('serve', 'start the server and preview your app', function (target) {

    if (target === 'dist') {
      return grunt.task.run(['build', 'browserSync:dist']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'postcss',
      'csscomb:dist',
      'browserSync:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('test', function (target) {
    if (target !== 'watch') {
      grunt.task.run([
        'clean:server',
        'concurrent:test',
        'postcss'
      ]);
    }

    grunt.task.run([
      'browserSync:test',
      'mocha'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'concat',
    'cssmin', // comment it if something is wrong
    'uglify',
    'copy:dist',
    'filerev',
    'usemin',
    'htmlmin'
    // 'string-replace',
    // 'rename'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};