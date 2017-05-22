var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

var validate_data = function (data) {
    return true;
}

var convert_svg = function (data) {
    return "";
}

var save_svg = function (svg, game_id) {
    // Name convention: game_id_thumb.svg
    // Path: path.join(__dirname, 'public/images/')
}

var Game_Model = function() {

}

/* Post sign in. */
router.post('/', function(req, res, next) {
    if (!req.session.user_name) {
        res.redirect("game.html?publish_result=NOT_SIGNED_IN");
        return;
    }

    var pubblish_title = req.body.publish_title;
    if (!pubblish_title) {
        res.redirect("game.html?publish_result=EMPTY_TITLE");
        return;
    }

    var publish_description = req.body.publish_description;
    if (!pubblish_title) {
        res.redirect("game.html?publish_result=EMPTY_DESCRIPTION");
        return;
    }

    var game_data = req.body.game_data;
    if (!game_data || !validate_data(game_data)) {
        res.redirect("game.html?publish_result=DATA_INVALID");
        return;
    }

    var d = new Date();
    var date = d.getTime();

    db.run(
        "INSERT INTO Game_States (user_name, game_name, game_desc, game_data, game_date) VALUES (?, ?, ?, ?, ?)",
        req.session.user_name, pubblish_title, publish_description, game_data, date,
        function(err) {
            if (err === null) {
                res.redirect("game.html?game_id=" + this.lastID);

                // Convert to svg and save, with game_id = this.lastID
                
            } else {
                res.redirect("game.html?publish_result=FAILED");
            }
        }
    );


});

module.exports = router;
