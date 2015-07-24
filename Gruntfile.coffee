module.exports = (grunt) ->

  require('load-grunt-tasks')(grunt)
  require('time-grunt')(grunt)
  grunt.initConfig
    watch:
      less:
        files: [
          'public/less/**/*.less'
        ]
        tasks: ['less']
    less:
      options:
        compress: true
        yuicompress: false
        sourceMap:true
      style:
        files: [{
          expand: true
          cwd: 'public/less'
          src: ['**/*.less']
          dest: 'public/stylesheets'
          ext: '.min.css'
        }]


  #注冊任务
  grunt.registerTask 'default', [
  	'less'
    'watch'
  ]
  grunt.registerTask 'test', ['jshint']

  grunt.event.on 'watch', (action, filepath, target) ->
    grunt.log.writeln target + ': ' + filepath + ' has ' + action
    return
