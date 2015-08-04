express = require 'express'
fs = require 'fs'
path = require 'path'
_ = require 'underscore'
updata = require '../tools/updata'
treeModel = require '../models/tree'
bookModel = require '../models/book'
render = require '../tools/render'
router = express.Router()

#API Route
router.get '/', (req, res, next) ->
  res.status 200
     .send 'api状态正常'
  return

#API updataMenu.
router.get '/updataMenu', (req, res, next) ->
  #书存入数据库的方法
  updata.menu()
  res.send
    status:1
    info:'请求成功'
  return

#api search
router.get '/search', (req, res, next) ->
  #console.log(req.query.s);
  bookModel.findByName req.query.s, (err,book) ->
    console.log err if err
    #book = book is [] ? null : book
    render.list res,
      title: '搜索结果'
      tree: req.tree
      loginInfo:req.loginInfo
      bookList : book
    return
  return

#api 获取源文件内容
router.get '/getContent', (req, res, next) ->
  #console.log(req.query.md);
  buffStr = fs.readFileSync path.join(__dirname, '../doc/' + req.query.md + '.md'),'utf8'
  res.send
    content:buffStr
    title:req.query.md.split('/')[req.query.md.split('/').length - 1]+'.md'
  #res.status(200).send('api状态正常');
  return

#api 保存文件数据
router.post '/saveBookContent', (req,res,next) ->
  unless req.loginInfo
    res.send
      status:0
      info:'此方法需要登陆'
  else
    #console.log(decodeURI(path.join(__dirname, '../doc/' + req.body.md + '.md')));
    fs.writeFile decodeURI(path.join(__dirname, '../doc/' + req.body.md + '.md')),
      req.body.content,
      (err) ->
        if err
          console.log err
          res.send
            status:0
            info:'保存失败,请重试'
        else
          #重写目录
          updata.menu();
          res.send
            status:1
            info:'保存成功'
        return
  return

#API 创建文件
router.post '/addFile', (req,res,next) ->
  #console.log(path.join(__dirname, '../doc'+req.body.file + '.md'));
  unless req.loginInfo
    res.send
      status:0
      info:'此方法需要登陆'
  else
    arr = req.body.file.split('/')
    arr.pop()
    arr = arr.join('/')
    fs.exists path.join(__dirname, '../doc'+arr), (exists) ->
      #console.log(req.httpPort);
      # => false
      unless exists
        #目录不存在先创建目录
        fs.mkdirSync path.join(__dirname, '../doc'+arr)
        fs.exists path.join(__dirname, '../doc'+req.body.file + '.md'), (exists) ->
          unless exists
            fs.writeFile decodeURI(path.join(__dirname, '../doc'+req.body.file + '.md')), '#Hello World! \n', (err) ->
              if err
                console.log err
                res.send
                  status:0
                  info:'文件写入错误'
              else
                #重写目录
                updata.menu()
                res.send
                  status:1
                  info:'创建成功'
                  url:'book?md='+req.body.file.substr(1)
              return
          else
            res.send
              status:0
              info:'文件存在,无法创建'
          return
      else
        #直接创建
        fs.exists path.join(__dirname, '../doc'+req.body.file + '.md'), (exists) ->
          unless exists
            fs.writeFile decodeURI(path.join(__dirname, '../doc'+req.body.file + '.md')), '#Hello World! \n', (err) ->
              if err
                console.log err
                res.send
                  status:0
                  info:'文件写入错误'
              else
                #重写目录
                updata.menu()
                res.send
                  status:1
                  info:'创建成功'
                  url:'book?md='+req.body.file.substr(1)
              return
          else
            res.send
              status:0
              info:'文件存在,无法创建'
          return
      return
  return

#api 下载文件
router.get '/download', (req, res, next) ->
  md = req.query.md
  res.download path.join(__dirname, '../doc/' + md + '.md'),md.split('/').pop()+'.md'
  return

#api 删除文件
router.get '/delete', (req, res, next) ->
  unless req.loginInfo
    res.send
      status:0
      info:'此方法需要登陆'
  else
    md = req.query.md
    #判断空文件夹
    isEmpty = (path,callback) ->
      status = true
      callback = callback or () ->
      dirList = fs.readdirSync path
      dirList.forEach (item) ->
        #console.log item
        if fs.statSync(path + '/' + item).isDirectory()
          status = false
          #console.log '是文件夹'
          return false
        else
          if item.indexOf('.md') isnt -1
            #console.log '是文件'
            status = false
            return false
      if status
        #为空,删除文件夹后向上递归
        fs.rmdir path
        newPath = path.split('/')
        newPath.pop()
        isEmpty newPath.join('/'),callback
      else
        #不为空,执行 callback
        callback()
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
        console.log path.join(__dirname, '../doc/' + dir.join('/'))
        isEmpty path.join(__dirname, '../doc/' + dir.join('/')), () ->
          updata.menu req.httpPort
          res.send
            status : 1
            info : '删除成功'
          return
    return

module.exports = router
