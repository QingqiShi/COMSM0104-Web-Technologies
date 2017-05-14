document.addEventListener("DOMContentLoaded", function(event) {
    var sign_in_btn = document.getElementsByClassName("user")[0];

    sign_in_btn.addEventListener("click", function(){
        var pop_up = document.getElementsByClassName("back_drop")[0];
        if ( pop_up.classList.contains("hide") ) {
            pop_up.classList.remove("hide");
        }
    });

    var close_btn = document.getElementsByClassName("close")[0];
    close_btn.addEventListener("click", function(){
        var pop_up = document.getElementsByClassName("back_drop")[0];
        if ( !pop_up.classList.contains("hide") ) {
            pop_up.classList.add("hide");
        }
    });
});
