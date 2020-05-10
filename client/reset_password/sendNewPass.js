var letter = /[a-zA-Z]/;
var number = /[0-9]/;

var validatePass = function() {
    if (document.getElementById('new_pass').value.length < 6 ){
        document.getElementById('reset_message').style.color = 'red';
        document.getElementById('reset_message').innerHTML = 'Password must be at least 6 characters !';
    }
    else if(!letter.test(document.getElementById('new_pass').value) || !number.test(document.getElementById('new_pass').value))
    {
        document.getElementById('reset_message').style.color = 'red';
        document.getElementById('reset_message').innerHTML = 'Password must contain an uppercase and a number!';
    }
    else{
        if (document.getElementById('new_pass').value === document.getElementById('c_new_pass').value)
        {
            document.getElementById('reset_message').style.color = 'green';
            document.getElementById('reset_message').innerHTML = 'Good to go';
        } else {
            document.getElementById('reset_message').style.color = 'red';
            document.getElementById('reset_message').innerHTML = 'Passwords not matching!';
        }
    }
}


const sendHttpRequest = (method, url, data) => {
    return fetch(url,{
        method: method,
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
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


function sendNewPassword(){
    let server_message = document.getElementById('reset_message');
    let username = document.getElementById('username').value;
    let new_pass = document.getElementById('new_pass').value;

    server_message.style.color='red';
    console.log("Script for sending the new password");
    let url = "http://localhost:8081/auth/reset_password/" + username;


    sendHttpRequest('POST', url, {
        "new_password": new_pass,
        "confirm_new_password": new_pass
    })
    .then(responseData => {
        console.log(responseData);
        window.location.replace( "/login-register");

    })
    .catch(err => {
        console.log(err, err.data);
        document.getElementById('reset_message').innerHTML = 'Username not valid!';
    });
}
