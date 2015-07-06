var express = require('express');
var router = express.Router();


var fs = require('fs');
var path = require('path');
var mdtools = require('../tools/markDown.js');
var markdown = require('markdown-js');


/* GET home page. */
router.get('/', function(req, res, next) {
  var buffStr = fs.readFileSync(path.join(__dirname, '../doc/readme.md'), 'utf8');
  var html = markdown.makeHtml(buffStr);
  mdtools.getMenu(html,function(html,menu){
    res.render('index', { title: 'Express',html : html ,menu : menu});
  });
});

module.exports = router;
