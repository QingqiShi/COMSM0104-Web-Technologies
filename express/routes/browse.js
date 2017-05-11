var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('browse', { title: 'Game of Life - Browse' });
});

module.exports = router;
