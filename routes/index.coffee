express = require 'express'
fs = require 'fs'
path = require 'path'
render = require '../tools/render'
mdtools = require '../tools/markDown'
updata = require '../tools/updata'
router = express.Router()

# GET home page.
router.get '/', (req, res, next) ->
  buffStr = fs.readFileSync path.join(__dirname, '../doc/readme.md'),'utf8'
  mdtools.toHtml buffStr, (html, menu) ->
    render.index res,
      title: 'Wiki 文档中心'
      html: html
      menu: menu
      tree: req.tree
      map: []
      loginInfo:req.loginInfo
    return
    #  res.render('index', {
    #    title: 'Wiki 文档中心',
    #    html: html,
    #    menu: menu,
    #    tree: req.tree,
    #    map: [],
    #    loginInfo:req.loginInfo
    #  });
  return

# GET home page.
router.get '/book', (req, res, next) ->
  md = req.query.md
  buffStr = fs.readFileSync path.join(__dirname, '../doc/' + md + '.md'),'utf8'
  mdtools.toHtml buffStr, (html, menu) ->
    render.index res,
      title: md.split('/')[md.split('/').length - 1]
      html: html
      menu: menu
      tree: req.tree
      map: md.split('/')
      loginInfo:req.loginInfo
      download:req.query.md
    return
  return

# 下载
router.get '/download', (req, res, next) ->
  md = req.query.md
  res.download path.join(__dirname, '../doc/' + md + '.md'),md.split('/')[md.split('/').length -1]+'.md'
  return

#删除
router.get '/delete', (req, res, next) ->
  md = req.query.md
  #判断空文件夹
  isEmpty = (path) ->
    status = true
    dirList = fs.readdirSync path
    dirList.forEach (item) ->
      console.log item
      if fs.statSync(path + '/' + item).isDirectory()
        status = false
        #console.log '是文件夹'
        return false
      else
        if item.indexOf('.md') isnt -1
          #console.log '是文件'
          status = false
          return false
    return status
  fs.unlink path.join(__dirname, '../doc/' + md + '.md'), (err) ->
    if err
      console.log err
      res.send
        status : 0
        info : '删除失败'
    else
      console.log '文件'+md+'.md 删除成功!'
      #判断文件删除后目录是否为空
      dir = md.split('/')
      dir.pop()
      #console.log path.join(__dirname, '../doc/' + dir.join('/'))
      #re = isEmpty path.join(__dirname, '../doc/' + dir.join('/'))
      updata.menu req.httpPort
      res.send
        status : 1
        info : '删除成功'
  return

module.exports = router
