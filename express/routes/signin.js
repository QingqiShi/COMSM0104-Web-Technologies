var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

var crypto = require('crypto');

/* Post sign in. */
router.post('/', function(req, res, next) {
    var url = encodeURIComponent(req.body.url);
    if (url === null) {
        url = "index.html";
    }
    var user_name = req.body.user_name;
    var password = req.body.password;

    db.get("SELECT * FROM Users WHERE user_name=?", user_name, function(err, row) {
        var result = "";
        if (err !== null) {
            result = "FAILED_ERROR";
        } else if (typeof row == 'undefined') {
            result = "FAILED_NO_USER"
        } else {
            var salt = row.user_salt;
            var hash = crypto.pbkdf2Sync(password, salt, 100000, 512, 'sha512').toString('hex');
            if (hash == row.user_hash) {
                result = "SUCCESS";
            } else {
                result = "FAILED_INCORRECT_PASSWORD";
            }
        }

        res.redirect(url + "?sign_in_result=" + result);
    });

});

module.exports = router;
