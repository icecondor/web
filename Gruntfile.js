module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    pug: {
      compile: {
        options: {
          basedir: "./pug",
          pretty: true
        },
        files: {
          "build/dashboard.html": "pug/main.pug",
          "build/auth.html": "pug/auth.pug",
          "build/map.html": "pug/map.pug",
          "build/access.html": "pug/access.pug",
          "build/data.html": "pug/data.pug",
          "build/fences.html": "pug/fences.pug",
          "build/rules.html": "pug/rules.pug",
          "build/profile.html": "pug/profile.pug",
          "build/billing.html": "pug/billing.pug",
          "build/p/contact-us.html": "pug/page/contact-us.pug",
          "build/p/terms-of-service.html": "pug/page/terms-of-service.pug",
          "build/p/developer.html": "pug/page/developer.pug",
          "build/b/index.html": "pug/blog/index.pug",
          "build/b/2014/11/21/why-icecondor.html": "pug/blog/2014/11/21/why-icecondor.pug",
          "build/b/2014/12/12/history-control.html": "pug/blog/2014/12/12/history-control.pug",
          "build/b/2015/02/23/access-links.html": "pug/blog/2015/02/23/access-links.pug",
          "build/b/2015/06/15/privacy-fences.html": "pug/blog/2015/06/15/privacy-fences.pug",
          "build/b/2015/06/25/download-history.html": "pug/blog/2015/06/25/download-history.pug",
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
        files: ['pug/**'],
        tasks: ['pug'],
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

  grunt.loadNpmTasks('grunt-contrib-pug')
  grunt.loadNpmTasks('grunt-contrib-compass')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-flow')
  grunt.loadNpmTasks('grunt-browserify')

  grunt.registerTask('default', ['compass', 'pug', 'uglify', 'copy'])
}

