const sendHttpRequest1 = (method, url, data) => {
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: data ? { 'Content-Type': 'application/json' } : {}
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


function sendRegisterJSON(){
    let server_message = document.getElementById('register_message');
    let username = document.getElementById('register_username');
    let nickname = document.getElementById('register_nickname');
    let email = document.getElementById('register_email');
    let password = document.getElementById('register_password');

    server_message.style.color='red';
    console.log("Script for register request");
    let url = "http://localhost:8081/routes/auth/login";


    sendHttpRequest1('POST', url, {
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

        })
        .catch(err => {
            console.log(err, err.data);
        });
}
