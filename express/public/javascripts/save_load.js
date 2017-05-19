var game_pause = function (life) {
    if(life.state == life.RUNNING){
        var controlLinkStart = document.getElementById("start");
        var controlLinkStop = document.getElementById("stop");
        if (controlLinkStart.classList.contains("active")) {
            controlLinkStart.classList.remove("active");
        }
        if (!controlLinkStop.classList.contains("active")) {
            controlLinkStop.classList.add("active");
        }
        clearInterval(life.interval);
        life.state = life.STOPPED;
    }
}

var game_convert = function (life) {
    return gridToString(life);
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
            var data = game_convert(Life);

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
