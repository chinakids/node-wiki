var express = require('express');
var path = require('path')
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var rule = require('./tools/rule');
var updata = require('./tools/updata');
var mongoose = require('mongoose');
var treeModel = require('./models/tree');
var userModel = require('./models/users');

var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var config = require('./config/config')

var app = express();

var port = 3013;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'doc')));

if(!config.isFirst){
  //首次初始化
}else{
  //正常启动
  if(/[\w\W]+/.test(config.dbUsername)){
    //口令登陆
    console.log('加密登入')
    mongoose.connect('mongodb://'+config.dbUsername+':'+config.dbPassword+'@'+config.dbIp.split('/')[0]+':'+config.dbPort+'/'+config.dbName);
  }else{
    //空口令登陆
    console.log('空口令登入')
    mongoose.connect('mongodb://'+config.dbIp.split('/')[0]+':'+config.dbPort+'/'+config.dbName);
  }

  updata.menu(port);

  //需要的参数先处理好
  app.post(/^\/*/,function(req, res, next){
    req.httpPort = port;
    var email = req.cookies['email'],
        connectid = req.cookies['connect.id'],
        singename = req.cookies['name_sig'];
    if(rule.pw(email,connectid,singename)){
      //获取用户信息并传递
      userModel.findByEmail(email,function(err,user){
        if(err){
          console.log(err);
        };
        if(user.length <=0){
          req.loginInfo = false;
        }else{
          req.loginInfo = user[0];
        }
        next(); // 将控制转向下一个符合URL的路由
      });
    }else{
      req.loginInfo = false;
      next(); // 将控制转向下一个符合URL的路由
    }
  });
  app.get(/^\/*/,function(req, res, next){
    //读取目录
    treeModel.fetch(function(err,tree){
      if(err){
        console.log(err);
      }
      console.log(tree);
      if(tree.length <= 0){
        req.tree = [];
      }else{
        req.tree = tree[0].tree;
      }
      //判断登陆
      var email = req.cookies['email'],
          connectid = req.cookies['connect.id'],
          singename = req.cookies['name_sig'];
      if(rule.pw(email,connectid,singename)){
        //获取用户信息并传递
        userModel.findByEmail(email,function(err,user){
          if(err){
            console.log(err);
          };
          if(user.length <=0){
            req.loginInfo = false;
          }else{
            req.loginInfo = user[0];
          }
          next(); // 将控制转向下一个符合URL的路由
        });
      }else{
        req.loginInfo = false;
        next(); // 将控制转向下一个符合URL的路由
      }
    })
  });
  app.use('/', index);
  app.use('/users', users);
  app.use('/api', api);
}



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title: err.message,
      error: err,
      map:[],
      tree: req.tree,
      loginInfo:req.loginInfo
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title: err.message,
    error: {},
    map:[],
    tree: req.tree,
    loginInfo:req.loginInfo
  });
});

app.listen(port);


module.exports = app;
