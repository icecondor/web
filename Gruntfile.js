module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      compile: {
        options: {
          basedir: "./views",
          pretty: true
        },
        files: {
          "build/dashboard.html": "views/main.jade",
          "build/auth.html": "views/auth.jade",
          "build/map.html": "views/map.jade",
          "build/profile.html": "views/profile.jade",
          "build/billing.html": "views/billing.jade",
          "build/p/contact-us.html": "views/page/contact-us.jade",
          "build/p/terms-of-service.html": "views/page/terms-of-service.jade",
          "build/b/index.html": "views/blog/index.jade",
          "build/b/2014/11/21/why-icecondor.html": "views/blog/2014/11/21/why-icecondor.jade",
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
    uglify: {
      dev: {
        options: {
          beautify: true,
          mangle: false
        },
        files: {
          'build/js/app.js': ['js/*']
        }
      }
    },
    copy: {
      main: {
        src: 'assets/**',
        dest: 'build/',
      },
    },
    watch: {
      html: {
        files: ['views/*'],
        tasks: ['jade'],
      },
      css: {
        files: ['sass/*'],
        tasks: ['compass'],
      },
      js: {
        files: ['js/*'],
        tasks: ['uglify'],
      },
      assets: {
        files: ['assets/*'],
        tasks: ['copy'],
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-contrib-compass')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-copy')

  grunt.registerTask('default', ['compass', 'jade', 'uglify', 'copy'])
}

