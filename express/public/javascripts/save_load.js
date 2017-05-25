var game_pause = function() {
    game_controller.stop();
}

var game_convert = function() {
    return game_controller.model.to_string();
}

document.addEventListener("DOMContentLoaded", function() {
    var sign_in_btn = document.getElementById("user_sign_in_btn");
    var sign_in_from_game = document.querySelectorAll(".game_info .sign_in")[0];
    var sign_up_btn = document.getElementById("user_sign_up_btn");
    var publish_btn = document.querySelectorAll(".game_info .publish")[0];

    var game_data_field = document.getElementById("game_data");

    var register_pause = function(btn) {
        if (typeof btn != 'undefined' && btn) {
            btn.addEventListener("click", function(){
                game_pause();
            });
        }
    }

    register_pause(sign_in_btn);
    register_pause(sign_in_from_game);
    register_pause(sign_up_btn);
    register_pause(publish_btn);

    if (typeof publish_btn != 'undefined' && publish_btn) {
        publish_btn.addEventListener("click", function(){
            var data = game_convert();
            game_data_field.setAttribute("value", data);
        });
    }
});
