module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: {
          "build/html/index.html": ["views/*.jade"]
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-contrib-compass')

  grunt.registerTask('default', ['compass', 'jade'])
}

