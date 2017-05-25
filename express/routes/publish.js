var express = require('express');
var router = express.Router();
var fs = require('fs');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

var thumb_gen = require('./thumb_generator.js');

var validate_data = function (data) {
    if (
        data.includes("C") && data.indexOf("C") == data.lastIndexOf("C") &&
        data.includes("X") && data.indexOf("X") == data.lastIndexOf("X") &&
        data.includes("Y") && data.indexOf("Y") == data.lastIndexOf("Y") &&
        data.includes("L") && data.indexOf("L") == data.lastIndexOf("L") &&
        data.includes("E") && data.indexOf("E") == data.lastIndexOf("E")
    ) {
        var coord = data.slice(data.indexOf("L") + 1);
        while (!coord.startsWith("E")) {
            if (
                coord.includes("/") &&
                coord.includes(",") &&
                coord.indexOf(",") < coord.indexOf("/")
            ) {
                var coords = coord.substring(0, coord.indexOf("/"));
                var loc = coords.split(",");
                if (loc[0] != "" && loc[1] != "") {
                    coord = coord.slice(coord.indexOf("/") + 1);
                } else {
                    return false;
                }
            }
        }
        return true;
    } else {
        return false;
    }
}

var convert_svg = function (data) {
    var model = new thumb_gen.Game_Model(300, 300);
    var view = new thumb_gen.Game_View();

    model.view = view;
    view.model = model;

    model.from_string(data);

    return view.draw(model.grid, model.row, model.col);
}

var save_svg = function (svg, game_id) {
    var name = "" + game_id + "_thumb.svg";
    var path = __dirname + '/../public/images/thumbs/';

    fs.writeFile(path + name, svg, function(err) {
        if(err) {
            return console.log(err);
        }
    });
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
                var svg = convert_svg(game_data);
                save_svg(svg, this.lastID);

            } else {
                res.redirect("game.html?publish_result=FAILED");
            }
        }
    );


});

module.exports = router;
