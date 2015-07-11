var express = require('express');
var router = express.Router();
var fs = require('fs');
/* API Route. */
router.get('/', function(req, res, next) {
  console.log('///////////////////////////')
  var buffStr = fs.readFileSync(path.join(__dirname, '../doc/readme.md'),
    'utf8');
  res.status(200).send(buffStr);
});
/* API updataMenu. */
router.get('/updataMenu', function(req, res, next) {
  var treeNode = {};
  //目录遍历
  function walk(path, treeNode, callback) {
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
        if (item != '.DS_Store' && item != 'readme.md' && item.indexOf(
            '.md') !=
          -1) {
          treeNode.files.push(item.split('.')[0]);
        }
      }
    });
    callback();
  }
  walk(path.join(__dirname, '../doc'), treeNode, function() {
    res.status(200).send({
      status: 1,
      tip: '更新目录成功'
    })
  });
});

module.exports = router;
