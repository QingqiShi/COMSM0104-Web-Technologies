document.addEventListener("DOMContentLoaded", function(event) {
    var sign_up_result = getQueryString("sign_up_result");
    if (sign_up_result !== null) {
        show_class("back_drop");
        switch (sign_up_result) {
            case "USER_NAME_TOO_SHORT":
                show_class("sign_up_pop_up");
                show_class("sign_up_fail");
                document.getElementsByClassName("sign_up_fail")[0].innerHTML = "Sign up failed: username too short (at least 5 characters)";
                break;
            case "PASSWORD_TOO_SHORT":
                show_class("sign_up_pop_up");
                show_class("sign_up_fail");
                document.getElementsByClassName("sign_up_fail")[0].innerHTML = "Sign up failed: password too short (at least 10 characters)";
                break;
            case "FAILED":
                show_class("sign_up_pop_up");
                show_class("sign_up_fail");
                document.getElementsByClassName("sign_up_fail")[0].innerHTML = "Sign up failed: username was chosen";
                break;
            case "SUCCESS":
                show_class("sign_in_pop_up");
                show_class("sign_in_success");
                document.getElementsByClassName("sign_in_success")[0].innerHTML = "Sign up successful, please sign in";
                break;
        }
    }

    var sign_in_result = getQueryString("sign_in_result");
    switch (sign_in_result) {
        case "FAILED_ERROR":
            show_class("back_drop");
            show_class("sign_in_pop_up");
            show_class("sign_in_fail");
            document.getElementsByClassName("sign_in_fail")[0].innerHTML = "Sign in failed: error with databse";
            break;
        case "FAILED_NO_USER":
            show_class("back_drop");
            show_class("sign_in_pop_up");
            show_class("sign_in_fail");
            document.getElementsByClassName("sign_in_fail")[0].innerHTML = "Sign in failed: user doesn't exist";
            break;
        case "FAILED_INCORRECT_PASSWORD":
            show_class("back_drop");
            show_class("sign_in_pop_up");
            show_class("sign_in_fail");
            document.getElementsByClassName("sign_in_fail")[0].innerHTML = "Sign in failed: password wrong";
            break;
        case "SUCCESS":
            break;
    }

    var sign_in_btn = document.getElementById("user_sign_in_btn");
    var sign_in_close_btn = document.querySelectorAll(".sign_in_pop_up .close")[0];

    sign_in_btn.addEventListener("click", function(){
        show_class("back_drop");
        show_class("sign_in_pop_up");
    });

    sign_in_close_btn.addEventListener("click", function(){
        hide_class("back_drop");
        hide_class("sign_in_pop_up");
    });


    var sign_up_btn = document.getElementById("user_sign_up_btn");
    var sign_up_close_btn = document.querySelectorAll(".sign_up_pop_up .close")[0];

    sign_up_btn.addEventListener("click", function(){
        show_class("back_drop");
        show_class("sign_up_pop_up");
    });

    sign_up_close_btn.addEventListener("click", function(){
        hide_class("back_drop");
        hide_class("sign_up_pop_up");
    });

    var sign_up_from_sign_in = document.querySelectorAll(".sign_up_message a")[0];

    sign_up_from_sign_in.addEventListener("click", function() {
        hide_class("back_drop");
        hide_class("sign_in_pop_up");
        show_class("back_drop");
        show_class("sign_up_pop_up");
    });
});

var hide_class = function(class_name) {
    var back_drop = document.getElementsByClassName(class_name)[0];
    if (!back_drop.classList.contains("hide")) {
        back_drop.classList.add("hide");
    }
}

var show_class = function(class_name) {
    var back_drop = document.getElementsByClassName(class_name)[0];
    if (back_drop.classList.contains("hide")) {
        back_drop.classList.remove("hide");
    }
}

/**
* Credit: GoMakeThings.com
* Get the value of a querystring
* @param  {String} field The field to get the value of
* @param  {String} url   The URL to get the value from (optional)
* @return {String}       The field value
*/
var getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
};
