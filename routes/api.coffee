express = require 'express'
fs = require 'fs'
path = require 'path'
_ = require 'underscore'
updata = require '../tools/updata'
treeModel = require '../models/tree'
bookModel = require '../models/book'
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
  if not req.loginInfo
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
  if not req.loginInfo
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
      if not exists
        #目录不存在先创建目录
        fs.mkdirSync path.join(__dirname, '../doc'+arr)
        fs.exists path.join(__dirname, '../doc'+req.body.file + '.md'), (exists) ->
          if not exists
            fs.writeFile decodeURI(path.join(__dirname, '../doc'+req.body.file + '.md')), '#Hello Worldnot \n', (err) ->
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
          if not exists
            fs.writeFile decodeURI(path.join(__dirname, '../doc'+req.body.file + '.md')), '#Hello Worldnot \n', (err) ->
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

module.exports = router
