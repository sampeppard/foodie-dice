var express = require('express');
var router = express.Router();

var debug = require('debug')('server');

router.get('/', function(req, res, next) {
  debug("/ requested");
  res.render('index.html');
});

module.exports = router;
