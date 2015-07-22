var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var rule = require('../tools/rule');
var querystring = require('querystring');
var _ = require('underscore');
var usermodel = require('../models/users');

var db;
/* GET First page. */
router.get('/', function(req, res, next) {
  console.log(req);
  //res.send('卧槽');
  if(req.query.p == 2){
    console.log('第二步')
    //第二步（设置超级管理员帐号）
    res.render('register', { title: '设置管理员帐号' });
  }else{
    console.log('第一步')
    //其余判断为第一步（新建数据库的页面）
    res.render('first', { title: '初始化' });
  }
});
router.post('/first/addDb', function(req, res, next) {
  var template = fs.fs.readFileSync(path.join(__dirname, '../config/_config.js'),
    'utf8');
  template.replace('#{{dbPort}}',req.body.dbPort);
  template.replace('#{{dbAddress}}',req.body.dbAddress);
  template.replace('#{{dbName}}',req.body.dbName);
  template.replace('#{{dbUsername}}',req.body.dbUsername);
  template.replace('#{{dbPassword}}',req.body.dbPassword);
  template.replace('#{{first}}',false);
  console.log(template);
  fs.writeFile(path.join(__dirname, '../config/config.js'), template, function(err){
    if(err){
      console.log(err);
      res.send({status:0,info:'发生未知错误'})
    }else{
      res.send({status:1,info:'数据库配置完成'})
    }
  })
  res.send()
});
router.post('/first/addAdmin', function(req, res, next) {
  var userObj = req.body;
  var _user;
  userObj.password = rule.md5(userObj.password);
  /* 存入数据,先判断是否存在用户 */
  usermodel.findByEmail(userObj.email,function(err,user){
    if(err){
      console.log(err);
    }
    /* 判断用户是否存在 */
    if(user.length<=0){
      _user = new usermodel({
        userName   : userObj.name,
        passWord   : userObj.password,
        email      : userObj.email,
        role       : userObj.role,
        admin      : true
      })
      _user.save(function(err, user){
        if(err){
          console.log(err);
        }
        res.send({status:1,info:'注册成功'});
      })
    }else{
      res.send({status:0,info:'邮箱已被注册'});
    }
  })
});


module.exports = router;
