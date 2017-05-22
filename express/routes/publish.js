var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

var validate_data = function (data) {
    if(data.includes("C")&&data.indexOf("C")==data.lastIndexOf("C")){
        if(data.includes("X")&&data.indexOf("X")==data.lastIndexOf("X")){
            if(data.includes("Y")&&data.indexOf("Y")==data.lastIndexOf("Y")){
                if(data.includes("L")&&data.indexOf("L")==data.lastIndexOf("L")){
                    if(data.includes("E")&&data.indexOf("E")==data.lastIndexOf("E")){
                        var coord = data.slice(data.indexOf("L") + 1);
                        while (!coord.startsWith("E")) {
                            if(coord.includes("/")&&coord.includes(",")&&coord.indexOf(",")<coord.indexOf("/")){
                                var coords = coord.substring(0, coord.indexOf("/"));
                                var loc = coords.split(",");
                                if(loc[0]!=""&&loc[1]!=""){
                                    coord = coord.slice(coord.indexOf("/")+1);
                                }else{
                                    return false;
                                }
                            }
                        }
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

var convert_svg = function (data) {
    var game_model = new Game_Model(300, 300);
    var svgSize = 500;
    var range = 20;
    var svg_thumb = "<svg width=\""+svgSize.toString()+"\" height=\""+svgSize.toString()+"\"><rect x=\"0\" y=\"0\" width=\"500\" height=\"500\" opacity=\"1\" fill=\"#f6f6f6\" stroke=\"none\"></rect>";
    game_model.from_string(data);
    var cellSize = (svgSize-1)/range-1;
    for(var h = game_model.row/2-range/2; h < game_model.row/2+range/2; h++){
        for(var w = game_model.column/2-range/2; h < game_model.column/2+range/2; w++){
            var x = (h-(game_model.row/2-range/2))*cellSize+1;
            var y = (w-(game_model.col/2-range/2))*cellSize+1;
                if(game_model.grid[h][w]==ALIVE){
                    //draw black block
                    svg_thumb = svg_thumb.concat("<rect x=\""+x.toString()+"\" y=\""+y.toString()+"\" width=\""+cellSize.toString()+"\" height=\""+cellSize.toString()+"\" opacity=\"1\" fill=\"#555\" stroke=\"none\"></rect>")

                }else{
                    //draw white block
                    svg_thumb = svg_thumb.concat("<rect x=\""+x.toString()+"\" y=\""+y.toString()+"\" width=\"1\" height=\"1\" opacity=\"1\" fill=\"#fff\" stroke=\"none\"></rect>")
                }
        }
    }
    svg_thumb = svg_thumb.concat("</svg>");
    return svg_thumb;
}

var save_svg = function (svg, game_id) {
    // Name convention: game_id_thumb.svg
    // Path: path.join(__dirname, 'public/images/')
}

var Game_Model = function(row, col) {
    this.row = row;
    this.col = col;

    // Current grid data
    this.grid = [];
    for (var i = 0; i < row; i++) {
        this.grid[i] = [];
        for (var j = 0; j < col; j++) {
            this.grid[i][j] = DEAD;
        }
    }

    this.from_string = function(str) {
        var useless_x = parseInt(str.substring(str.indexOf("X")+1,str.indexOf("Y")));
        var useless_y = parseInt(str.substring(str.indexOf("Y")+1,str.indexOf("L")));

        var coord = str.slice(str.indexOf("L") + 1);

        while (!coord.startsWith("E")) {
            var coords = coord.substring(0, coord.indexOf("/"));
            var loc = coords.split(",");
            this.grid[parseInt(loc[0])][parseInt(loc[1])] = ALIVE;
            coord = coord.slice(coord.indexOf("/")+1);
        }
    };
};

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
