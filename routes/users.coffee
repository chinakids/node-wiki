express = require 'express'
path = require 'path'
cookieParser = require 'cookie-parser'
session = require 'express-session'
rule = require '../tools/rule'
querystring = require 'querystring'
_ = require 'underscore'
usermodel = require '../models/users'
render = require '../tools/render'

router = express.Router()

# GET users listing.
router.get '/', (req, res, next) ->
  res.send '登陆模块'
  return

# 登陆模块
router.get '/login', (req, res, next) ->
  if req.loginInfo isnt false
    res.redirect req.headers.referer or '/../'
  else
    if req.headers.referer.indexOf('register') isnt -1
      render.login res,
        title : '登陆'
        reUrl : '/../'
    else
      render.login res,
        title : '登陆'
        reUrl : req.headers.referer
    return
  return
  #console.log('login')

router.post '/login', (req, res, next) ->
  # 查询用户名并验证密码
  usermodel.findByEmail req.body.email,(err,user)->
    if err
      console.log err
    #console.log(user);
    if user.length<=0
      res
        .status 200
        .send
          status:0
          info:'帐号或密码错误'
    else
      if rule.md5 req.body.password is user[0].passWord
        # 设置登陆的cookie
        res.cookie 'name',
          user[0].userName ,
            maxAge: 60 * 1000 * 60 * 24 * 30
        res.cookie 'email',
          user[0].email ,
            maxAge: 60 * 1000 * 60 * 24 * 30
            httpOnly: true
        res.cookie 'name_sig',
          rule.md5 user[0].email+'this_is_mixin_string'+req.cookies['connect.id'] ,
            maxAge: 60 * 1000 * 60 * 24 * 30
            httpOnly: true
        res
          .status 200
          .send
            status:1
            info:'登录成功'
            data:
              name:user[0].userName
      else
        res
          .status 200
          .send
            status:0
            info:'帐号或密码错误'
      return
    return
  return

# 登出模块
router.get '/logout', (req, res, next) ->
  res.clearCookie 'name'
  res.clearCookie 'name_sig'
  res.clearCookie 'email'
  res.redirect req.headers.referer

# 注册模块
router.get '/register', (req, res, next) ->
  render.register res,
    title: '注册'
  return

router.post '/register', (req, res, next) ->
  userObj = req.body
  userObj.password = rule.md5 userObj.password
  # 存入数据,先判断是否存在用户
  usermodel.findByEmail userObj.email, (err,user) ->
    if err
      console.log err
    # 判断用户是否存在
    if user.length<=0
      _user = new usermodel
        userName   : userObj.name,
        passWord   : userObj.password,
        email      : userObj.email,
        role       : userObj.role,
        admin      : false
      _user.save (err, user) ->
        if err
          console.log err
        res.send
          status:1
          info:'注册成功'
        return
    else
      res.send
        status:0
        info:'邮箱已被注册'
    return

module.exports = router;
