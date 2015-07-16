var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var rule = require('../tools/rule');
var querystring = require('querystring');
var _ = require('underscore');
var usermodel = require('../models/users');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('登陆模块');
});
/* 登陆模块 */
router.get('/login', function(req, res, next) {
  //console.log('/login')
  //res.redirect('/');
  var name = req.cookies.name;
  var connectid = req.cookies['connect.id'];
  var singename = req.cookies['name_sig'];
  if(name != undefined){
    if(rule.pw(name,connectid,singename)){
      res.redirect('/users');
    }else{
      res.render('user', { title: 'logins' });
    }
  }else{
    res.render('user', { title: 'logins' });
  }
  //console.log('login')
});
router.post('/login', function(req, res, next) {
  /* 查询用户名并验证密码 */
  usermodel.findByName(req.body.username,function(err,user){
    if(err){
      console.log(err);
    }
    console.log(user);
    if(user.length<=0){
      res.status(200).send({status:0,info:'帐号或密码错误'});
    }else{
      if(rule.md5(req.body.password) == user[0].passWord){
        /* 设置登陆的cookie */
        res.cookie('name', user[0].name , { maxAge: 60 * 1000 * 60 * 24 * 30 });
        res.cookie('name_sig', rule.md5(user[0].name+'this_is_mixin_string'+req.cookies['connect.id']) , { maxAge: 60 * 1000 * 60 * 24 * 30 });
        res.status(200).send({status:1,data:{name:user[0].name}});
      }else{
        res.status(200).send({status:0,info:'帐号或密码错误'});
      }
    }
  })
});
/* 登出模块 */
router.get('/logout', function(req, res, next) {
  res.clearCookie('name');
  res.clearCookie('name_sig');
  res.redirect('/../');
});
/* 注册模块 */
router.get('/register', function(req, res, next) {
  res.render('user', { title: '注册' });
});
router.post('/register', function(req, res, next) {
  var userObj = req.body;
  var _user;
  userObj.password = rule.md5(userObj.password);
  /* 存入数据,先判断是否存在用户 */
  usermodel.findByName(userObj.username,function(err,user){
    if(err){
      console.log(err);
    }
    /* 判断用户是否存在 */
    if(user.length<=0){
      _user = new usermodel({
        userName   : userObj.username,
        passWord   : userObj.password,
        name       : userObj.username
      })
      _user.save(function(err, user){
        if(err){
          console.log(err);
        }
        res.send({status:1,info:'注册成功'});
      })
    }else{
      res.send({status:0,info:'此帐号已存在或者存在重名帐号'});
    }
  })
});
module.exports = router;
