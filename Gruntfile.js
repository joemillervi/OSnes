module.exports = function (grunt) {

  // Inlude necessary Grunt plugins:
  grunt.loadNpmTasks('grunt-karma');

  // Configure Grunt:
  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),
    karma: {
      options: {
        configFile: './karma.conf.js',
        reporters: [
          'progress'//,
          //'coverage'
        ]
      },
      single: {
        singleRun: true
      },
      ci: {
        singleRun: true//,
        // coverageReporter: {
        //   type: 'lcov',
        //   dir: './results/coverage'
        // }
      }
    }
  });

  // Register Grunt tasks:
  grunt.registerTask('testClient', ['karma:single']);

};
