var express = require('express');
var router = express.Router();

/* API Route. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
