var express = require('express');
var path = require('path')
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var treeModel = require('./models/tree');

var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var app = express();

var port = 3013;


mongoose.connect('mongodb://127.0.0.1:27017/wiki');

http.request({
    port: port,
    path: '/api/updataMenu',
    method: 'GET'
}, function (res) {
  res.setEncoding('utf8');
}).on('error', function (e) {
  console.log('problem with request: ' + e.message);
}).end();

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

//需要的参数先处理好
app.get(/^\/*/,function(req, res, next){
  console.log(1);
  treeModel.fetch(function(err,tree){
    if(err){
      console.log(err);
    }
    req.tree = tree[0].tree;
    next(); // 将控制转向下一个符合URL的路由
  })
});

app.use('/', index);
app.use('/users', users);
app.use('/api', api);

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
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port);


module.exports = app;
