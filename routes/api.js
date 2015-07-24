var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var updata = require('../tools/updata');

var treeModel = require('../models/tree');
var bookModel = require('../models/book');
/* API Route. */
router.get('/', function(req, res, next) {
  //console.log('///////////////////////////')
  res.status(200).send('api状态正常');
});
/* API updataMenu. */
router.get('/updataMenu', function(req, res, next) {
  //书存入数据库的方法
  updata.menu();
  res.send({status:1,info:'请求成功'})
});
//api search
router.get('/search', function(req, res, next) {
  console.log(req.query.s);
  bookModel.findByName(req.query.s,function(err,book){
    if(err){
      console.log(err)
    }
    //book = book == [] ? null : book
    render.list(res, {
      title: '搜索结果',
      tree: req.tree,
      loginInfo:req.loginInfo,
      bookList : book
    });
  })
  //res.status(200).send('api状态正常');
});
//api 获取源文件内容
router.get('/getContent', function(req, res, next) {
  //console.log(req.query.md);
  var buffStr = fs.readFileSync(path.join(__dirname, '../doc/' + req.query.md + '.md'),
    'utf8');
  res.send({content:buffStr,title:req.query.md.split('/')[req.query.md.split('/').length - 1]+'.md'});
  //res.status(200).send('api状态正常');
});
//api 保存文件数据
router.post('/saveBookContent',function(req,res,next){
  if(!req.loginInfo){
    res.send({status:0,info:'此方法需要登陆'});
  }else{
    //console.log(decodeURI(path.join(__dirname, '../doc/' + req.body.md + '.md')));
    fs.writeFile(decodeURI(path.join(__dirname, '../doc/' + req.body.md + '.md')), req.body.content, function(err){
      if(err){
        console.log(err);
        res.send({status:0,info:'保存失败,请重试'})
      }else{
        //重写目录
        updata.menu();
        res.send({status:1,info:'保存成功'});
      }
    });
  }
});
//API 创建文件
router.post('/addFile',function(req,res,next){
  //console.log(path.join(__dirname, '../doc'+req.body.file + '.md'));
  if(!req.loginInfo){
    res.send({status:0,info:'此方法需要登陆'});
  }else{
    var arr = req.body.file.split('/');
      arr.pop();
      arr = arr.join('/');
    fs.exists(path.join(__dirname, '../doc'+arr), function(exists) {
      console.log(req.httpPort);
      // => false
      if(!exists){
        //目录不存在先创建目录
        fs.mkdirSync(path.join(__dirname, '../doc'+arr));
        fs.exists(path.join(__dirname, '../doc'+req.body.file + '.md'),function(exists){
          if(!exists){
            fs.writeFile(decodeURI(path.join(__dirname, '../doc'+req.body.file + '.md')), '#Hello World!\n', function(err){
              if(err){
                console.log(err);
                res.send({status:0,info:'文件写入错误'});
              }else{
                //重写目录
                updata.menu();
                res.send({status:1,info:'创建成功',url:'book?md='+req.body.file.substr(1)});
              }
            });
          }else{
            res.send({status:0,info:'文件存在,无法创建'});
          }
        })
      }else{
        //直接创建
        fs.exists(path.join(__dirname, '../doc'+req.body.file + '.md'),function(exists){
          if(!exists){
            fs.writeFile(decodeURI(path.join(__dirname, '../doc'+req.body.file + '.md')), '#Hello World!\n', function(err){
              if(err){
                console.log(err);
                res.send({status:0,info:'文件写入错误'});
              }else{
                //重写目录
                updata.menu();
                res.send({status:1,info:'创建成功',url:'book?md='+req.body.file.substr(1)});
              }
            });
          }else{
            res.send({status:0,info:'文件存在,无法创建'});
          }
        })
      }
    });
  }
});
module.exports = router;
