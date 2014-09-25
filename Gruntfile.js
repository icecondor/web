module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: {
          "build/index.html": "views/main.jade",
          "build/auth.html": "views/auth.jade",
          "build/user.html": "views/user.jade",
          "build/fence.html": "views/fence.jade"
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
        src: 'assets/*',
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

