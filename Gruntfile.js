module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      compile: {
        options: {
          basedir: "./jade",
          pretty: true
        },
        files: {
          "build/dashboard.html": "jade/main.jade",
          "build/auth.html": "jade/auth.jade",
          "build/map.html": "jade/map.jade",
          "build/access.html": "jade/access.jade",
          "build/data.html": "jade/data.jade",
          "build/fences.html": "jade/fences.jade",
          "build/profile.html": "jade/profile.jade",
          "build/billing.html": "jade/billing.jade",
          "build/p/contact-us.html": "jade/page/contact-us.jade",
          "build/p/terms-of-service.html": "jade/page/terms-of-service.jade",
          "build/p/developer.html": "jade/page/developer.jade",
          "build/b/index.html": "jade/blog/index.jade",
          "build/b/2014/11/21/why-icecondor.html": "jade/blog/2014/11/21/why-icecondor.jade",
          "build/b/2014/12/12/history-control.html": "jade/blog/2014/12/12/history-control.jade",
          "build/b/2015/02/23/access-links.html": "jade/blog/2015/02/23/access-links.jade",
        }
      }
    },

    compass: {
      dev: {
        options: {
          sassDir: "sass",
          cssDir: "build/css"
        }
      }
    },
    flow: {
      app: {
        src: 'js/',            // also `.flowconfig` folder
        options: {
          background: false,    // Watch/Server mode
          all: true,           // Check all files regardless
          lib: '.flow',              // Library directory
          stripRoot: false,     // Relative vs Absolute paths
          weak: true,          // Force weak check
          showAllErrors: false, // Show more than 50 errors
        }
      }
    },
    uglify: {
      dev: {
        options: {
          beautify: true,
          mangle: false
        },
        files: [{
          'build/js/app.js': ['js/*.js']
        }, {
          expand: true,
          cwd: 'js',
          src: 'ui/*.js',
          dest: 'build/js'
        }]
      }
    },
    copy: {
      main: {
        src: ['assets/**/*'],
        dest: 'build/',
      },
    },
    watch: {
      html: {
        files: ['jade/**'],
        tasks: ['jade'],
      },
      css: {
        files: ['sass/**'],
        tasks: ['compass'],
      },
      js: {
        files: ['js/**'],
        tasks: ['uglify'],
      },
      assets: {
        files: ['assets/**'],
        tasks: ['copy'],
      },
    },
    browserify: {

    }
  });

  grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-contrib-compass')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-flow-type-check')
  grunt.loadNpmTasks('grunt-browserify')

  grunt.registerTask('default', ['compass', 'jade', 'uglify', 'copy'])
}

