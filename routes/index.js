var express = require('express');
var router = express.Router();


var fs = require('fs');
var path = require('path');
var mdtools = require('../tools/markDown.js');
var markdown = require('markdown-js');
var _ = require('underscore');

var treeNode={};
//目录遍历
function walk(path, treeNode){
  treeNode.path = path;
  treeNode.subNodes = [];
  treeNode.files = [];
  treeNode.pathName = path.split('/')[path.split('/').length-1];
  var dirList = fs.readdirSync(path);
  dirList.forEach(function(item){

    //console.log(item);
    if(fs.statSync(path + '/' + item).isDirectory()){
      //console.log(0);
      //console.log(path+'/'+item)
      var subNode = {};
      treeNode.subNodes.push(subNode);
      walk(path + '/' + item, subNode);
    }else{
      //console.log(path+'/'+item)
      if(item != '.DS_Store' && item != 'readme.md' && item.indexOf('.md') != -1){
        treeNode.files.push(item);
      }
    }
  });
  console.log(treeNode);
}
walk(path.join(__dirname, '../doc'), treeNode);
/* GET home page. */
router.get('/', function(req, res, next) {
  var buffStr = fs.readFileSync(path.join(__dirname, '../doc/readme.md'), 'utf8');
  var html = markdown.makeHtml(buffStr);
  mdtools.getMenu(html,function(html,menu){
    res.render('index', { title: 'Express',html : html ,menu : menu });
  });
});

module.exports = router;
