/**
 * Function used to make a HTTP request to a given URL and method using fetch
 */
const sendHttpRequest = (method, url, data) => {
    return fetch(url, {
        method: method,
        cache: 'no-cache',
        headers: data ? {'Content-Type': 'application/json'} : {},
        body: JSON.stringify(data)
    }).then(response => {
        if (response.status >= 400) {
            // !response.ok
            return response.json().then(errResData => {
                const error = new Error('Something went wrong!');
                error.data = errResData;
                throw error;
            });
        }
        return response.json();
    });
};


/**
 * Function that makes a POST request to the server
 * transmitting the user input for creating a new account
 */
function sendRegisterJSON() {
    let server_message = document.getElementById('register_message');
    let username = document.getElementById('register_username');
    let nickname = document.getElementById('register_nickname');
    let email = document.getElementById('register_email');
    let password = document.getElementById('register_password');

    server_message.innerHTML='';
    server_message.style.color = 'red';
    console.log("Script for register request");
    let url = "http://localhost:8081/auth/register";

    sendHttpRequest('POST', url, {
        "username": username.value,
        "password": password.value,
        "email": email.value,
        "nickname": nickname.value
    })
        .then(responseData => {
            console.log(responseData);
            server_message.style.color = '#7CFC00';
            server_message.innerHTML='SUCCESS!';
            //Show link to activation page
            document.getElementById('account_activation').style.display = 'block';
        }).catch(err => {
                console.log(err);
                server_message.innerHTML = 'User already register!';
            });
}

/**
 * Function that makes a POST request to the server
 * transmitting the user input for login process
 */
function sendLoginJSON() {
    let server_message = document.getElementById('login_message');
    let username = document.getElementById('login_username');
    let password = document.getElementById('login_password');

    server_message.style.color = 'red';
    console.log("Script for login request");
    let url = "http://localhost:8081/auth/login";

    sendHttpRequest('POST', url, {
        "username": username.value,
        "password": password.value
    }).then(responseData => {
            console.log(responseData);
            //set cookie
            document.cookie = "HAC_SID=" + responseData.session;
             localStorage.removeItem('HACPlayerName');
             localStorage.setItem("user_profile", JSON.stringify(responseData.user));
            //redirect to account page
            window.location = "/account";
        }).catch(err => {
            console.log(err);
            //display message
            server_message.innerHTML = 'Input not valid!';
        });
}



/**
 * Function that makes a POST request to the server
 * transmitting a reset password request
 */
function sendResetRequest() {
    let email = document.getElementById('fp_email');

    console.log("Script for reset request");
    let url = "http://localhost:8081/auth/reset_password";


    sendHttpRequest('POST', url, {
        "email": email.value,
    })
        .then(responseData => {
            console.log(responseData);
            alert("HumanityAgainstCards : Reset email send! Check email!");
        })
        .catch(err => {
            console.log(err, err.data);
            alert("HumanityAgainstCards : Email not valid!");
        });
}

var lowLetter = /[a-z]/
var upperLetter=/[A-Z]/;
var number = /[0-9]/;

/**
 * Function that verifies if the user password input
 * is valid(has at least 6 characters, contains a number,an uppercase letter and a lowercase letter)
 * and if the password and password confirmation input match
 */
function check() {
    if (document.getElementById('register_password').value.length < 6) {
        document.getElementById('register_message').style.color = 'red';
        document.getElementById('register_message').innerHTML = 'Password must be at least 5 characters !';
    } else if (!upperLetter.test(document.getElementById('register_password').value) || !lowLetter.test(document.getElementById('register_password').value) || !number.test(document.getElementById('register_password').value)) {
        document.getElementById('register_message').style.color = 'red';
        document.getElementById('register_message').innerHTML = 'Password must contain an uppercase and a number!';
    } else {
        if (document.getElementById('register_password').value === document.getElementById('register_cpassword').value) {
            document.getElementById('register_message').style.color = '#7CFC00';
            document.getElementById('register_message').innerHTML = 'GOOD TO GO!';
        } else {
            document.getElementById('register_message').style.color = 'red';
            document.getElementById('register_message').innerHTML = 'Passwords not matching!';
        }
    }
}