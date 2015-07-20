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
  function saveBook(name,path){
    bookModel.findByUrl(path,function(err,book){
      if(err){
        console.log(err);
      }
      if(book.length <= 0){
        //新建储存
        var newBook = new bookModel({
          name    : name,
          path    : path,
          map     : path.split('doc/')[1].split('/'),
          url     : '/book?md='+path.split('doc/')[1].split('.')[0]
        })
        newBook.save(function(err,book){
          if(err){
            console.log(err)
          }
          console.log('新建一条书籍')
        })
      }else{
        //更新储存（一个 URL 只会有一条）
        var bookInfo = {
          name    : name,
          path    : path,
          map     : path.split('doc/')[1].split('/'),
          url     : '/book?md='+path.split('doc/')[1].split('.')[0]
        }
        var newBook = _.extend(book[0],bookInfo);
        newBook.save(function(err,book){
          if(err){
            console.log(err)
          }
          console.log('修改一条书籍')
        })
      }
    })
  }
  var treeNode = {};
  //目录遍历
  function walk(path, treeNode, callback) {
    var callback = callback || function(){};
    treeNode.path = path;
    treeNode.subNodes = [];
    treeNode.files = [];
    treeNode.pathName = path.split('/')[path.split('/').length - 1];
    console.log(path);
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item) {
      if (fs.statSync(path + '/' + item).isDirectory()) {
        var subNode = {};
        treeNode.subNodes.push(subNode);
        walk(path + '/' + item, subNode);
      } else {
        if (item != '.DS_Store' && item != 'readme.md' && item.indexOf(
            '.md') !=
          -1) {
          saveBook(item.split('.')[0],path + '/'+item);
          treeNode.files.push(item.split('.')[0]);
        }
      }
    });
    callback(treeNode);
  }
  walk(path.join(__dirname, '../doc'), treeNode, function(treeNode) {
    //存入数据库
    treeModel.fetch(function(err,tree){
      if(err){
        console.log(err);
      }
      //console.log(_list);
      if(tree.length<=0){
        _tree = new treeModel({
          tree   :  treeNode
        })
        _tree.save(function(err, tree){
          if(err){
            console.log(err);
          }
          console.log('成功更新目录数据库')
        })
      }else{
        _tree = _.extend(tree[0],{tree:treeNode});
        _tree.save(function(err, tree){
          if(err){
            console.log(err);
          }
          console.log('成功更新目录数据库')
        })
      }
    })
    res.send({
      status: 1,
      tip: '更新目录成功',
      tree:treeNode
    })
  });
});
//api search
router.get('/search', function(req, res, next) {
  console.log(req.query.s);
  bookModel.findByName(req.query.s,function(err,book){
    if(err){
      console.log(err)
    }
    //book = book == [] ? null : book
    res.render('list', {
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
        updata.menu(req.httpPort);
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
                updata.menu(req.httpPort);
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
                updata.menu(req.httpPort);
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
