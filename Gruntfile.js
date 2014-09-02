module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    slim: {
      dev: {
        options: { pretty: '' },
        files: [{ src:'views/*', dest: 'html/index.html'}]
      }
    },
    compass: {
      sassDir: "sass",
      cssDir: "css"
    }
  });

  grunt.loadNpmTasks('grunt-slim')
  grunt.loadNpmTasks('grunt-contrib-compass')

  grunt.registerTask('default', ['compass', 'slim'])
}

