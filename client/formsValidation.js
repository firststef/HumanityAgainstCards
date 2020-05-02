const usernameL = document.getElementById('usernameL')
const usernameR = document.getElementById('usernameR')
const nickname = document.getElementById('nickname')
const emailR = document.getElementById('emailR')
const passwordL = document.getElementById('passwordL')
const passwordR = document.getElementById('passwordR')
const conf_password = document.getElementById('conf_password')
const formR = document.getElementById('register_form')
const formL = document.getElementById('login_form')


function validateLogin() {

    if( usernameL.value === "" ) {
        alert( "Please provide your username!" );
        usernameL.focus() ;
        return false;
    }
    if( passwordL.value === "" ) {
        alert( "Please provide your Email!" );
        passwordL.focus() ;
        return false;
    }
    return true;
}


function validateRegister() {

    if( usernameR.value === "" ) {
        alert( "Please provide your username!" );
        usernameR.focus() ;
        return false;
    }
    if( nickname.value === "" ) {
        alert( "Please provide your nickname!" );
        nickname.focus() ;
        return false;
    }
    if(emailR.value === "" ) {
        alert( "Please provide your email!" );
        emailR.focus() ;
        return false;
    }
    if( passwordR.value === "" ) {
        alert( "Please enter a password!" );
        passwordR.focus() ;
        return false;
    }
    if( conf_password.value === "" ) {
        alert( "Confirm your password!" );
        conf_password.focus() ;
        return false;
    }

    if( conf_password.value !== passwordR.value  ) {
        alert( "Passwords don't match!" );
        passwordR.focus() ;
        conf_password.focus() ;
        return false;
    }

    return true;
}