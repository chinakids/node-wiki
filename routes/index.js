var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var mdtools = require('../tools/markDown.js');
var _ = require('underscore');



var treeNode = {};
//目录遍历
function walk(path, treeNode) {
  treeNode.path = path;
  treeNode.subNodes = [];
  treeNode.files = [];
  treeNode.pathName = path.split('/')[path.split('/').length - 1];
  var dirList = fs.readdirSync(path);
  dirList.forEach(function(item) {
    if (fs.statSync(path + '/' + item).isDirectory()) {
      var subNode = {};
      treeNode.subNodes.push(subNode);
      walk(path + '/' + item, subNode);
    } else {
      if (item != '.DS_Store' && item != 'readme.md' && item.indexOf('.md') !=
        -1) {
        treeNode.files.push(item.split('.')[0]);
      }
    }
  });
}
walk(path.join(__dirname, '../doc'), treeNode);
/* GET home page. */
router.get('/', function(req, res, next) {
  var buffStr = fs.readFileSync(path.join(__dirname, '../doc/readme.md'),
    'utf8');
  mdtools.toHtml(buffStr, function(html, menu) {
    res.render('index', {
      title: 'Wiki 文档中心',
      html: html,
      menu: menu,
      tree: treeNode,
      map: []
    });
  });
});
/* GET home page. */
router.get('/book', function(req, res, next) {
  var md = req.query.md;
  var buffStr = fs.readFileSync(path.join(__dirname, '../doc/' + md + '.md'),
    'utf8');
  mdtools.toHtml(buffStr, function(html, menu) {
    res.render('index', {
      title: md.split('/')[md.split('/').length - 1],
      html: html,
      menu: menu,
      tree: treeNode,
      map: md.split('/')
    });
  });
});

module.exports = router;
