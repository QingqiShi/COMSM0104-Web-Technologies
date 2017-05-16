var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('data.db');

/* Post sign in. */
router.post('/', function(req, res, next) {
    var url = encodeURIComponent(req.body.url);
    console.log(url);
    res.redirect(url);
});

module.exports = router;
