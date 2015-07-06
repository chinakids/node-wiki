var express = require('express');
var router = express.Router();


var fs = require('fs');
var path = require('path');
var mdtools = require('../tools/markDown.js');
var markdown = require('marked');
var _ = require('underscore');

var treeNode={};
//目录遍历
function walk(path, treeNode){
  treeNode.path = path;
  treeNode.subNodes = [];
  treeNode.files = [];
  treeNode.pathName = path.split('/')[path.split('/').length - 1];
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
        treeNode.files.push(item.split('.')[0]);
      }
    }
  });
  console.log(treeNode);
}
walk(path.join(__dirname, '../doc'), treeNode);
/* GET home page. */
router.get('/', function(req, res, next) {
  var buffStr = fs.readFileSync(path.join(__dirname, '../doc/readme.md'), 'utf8');
  var html = markdown(buffStr);
  mdtools.getMenu(html,function(html,menu){
    res.render('index', { title: '首页',html : html ,menu : menu ,tree : treeNode ,map : [] });
  });
});
/* GET home page. */
router.get('/doc', function(req, res, next) {
  var md = req.query.md;
  var buffStr = fs.readFileSync(path.join(__dirname, '../doc/'+md+'.md'), 'utf8');
  var html = markdown(buffStr);
  console.log(html);
  mdtools.getMenu(html,function(html,menu){
    console.log(treeNode);
    //res.send('ok')
    res.render('index', { title: md.split('/')[md.split('/').length - 1],html : html ,menu : menu ,tree : treeNode ,map : md.split('/')});
  });
});

module.exports = router;
