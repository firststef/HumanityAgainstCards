const sendHttpRequest2 = (method, url, data) => {
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


function sendLoginJSON(){
    let server_message = document.getElementById('login_message');
    let email = document.getElementById('login_email');
    let password = document.getElementById('login_password');

    server_message.style.color='red';
    console.log("Script for login request");
    let url = "http://localhost:8081/routes/auth/login";


    sendHttpRequest2('POST', url, {
        "username": email.value,
        "password": password.value
    })
        .then(responseData => {
            console.log(responseData);
            //set cookie
            document.cookie=response.session;
            //redirect to account page
            window.location.replace( "auth/client_after_auth/account.html" );

        })
        .catch(err => {
            console.log(err, err.data);
            //display message
            server_message.innerHTML = 'Input not valid!';
        });
}
