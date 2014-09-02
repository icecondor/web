module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: {
          "build/index.html": "views/main.jade"
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
          beautify: true
        },
        files: {
          'build/js/app.js': ['js/app.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-contrib-compass')
  grunt.loadNpmTasks('grunt-contrib-uglify')

  grunt.registerTask('default', ['compass', 'jade', 'uglify'])
}

