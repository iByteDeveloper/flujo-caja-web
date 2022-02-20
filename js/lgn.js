var $btnLogin;
var $txtUser;
var $txtPass;

function bindControlsLogin() {
    $btnLogin = document.querySelector('#btnLogin');
    $txtUser = document.querySelector('#txtUser');
    $txtPass = document.querySelector('#txtPass');

    $btnLogin.addEventListener('click', () => {
        alert(`${txtUser.value}`)
    });
}