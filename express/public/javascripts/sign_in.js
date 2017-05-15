document.addEventListener("DOMContentLoaded", function(event) {
    var sign_in_btn = document.getElementById("user_sign_in_btn");
    var sign_in_close_btn = document.querySelectorAll(".sign_in_pop_up .close")[0];

    sign_in_btn.addEventListener("click", function(){
        var back_drop = document.getElementsByClassName("back_drop")[0];
        if (back_drop.classList.contains("hide")) {
            back_drop.classList.remove("hide");
        }

        var pop_up = document.getElementsByClassName("sign_in_pop_up")[0];
        if (pop_up.classList.contains("hide")) {
            pop_up.classList.remove("hide");
        }
    });

    sign_in_close_btn.addEventListener("click", function(){
        var back_drop = document.getElementsByClassName("back_drop")[0];
        if (!back_drop.classList.contains("hide")) {
            back_drop.classList.add("hide");
        }

        var pop_up = document.getElementsByClassName("sign_in_pop_up")[0];
        if (!pop_up.classList.contains("hide")) {
            pop_up.classList.add("hide");
        }
    });


    var sign_up_btn = document.getElementById("user_sign_up_btn");
    var sign_up_close_btn = document.querySelectorAll(".sign_up_pop_up .close")[0];

    sign_up_btn.addEventListener("click", function(){
        var back_drop = document.getElementsByClassName("back_drop")[0];
        if (back_drop.classList.contains("hide")) {
            back_drop.classList.remove("hide");
        }

        var pop_up = document.getElementsByClassName("sign_up_pop_up")[0];
        if (pop_up.classList.contains("hide")) {
            pop_up.classList.remove("hide");
        }
    });

    sign_up_close_btn.addEventListener("click", function(){
        var back_drop = document.getElementsByClassName("back_drop")[0];
        if (!back_drop.classList.contains("hide")) {
            back_drop.classList.add("hide");
        }

        var pop_up = document.getElementsByClassName("sign_up_pop_up")[0];
        if (!pop_up.classList.contains("hide")) {
            pop_up.classList.add("hide");
        }
    });
});
