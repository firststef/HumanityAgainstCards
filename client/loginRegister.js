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
            server_message.style.color = 'green';
            //Display message
            server_message.innerHTML = 'Success! Go activate your account!';
            //Show link to activation page
            document.getElementById('account_activation').style.display = 'block';
        }).catch(err => {
                console.log(err);
                server_message.innerHTML = 'User already register!';
            });
}

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
            //redirect to account page
            window.location = "/account";
        }).catch(err => {
            console.log(err);
            //display message
            server_message.innerHTML = 'Input not valid!';
        });
}

function sendResetRequest() {
    let email = document.getElementById('fp_email');

    console.log("Script for reset request");
    let url = "http://localhost:8081/auth/reset_password";


    sendHttpRequest('POST', url, {
        "email": email.value,
    })
        .then(responseData => {
            console.log(responseData);
            alert("Reset email send! Check email!")
        })
        .catch(err => {
            console.log(err, err.data);
            alert("Email not valid!");
        });
}

var lowLetter = /[a-z]/
var upperLetter=/[A-Z]/;
var number = /[0-9]/;

function check() {
    if (document.getElementById('register_password').value.length < 6) {
        document.getElementById('register_message').style.color = 'red';
        document.getElementById('register_message').innerHTML = 'Password must be at least 5 characters !';
    } else if (!upperLetter.test(document.getElementById('register_password').value) || !lowLetter.test(document.getElementById('register_password').value) || !number.test(document.getElementById('register_password').value)) {
        document.getElementById('register_message').style.color = 'red';
        document.getElementById('register_message').innerHTML = 'Password must contain an uppercase and a number!';
    } else {
        if (document.getElementById('register_password').value === document.getElementById('register_cpassword').value) {
            document.getElementById('register_message').style.color = 'green';
            document.getElementById('register_message').innerHTML = 'Good to go';
        } else {
            document.getElementById('register_message').style.color = 'red';
            document.getElementById('register_message').innerHTML = 'Passwords not matching!';
        }
    }
}