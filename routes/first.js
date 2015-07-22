var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var rule = require('../tools/rule');
var querystring = require('querystring');
var _ = require('underscore');
var mongoose = require('mongoose');
var usermodel = require('../models/users');
var updata = require('../tools/updata');

var template = fs.readFileSync(path.join(__dirname, '../config/config.js'),
    'utf8');
/* GET First page. */
router.get('/', function(req, res, next) {
  console.log('第一步')
  //其余判断为第一步（新建数据库的页面）
  res.render('first', { title: '初始化' });
});
router.get('/second', function(req, res, next) {
  //第二步（设置超级管理员帐号）
  console.log('admin')
  //console.log(res)
  res.render('register', { title: '初始化' });
});
router.post('/addDb', function(req, res, next) {
  console.log('操作配置')
  template = fs.readFileSync(path.join(__dirname, '../config/_config.js'),
    'utf8');
  template = template.replace('#{{dbPort}}',req.body.dbPort || 27017);
  template = template.replace('#{{dbIp}}',req.body.dbIp || '127.0.0.1');
  template = template.replace('#{{dbName}}',req.body.dbName || 'wiki');
  template = template.replace('#{{dbUsername}}',req.body.dbUsername || '');
  template = template.replace('#{{dbPassword}}',req.body.dbPassword || '');
  template = template.replace('#{{first}}',true);
  console.log(template);
  var dbPort = req.body.dbPort || 27017,
      dbIp = req.body.dbIp || '127.0.0.1',
      dbName = req.body.dbName || 'wiki',
      dbUsername = req.body.dbUsername || '',
      dbPassword = req.body.dbPassword || '';
  //res.send({status:1,info:'数据库配置完成',url:'./second'})
  if(dbUsername == '' || dbPassword == ''){
    console.log('空口令登入')
    console.log('mongodb://'+dbIp.split('/')[0]+':'+dbPort+'/'+dbName);
    mongoose.connect('mongodb://'+dbIp.split('/')[0]+':'+dbPort+'/'+dbName);
    res.send({status:1,info:'数据库配置完成',url:'./second'})
  }else{
    console.log('加密登入')
    mongoose.connect('mongodb://'+dbUsername+':'+dbPassword+'@'+dbIp.split('/')[0]+':'+dbPort+'/'+dbName);
    updata.menu();
    res.send({status:1,info:'数据库配置完成',url:'./second'})
  }
  //res.status(200).send({n:template});
  // fs.writeFile(path.join(__dirname, '../config/config.js'), template, function(err){
  //   if(err){
  //     console.log(err);
  //     res.send({status:0,info:'发生未知错误'})
  //   }else{
  //     res.send({status:1,info:'数据库配置完成'})
  //   }
  // })
});
router.post('/addAdmin', function(req, res, next) {
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
        role       : 99,
        admin      : true
      })
      _user.save(function(err, user){
        if(err){
          console.log(err);
        }
        fs.writeFile(path.join(__dirname, '../config/config.js'), template, function(err){
          if(err){
            console.log(err);
            res.send({status:0,info:'发生未知错误'})
          }else{
            res.send({status:1,info:'初始化完成',url:'./'})
          }
        })
        //res.send({status:1,info:'注册成功',url:'./'});
      })
    }else{
      res.send({status:0,info:'邮箱已被注册'});
    }
  })
});


module.exports = router;
