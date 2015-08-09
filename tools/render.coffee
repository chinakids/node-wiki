fs = require 'fs'
path = require 'path'
jade = require 'jade'

pages = {}
compiledJade = {}
compileOption =
  filename: path.join(__dirname,'./../views/layout')


render = {}
done = 0
all = undefined

#递归创建页面方法
forPage = (callback) ->
  views = path.join(__dirname, '../views')
  dirList = fs.readdirSync views
  dirList.forEach (item) ->
    if not fs.statSync(views + '/' + item).isDirectory()
      if item.indexOf('.jade') isnt -1
        pages[item.split('.')[0]] = item
    return
  callback() if callback
  console.log pages


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
forPage compileRenderService()

module.exports = render
