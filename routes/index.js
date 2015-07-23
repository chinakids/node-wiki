var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var mdtools = require('../tools/markDown.js');
var render = require('../tools/render')

/* GET home page. */
router.get('/', function(req, res, next) {
  var buffStr = fs.readFileSync(path.join(__dirname, '../doc/readme.md'),
    'utf8');
  mdtools.toHtml(buffStr, function(html, menu) {
    render.index(res,{
      title: 'Wiki 文档中心',
      html: html,
      menu: menu,
      tree: req.tree,
      map: [],
      loginInfo:req.loginInfo
    })
    // res.render('index', {
    //   title: 'Wiki 文档中心',
    //   html: html,
    //   menu: menu,
    //   tree: req.tree,
    //   map: [],
    //   loginInfo:req.loginInfo
    // });
  });
});
/* GET home page. */
router.get('/book', function(req, res, next) {
  console.log('/////////')
  console.log(req.loginInfo);
  var md = req.query.md;
  var buffStr = fs.readFileSync(path.join(__dirname, '../doc/' + md + '.md'),
    'utf8');
  mdtools.toHtml(buffStr, function(html, menu) {
    render.index(res,{
      title: md.split('/')[md.split('/').length - 1],
      html: html,
      menu: menu,
      tree: req.tree,
      map: md.split('/'),
      loginInfo:req.loginInfo,
      download:req.query.md
    });
  });
});
//下载
router.get('/download', function(req, res, next) {
  var md = req.query.md;
  res.download(path.join(__dirname, '../doc/' + md + '.md'),md.split('/')[md.split('/').length -1]+'.md');
});

module.exports = router;
