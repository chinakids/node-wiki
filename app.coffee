express = require 'express'
path = require 'path'
http = require 'http'
favicon = require 'serve-favicon'
logger = require 'morgan'
cookieParser = require 'cookie-parser'
bodyParser = require 'body-parser'
rule = require './tools/rule'
updata = require './tools/updata'
mongoose = require 'mongoose'
treeModel = require './models/tree'
userModel = require './models/users'
render = require './tools/render'
config = require './config/config'


app = express()

port = 3013

# view engine setup
app.set 'views', path.join(__dirname, 'views')
app.set 'view engine', 'jade'

# uncomment after placing your favicon in /public
#app.use(favicon(__dirname + '/public/favicon.ico'));
app.use logger('dev')
app.use bodyParser.json()
app.use bodyParser.urlencoded
  extended: false

app.use cookieParser()
app.use express.static path.join(__dirname, 'public')
app.use express.static path.join(__dirname, 'doc')


if not config.isFirst
  #首次初始化
  #console.log('首次')
  first = require './routes/first'
  app.post /^\/*/, (req, res, next) ->
    req.httpPort = port
    next()
    return

  app.get /^\/*/, (req, res, next) ->
    req.httpPort = port
    next()
    return

  app.use '/', first
else
  index = require './routes/index'
  users = require './routes/users'
  api = require './routes/api'
  #正常启动
  if /[\w\W]+/.test(config.dbUsername)
    #口令登陆
    #console.log('加密登入')
    mongoose.connect 'mongodb://'+config.dbUsername+':'+config.dbPassword+'@'+config.dbIp.split('/')[0]+':'+config.dbPort+'/'+config.dbName
  else
    #空口令登陆
    #console.log('空口令登入')
    mongoose.connect 'mongodb://'+config.dbIp.split('/')[0]+':'+config.dbPort+'/'+config.dbName
  #更新目录
  updata.menu(port)

  #需要的参数先处理好
  app.post /^\/*/, (req, res, next) ->
    req.httpPort = port
    email = req.cookies['email']
    connectid = req.cookies['connect.id']
    singename = req.cookies['name_sig']
    if rule.pw email,connectid,singename
      #获取用户信息并传递
      userModel.findByEmail email, (err,user) ->
        if err
          console.log err
        if user.length <=0
          req.loginInfo = false
        else
          req.loginInfo = user[0]
        next() # 将控制转向下一个符合URL的路由
        return
    else
      req.loginInfo = false
      next() # 将控制转向下一个符合URL的路由
    return

  app.get /^\/*/, (req, res, next) ->
    #读取目录
    treeModel.fetch (err,tree) ->
      if err
        console.log err
      if tree.length <= 0
        req.tree = []
      else
        req.tree = tree[0].tree
      #判断登陆
      email = req.cookies['email']
      connectid = req.cookies['connect.id']
      singename = req.cookies['name_sig']
      if rule.pw email,connectid,singename
        #获取用户信息并传递
        userModel.findByEmail email, (err,user) ->
          if err
            console.log err
          if user.length <=0
            req.loginInfo = false
          else
            req.loginInfo = user[0]
          next(); # 将控制转向下一个符合URL的路由
          return
      else
        req.loginInfo = false
        next() # 将控制转向下一个符合URL的路由
  app.use '/', index
  app.use '/users', users
  app.use '/api', api

#出错的处理
app.use (req, res, next) ->
  err = new Error 'Not Found'
  err.status = 404
  next(err)
  return
app.use (err, req, res, next) ->
  res.status err.status or 500
  if not config.isFirst
    res.redirect '/'
  else
    render.error res,
      title: err.message
      error: {}
      map:[]
      tree: req.tree
      loginInfo:req.loginInfo
  return

app.listen port


module.exports = app
