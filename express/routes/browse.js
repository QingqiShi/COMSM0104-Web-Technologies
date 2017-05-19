var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

router.get('/', function(req, res, next) {
    db.all("SELECT * FROM Game_States", function(err, rows) {
        if (err !== null) {
            var result = "DB_ERROR";
            res.redirect("game.html?browse_result=" + result);
        } else {
            if (req.session.user_name) {
                res.render('browse', { title: 'Game of Life - Browse', game_states: rows, user_name: req.session.user_name });
            } else {
                res.render('browse', { title: 'Game of Life - Browse', game_states: rows });
            }
        }
    });
});

module.exports = router;
