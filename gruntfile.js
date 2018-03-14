module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: {
          dist: {
              src : 'scripts/*.js',
              dest: 'dist/unics-jassa.js'
          }
      },
      /*min: {
        dist: {
          src: 'dist/unics-jassa.js',
          dest: 'dist/unics-jassa.min.js'
        }
      }*/
      uglify: {
        src: {
          files: {
            'dist/unics-jassa.min.js': 'dist/unics-jassa.js'
          }
        }
      }
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']); 
  };