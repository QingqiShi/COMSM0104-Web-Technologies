var express = require('express');
var router = express.Router();
var fs = require('fs');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var game_id = req.query.game_id;

    if (game_id) {
        db.get("SELECT * FROM Game_States WHERE game_id=?", game_id, function(err, row) {
            if (err !== null) {
                res.redirect("browse.html");
            } else {
                if (row && req.session.user_name && row.user_name == req.session.user_name) {
                    db.run("DELETE FROM Game_States WHERE game_id=?", game_id, function(err) {
                        var path = __dirname + "/../public/images/thumbs/" + game_id + "_thumb.svg";
                        fs.unlink(path, function() {});
                        res.redirect("browse.html");
                    });
                } else {
                    res.redirect("browse.html");
                }
            }
        });
    } else {
        res.redirect("browse.html");
    }


});

module.exports = router;
