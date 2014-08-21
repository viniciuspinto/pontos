module.exports = function(grunt) {

  grunt.initConfig({
    uglify: {
      options: {
        sourceMap: true,
        wrap: true
      },
      dist: {
        files: {
          'dist/pontos.min.js': [
            'src/main.js',
            'src/ObserverCollection.js',
            'src/GameManager.js',
            'src/Dot.js',
            'src/Column.js',
            'src/Board.js',
            'src/Renderer.js',
            'src/EventManager.js',
            'src/ScoreStorage.js',
            'src/Util.js',
            'src/Animator.js'
          ]
        }
      }
    },

    concat: {
      dist: {
        src: ['lib/*.js', 'dist/pontos.min.js'],
        dest: 'dist/pontos.full.min.js'
      },
      libs: {
        src: ['lib/*.js'],
        dest: 'dist/pontos-libs.min.js'
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'dist/style.min.css': 'style.scss',
          'dist/animate.css': 'lib/animate.css',
          'dist/themes/doge/theme-doge.min.css': 'themes/doge/theme-doge.scss'
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true
        },
        files: {
          'dist/template_main.html': 'src/template_main.html'
        }
      }
    },

    copy: {
      dist: {
        files: [
          { src: [ 
              'themes/doge/comic_sans.woff',
              'themes/doge/bg-doge.png',
              'themes/doge/doge-cut-circle-100px.png'], 
            dest: 'dist/' }
        ]
      }
    },

    clean: {
      dist: ['./dist/*']
    },

    bump: {
      options: {
        pushTo: 'origin'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('jsmin', function() {
    grunt.task.run('uglify:dist');
    grunt.task.run('concat:dist');
    grunt.task.run('concat:libs');
  });

  grunt.registerTask('default', ['clean:dist', 'jsmin', 'sass', 'htmlmin', 'copy']);

};
