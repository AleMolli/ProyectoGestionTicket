
//(function ($) {
   // "use strict";

    // Spinner
    /*var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();*/

    // Sidebar Toggler
   // $('.sidebar-toggler').click(function () {
       // $('.sidebar, .content').toggleClass("open");
        //return false;
    //});

//})

function verificarUsuario(){
    const token = getToken();
    const email = getEmail(); // suponiendo que guardaste el email al hacer login
   
    $("#NombredeUsuario").text(email);

    if (!token) {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        window.location.href = "login.html";
        return;
    }
} 