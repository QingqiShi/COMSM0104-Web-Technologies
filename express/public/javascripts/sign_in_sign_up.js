var save_local = function() {
    game_controller.model.save_local();
};

document.addEventListener("DOMContentLoaded", function(event) {
    AOS.init({
        duration: 300,
    });

    /* pop_up back drop */
    var back_drop = document.getElementsByClassName("back_drop")[0];

    /* Sign up elements */
    var sign_up_result = getQueryString("sign_up_result");
    var sign_up_btn = document.getElementById("user_sign_up_btn");
    var sign_up_from_sign_in = document.querySelectorAll(".sign_up_message a")[0];
    var sign_up_pane = document.getElementsByClassName("sign_up_pop_up")[0];
    var sign_up_form = document.querySelectorAll(".sign_up_pop_up form")[0];
    var sign_up_fail_pane = document.getElementsByClassName("sign_up_fail")[0];
    var sign_up_close_btn = document.querySelectorAll(".sign_up_pop_up .close")[0];
    var sign_up_user_name = document.getElementById("sign_up_user_name");
    var sign_up_password = document.getElementById("sign_up_password");
    var repeat_password = document.getElementById("repeat_password");
    var sign_up_submit = document.querySelectorAll(".sign_up_pop_up .btn")[0];

    /* Sign in elements */
    var sign_in_result = getQueryString("sign_in_result");
    var sign_in_btn = document.getElementById("user_sign_in_btn");
    var sign_in_from_game = document.querySelectorAll(".game_info .sign_in")[0];
    var sign_in_pane = document.getElementsByClassName("sign_in_pop_up")[0];
    var sign_in_form = document.querySelectorAll(".sign_in_pop_up form")[0];
    var sign_in_success_pane = document.getElementsByClassName("sign_in_success")[0];
    var sign_in_fail_pane = document.getElementsByClassName("sign_in_fail")[0];
    var sign_in_close_btn = document.querySelectorAll(".sign_in_pop_up .close")[0];
    var sign_in_user_name = document.getElementById("sign_in_user_name");
    var sign_in_password = document.getElementById("sign_in_password");
    var sign_in_submit = document.querySelectorAll(".sign_in_pop_up .btn")[0];

    /* Publish elements */
    var publish_result = getQueryString("publish_result");
    var publish_pane = document.getElementsByClassName("publish_pop_up")[0];
    var publish_btn = document.querySelectorAll(".game_info .publish")[0];
    var publish_close_btn = document.querySelectorAll(".publish_pop_up .close")[0];
    var publish_form = document.querySelectorAll(".publish_pop_up form")[0];
    var publish_fail_pane = document.getElementsByClassName("publish_fail")[0];
    var publish_title = document.getElementById("publish_title");
    var publish_description = document.getElementById("publish_description");
    var publish_submit = document.querySelectorAll(".publish_pop_up .btn")[0];

    /* Delete elements */
    var delete_pane = document.getElementsByClassName("delete_pop_up")[0];
    var delete_close_btn = document.querySelectorAll(".delete_pop_up .close")[0];
    var delete_form = document.querySelectorAll(".delete_pop_up form")[0];
    var delete_submit = document.querySelectorAll(".delete_pop_up .btn")[0];
    var delete_game_id = document.getElementById("game_id");
    var delete_btns = document.querySelectorAll(".game_card .delete");


    /* Show and hide elements */
    var show_element = function(element) {
        if (element.classList.contains("hide")) {
            element.classList.remove("hide");
        }
    };

    var hide_element = function(element) {
        if (!element.classList.contains("hide")) {
            element.classList.add("hide");
        }
    };


    /* Initialise panes */
    var initialise_pane = function(open_btn, close_btn, pane) {
        if (open_btn) {
            open_btn.addEventListener("click", function() {
                show_element(back_drop);
                show_element(pane);
            });
        }

        if (close_btn) {
            close_btn.addEventListener("click", function() {
                hide_element(back_drop);
                hide_element(pane);
            });
        }
    };


    /* Show message */
    var show_message = function(message_pane, message) {
        show_element(message_pane);
        message_pane.innerHTML = message;
    };


    /* Validate functions */
    var validate_sign_up = function() {
        if (sign_up_user_name.value.length < 5) {
            show_message(sign_up_fail_pane, "Username too short (at least 5 characters)");
            return false;
        } else if (sign_up_password.value.length < 10) {
            show_message(sign_up_fail_pane, "Password too short (at least 10 characters)");
            return false;
        } else if (repeat_password.value != sign_up_password.value) {
            show_message(sign_up_fail_pane, "Repeated password not the same");
            return false;
        } else {
            hide_element(sign_up_fail_pane);
            return true;
        }
    };

    var validate_sign_in = function() {
        if (sign_in_user_name.value.length < 1) {
            show_message(sign_in_fail_pane, "Username can't be empty");
            return false;
        } else if (sign_in_password.value.length < 1) {
            show_message(sign_in_fail_pane, "Password can't be empty");
            return false;
        } else {
            hide_element(sign_in_fail_pane);
            return true;
        }
    };

    var validate_publish = function() {
        if (publish_title.value.length < 1) {
            show_message(publish_fail_pane, "Title can't be empty");
            return false;
        } else if (publish_description.value.length < 1) {
            show_message(publish_fail_pane, "Description can't be empty");
            return false;
        } else {
            hide_element(publish_fail_pane);
            return true;
        }
    };


    /* Submit behaviour */
    var submit_behaviour = function(form, validator) {
        if (typeof game_controller != 'undefined' && game_controller) {
            save_local();
        }

        if (!validator || validator()) {
            form.submit();
        }
    }


    /* Initialise submit buttons */
    var initialise_submit = function(btn, form, validator) {
        if (btn) {
            btn.addEventListener("click", function() {
                submit_behaviour(form, validator);
            });
        }
    };


    /* Register input validations */
    var register_input_validation = function(input, validator) {
        if (input) {
            input.addEventListener("input", function() {
                validator();
            });
        }
    };


    /* Register enter submit */
    var register_enter = function(input, form, validator) {
        if (input) {
            input.addEventListener("keypress", function(event) {
                keynum = event.keyCode || event.which;

                if (keynum == 13) {
                    submit_behaviour(form, validator);
                }
            });
        }
    };


    /* Panes */
    var assign_id = function(btn) {
        btn.addEventListener("click", function() {
            delete_game_id.value = btn.id;
        });
    }
    initialise_pane(sign_up_btn, sign_up_close_btn, sign_up_pane);
    initialise_pane(sign_in_btn, sign_in_close_btn, sign_in_pane);
    initialise_pane(sign_in_from_game,  null, sign_in_pane);
    initialise_pane(publish_btn, publish_close_btn, publish_pane);
    initialise_pane(null, sign_up_from_sign_in, sign_in_pane);
    initialise_pane(sign_up_from_sign_in, null, sign_up_pane);
    initialise_pane(null, delete_close_btn, delete_pane);
    for (var i = 0; i < delete_btns.length; i++) {
        initialise_pane(delete_btns[i], null, delete_pane);
        assign_id(delete_btns[i]);
    }



    /* Submits */
    initialise_submit(sign_up_submit, sign_up_form, validate_sign_up);
    initialise_submit(sign_in_submit, sign_in_form, validate_sign_in);
    initialise_submit(publish_submit, publish_form, validate_publish);
    initialise_submit(delete_submit, delete_form, null);


    /* Inputs */
    register_input_validation(sign_up_user_name, validate_sign_up);
    register_input_validation(sign_up_password, validate_sign_up);
    register_input_validation(repeat_password, validate_sign_up);
    register_input_validation(sign_in_user_name, validate_sign_in);
    register_input_validation(sign_in_password, validate_sign_in);
    register_input_validation(publish_title, validate_publish);
    register_input_validation(publish_description, validate_publish);


    /* Enter events */
    register_enter(sign_up_user_name, sign_up_form, validate_sign_up);
    register_enter(sign_up_password, sign_up_form, validate_sign_up);
    register_enter(repeat_password, sign_up_form, validate_sign_up);
    register_enter(sign_in_user_name, sign_in_form, validate_sign_in);
    register_enter(sign_in_password, sign_in_form, validate_sign_in);
    register_enter(publish_title, publish_form, validate_publish);
    register_enter(publish_description, publish_form, validate_publish);


    /* Database errors */
    if (sign_up_result) {
        show_element(back_drop);

        switch (sign_up_result) {
            case "USER_NAME_TOO_SHORT":
                show_element(sign_up_pane);
                show_element(sign_up_fail_pane);
                sign_up_fail_pane.innerHTML = "Sign up failed: username too short (at least 5 characters)";
                break;
            case "PASSWORD_TOO_SHORT":
                show_element(sign_up_pane);
                show_element(sign_up_fail_pane);
                sign_up_fail_pane.innerHTML = "Sign up failed: password too short (at least 10 characters)";
                break;
            case "FAILED":
                show_element(sign_up_pane);
                show_element(sign_up_fail_pane);
                sign_up_fail_pane.innerHTML = "Sign up failed: username was chosen";
                break;
            case "SUCCESS":
                show_element(sign_in_pane);
                show_element(sign_in_success_pane);
                sign_in_success_pane.innerHTML = "Sign up successful, please sign in";
                break;
        }
    }

    if (sign_in_result) {
        switch (sign_in_result) {
            case "FAILED_ERROR":
                show_element(back_drop);
                show_element(sign_in_pane);
                show_element(sign_in_fail_pane);
                sign_in_fail_pane.innerHTML = "Sign in failed: error with databse";
                break;
            case "FAILED_NO_USER":
                show_element(back_drop);
                show_element(sign_in_pane);
                show_element(sign_in_fail_pane);
                sign_in_fail_pane.innerHTML = "Sign in failed: user doesn't exist";
                break;
            case "FAILED_INCORRECT_PASSWORD":
                show_element(back_drop);
                show_element(sign_in_pane);
                show_element(sign_in_fail_pane);
                sign_in_fail_pane.innerHTML = "Sign in failed: password wrong";
                break;
            case "SUCCESS":
                break;
        }
    }

    if (publish_result) {
        show_element(back_drop);

        switch (publish_result) {
            case "EMPTY_TITLE":
                show_element(publish_pane);
                show_element(publish_fail_pane);
                publish_fail_pane.innerHTML = "Publish failed: title cannot be empty";
                break;
            case "EMPTY_DESCRIPTION":
                show_element(publish_pane);
                show_element(publish_fail_pane);
                publish_fail_pane.innerHTML = "Publish failed: description must not be empty";
                break;
            case "DATA_INVALID":
                show_element(publish_pane);
                show_element(publish_fail_pane);
                publish_fail_pane.innerHTML = "Publish failed: invalid game data";
                break;
            case "FAILED":
                show_element(publish_pane);
                show_element(publish_fail_pane);
                publish_fail_pane.innerHTML = "Publish failed: database error";
                break;
            case "SUCCESS":
                hide_element(back_drop);
                break;
        }
    }

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
