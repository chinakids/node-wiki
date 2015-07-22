var treeModel = require('../models/tree');
var bookModel = require('../models/book');
var fs = require('fs');
var _ = require('underscore');
var path = require('path');

var updata = {
  menu : function(port){
    //console.log(port);
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
      //console.log(path);
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
    });
  }
}

module.exports = updata;