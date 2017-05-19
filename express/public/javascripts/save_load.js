var game_pause = function (life) {
    if(life.state == life.RUNNING){
        clearInterval(life.interval);
        life.state = life.STOPPED;
    }
}
// function gridToString(object){
//     var string = "C";
//     //the first value is CELL_SIZE
//     string = string.concat(object.CELL_SIZE.toString());
//     string = string.concat("X");
//     //second is X
//     string = string.concat(object.X.toString());
//     string = string.concat("Y");
//     //third is Y
//     string = string.concat(object.Y.toString());
//     string = string.concat("L");
//     //the remainings are the coordinates of the cells that have state of ALIVE
//     for(var i = 0; i < object.WIDTH; i++) {
//             for(var z = 0; z < object.HEIGHT; z++) {
//                 if(object.grid[z][i]==object.ALIVE){
//                     var xCoord = z;
//                     var yCoord = i;
//                     var tempS = "";
//                     tempS = tempS.concat(xCoord.toString(),",",yCoord.toString());
//                     string = string.concat(tempS);
//                     string = string.concat("/");
//                 }
//             }
//         }
//     string = string.concat("E");
//     return string;
// };
var game_convert = function () {
    return "C8X1600Y800L1,1/1,2/1,3/E";
}

document.addEventListener("DOMContentLoaded", function() {
    var sign_in_btn = document.querySelectorAll(".game_info .sign_in")[0];
    var sign_in_close_btn = document.querySelectorAll(".sign_in_pop_up .close")[0];

    if (sign_in_btn !== null && typeof sign_in_btn != 'undefined') {
        sign_in_btn.addEventListener("click", function(){
            show_class("back_drop");
            show_class("sign_in_pop_up");
        });

        sign_in_close_btn.addEventListener("click", function(){
            hide_class("back_drop");
            hide_class("sign_in_pop_up");
        });
    }

    var publish_btn = document.querySelectorAll(".game_info .publish")[0];
    var publish_close_btn = document.querySelectorAll(".publish_pop_up .close")[0];

    if (publish_btn !== null && typeof publish_btn != 'undefined') {
        publish_btn.addEventListener("click", function(){
            game_pause(Life);
            var data = game_convert();

            var game_data_field = document.getElementById("game_data");
            game_data_field.setAttribute("value", data);

            show_class("back_drop");
            show_class("publish_pop_up");
        });

        publish_close_btn.addEventListener("click", function(){
            hide_class("back_drop");
            hide_class("publish_pop_up");
        });
    }
});
