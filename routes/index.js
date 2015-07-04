var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var md = require('../tools/markDown.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  var buffStr = fs.readFileSync(path.join(__dirname, '../doc/readme.md'), 'utf8');
  console.log(buffStr);
  //dm.getMenu()
  res.render('index', { title: 'Express',data : buffStr });

});

module.exports = router;
