module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    slim: {
      dev: {
        options: { pretty: '' },
        files: [{ src:'views/*', dest: 'html/index.html'}]
      }
    }
  });
  grunt.loadNpmTasks('grunt-slim');
  grunt.registerTask('default', ['slim']);
};

