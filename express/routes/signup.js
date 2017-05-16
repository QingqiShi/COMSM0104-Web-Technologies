var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

var crypto = require('crypto');

/* POST sign up. */
router.post('/', function(req, res, next) {
    var url = encodeURIComponent(req.body.url);
    if (url === null) {
        url = "index.html";
    }
    var user_name = req.body.user_name;
    var password = req.body.password;

    var result = "";
    if (user_name.length < 5) {
        result = "USER_NAME_TOO_SHORT";
        res.redirect(url + "?sign_up_result=" + result);
    } else if (password.length < 10) {
        result = "PASSWORD_TOO_SHORT";
        res.redirect(url + "?sign_up_result=" + result);
    } else {
        var salt = crypto.randomBytes(128).toString('base64').slice(0, 16);
        var hash = crypto.pbkdf2Sync(password, salt, 100000, 512, 'sha512').toString('hex');

        db.run("INSERT INTO Users (user_name, user_hash, user_salt) VALUES (?, ?, ?)", user_name, hash, salt, function(err) {
            var result = "";
            if (err === null) {
                result = "SUCCESS";
            } else {
                result = "FAILED";
            }

            res.redirect(url + "?sign_up_result=" + result);
        });
    }


});

module.exports = router;
