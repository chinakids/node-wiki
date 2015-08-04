express = require 'express'
fs = require 'fs'
path = require 'path'
_ = require 'underscore'
mongoose = require 'mongoose'
rule = require '../tools/rule'
updata = require '../tools/updata'
render = require '../tools/render'
session = require 'express-session'
querystring = require 'querystring'
usermodel = require '../models/users'
cookieParser = require 'cookie-parser'
router = express.Router()

template = fs.readFileSync path.join(__dirname, '../config/config.js'),'utf8'
#GET First page.
router.get '/', (req, res, next) ->
  #console.log('第一步')
  #其余判断为第一步（新建数据库的页面）
  render.first res,
    title: '初始化'
  return

router.get '/second', (req, res, next) ->
  #第二步（设置超级管理员帐号）
  #console.log('admin')
  #console.log(res)
  render.register res,
    title: '初始化'
  return

router.post '/addDb', (req, res, next) ->
  #console.log('操作配置')
  template = fs.readFileSync path.join(__dirname, '../config/_config.template'),'utf8'
  template = template.replace '#{{dbPort}}',req.body.dbPort or 27017
  template = template.replace '#{{dbIp}}',req.body.dbIp or '127.0.0.1'
  template = template.replace '#{{dbName}}',req.body.dbName or 'wiki'
  template = template.replace '#{{dbUsername}}',req.body.dbUsername or ''
  template = template.replace '#{{dbPassword}}',req.body.dbPassword or ''
  template = template.replace '#{{first}}',true
  #console.log(template);
  dbPort = req.body.dbPort or 27017
  dbIp = req.body.dbIp or '127.0.0.1'
  dbName = req.body.dbName or 'wiki'
  dbUsername = req.body.dbUsername or ''
  dbPassword = req.body.dbPassword or ''
  #res.send({status:1,info:'数据库配置完成',url:'./second'})
  if dbUsername is '' or dbPassword is ''
    #console.log('空口令登入')
    #console.log('mongodb://'+dbIp.split('/')[0]+':'+dbPort+'/'+dbName);
    mongoose.connect 'mongodb://'+dbIp.split('/')[0]+':'+dbPort+'/'+dbName
    res.send
      status:1
      info:'数据库配置完成'
      url:'./second'
  else
    #console.log('加密登入')
    mongoose.connect 'mongodb://'+dbUsername+':'+dbPassword+'@'+dbIp.split('/')[0]+':'+dbPort+'/'+dbName
    updata.menu()
    res.send
      status:1
      info:'数据库配置完成'
      url:'./second'
  return
  #  res.status(200).send({n:template});
  #  fs.writeFile(path.join(__dirname, '../config/config.js'), template, function(err){
  #    if(err){
  #      console.log(err);
  #      res.send({status:0,info:'发生未知错误'})
  #    }else{
  #      res.send({status:1,info:'数据库配置完成'})
  #    }
  #  })

router.post '/addAdmin', (req, res, next) ->
  userObj = req.body
  userObj.password = rule.md5(userObj.password)
  # 存入数据,先判断是否存在用户
  usermodel.findByEmail userObj.email, (err,user) ->
    if err
      console.log err
    # 判断用户是否存在
    if user.length<=0
      _user = new usermodel
        userName   : userObj.name
        passWord   : userObj.password
        email      : userObj.email
        role       : 99
        admin      : true

      _user.save (err, user) ->
        if err
          console.log err
        fs.writeFile path.join(__dirname, '../config/config.js'), template, (err) ->
          if err
            console.log err
            res.send
              status:0
              info:'发生未知错误'
          else
            res.send
              status:1
              info:'初始化完成'
              url:'./'
          return
        #res.send({status:1,info:'注册成功',url:'./'});
        return
    else
      #存在的话更新为超级用户
      _user =
        userName   : userObj.name
        passWord   : userObj.password
        email      : userObj.email
        role       : 99
        admin      : true
      _user = _.extend user[0],_user
      _user.save (err, user) ->
        if err
          console.log err
        fs.writeFile path.join(__dirname, '../config/config.js'), template, (err) ->
          if err
            console.log(err);
            res.send
              status:0
              info:'发生未知错误'
          else
            res.send
              status:1
              info:'初始化完成'
              url:'./'
          return
    return

module.exports = router
