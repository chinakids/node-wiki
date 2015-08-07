fs = require 'fs'
path = require 'path'
jade = require 'jade'
pages =require './../views/viewConfig'


compiledJade = {}
compileOption =
  filename: path.join(__dirname,'./../views/layout')

render = {}
done = 0
all = undefined

# res发送html字符串
sendPage = (res, html) ->
  res.end html

# 通过map实现每个页面渲染func的生成
compileRenderService = ->
  done = 0
  all = 0
  for name of pages
    preCompile path.join(__dirname,'./../views/'+pages[name]), name
    all++
  return

preCompile = (filePath, pageName) ->
  #console.log(filePath);
  # fs.readFile( path.join( viewPathSet.viewer, p+'.jade' ), function( err, jadeStr ){
  fs.readFile filePath, (err, jadeStr) ->
    if err
      console.log 'read jade file err: ' + filePath + '.jade'
    else
      compiledJade[pageName] = jade.compile jadeStr, compileOption
      render[pageName] = (res, data) ->
        html = compiledJade[pageName] data
        sendPage res, html
        return
      done++
      console.log '\tre compile jade views' if done >= all

console.log '\tre compile jade views'
compileRenderService()

module.exports = render
