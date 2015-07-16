var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('underscore');
var path = require('path');

var treeModel = require('../models/tree');
/* API Route. */
router.get('/', function(req, res, next) {
  //console.log('///////////////////////////')
  res.status(200).send('api状态正常');
});
/* API updataMenu. */
router.get('/updataMenu', function(req, res, next) {
  var treeNode = {};
  //目录遍历
  function walk(path, treeNode, callback) {
    var callback = callback || function(){};
    treeNode.path = path;
    treeNode.subNodes = [];
    treeNode.files = [];
    treeNode.filesMd5 = '';
    treeNode.pathName = path.split('/')[path.split('/').length - 1];
    //console.log(treeNode.pathName);
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
      //console.log(treeNode)
      _tree = _.extend(tree[0],{tree:treeNode});
      //console.log(_list);
      if(tree.length<=0){
        _tree = new menuModel({
          tree   :  treeNode
        })
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

module.exports = router;
