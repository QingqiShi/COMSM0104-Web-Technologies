var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('data.db');

/* GET home page. */
router.get('/', function(req, res, next) {
  var url = encodeURIComponent(req.query.url);
  res.redirect(url);
});

module.exports = router;
