var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var game_id = req.query.game_id;

    var game_data = "";
    if (game_id) {
        db.get("SELECT * FROM Game_States WHERE game_id=?", game_id, function(err, row) {
            if (err === null) {
                game_data = row.game_data;
            }
            if (req.session.user_name) {
                res.render('game', { title: 'Game of Life - Game', game_data, user_name: req.session.user_name });
            } else {
                res.render('game', { title: 'Game of Life - Game', game_data });
            }
        });
    } else {
        if (req.session.user_name) {
            res.render('game', { title: 'Game of Life - Game', game_data, user_name: req.session.user_name });
        } else {
            res.render('game', { title: 'Game of Life - Game', game_data });
        }
    }


});

module.exports = router;
