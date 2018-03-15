module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: {
          dist: {
              // order is relevant: first the file with the declaration of the angular module
              src : ['scripts/UnicsJassa.js', 'scripts/*.js'],
              dest: 'dist/unics-jassa.js'
          }
      },
      uglify: {
        options : {
          mangle : false
        },
        src: {
          files: {
            'dist/unics-jassa.min.js': 'dist/unics-jassa.js'
          }
        }
      },
      jsdox: {
        generate: {
          options: {
            contentsTitle: 'Documentation',
          },

          src: ['scripts/*.js'],
          dest: 'docs/markdown'
        }
      }
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdox');

    // Default task(s).
    grunt.registerTask('generate-docs', ['jsdox:generate']);
    grunt.registerTask('default', ['concat', 'uglify', 'jsdox']); 
  };