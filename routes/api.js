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
/* API Search. */
router.get('/search', function(req, res, next) {

});

module.exports = router;
