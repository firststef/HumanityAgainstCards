const sendHttpRequest = (method, url, data) => {
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


function sendResetRequest(){
    // let server_message = document.getElementById('reset_message');
    let email = document.getElementById('fp_email');

    // server_message.style.color='red';
    console.log("Script for reset request");
    let url = "http://localhost:8081/routes/auth/reset_password";


    sendHttpRequest('POST', url, {
        "email": email.value,
    })
        .then(responseData => {
            console.log(responseData);
            //set cookie
            document.cookie=response.session;
            //redirect to log in
            window.location.replace( "/login-register.html" );

        })
        .catch(err => {
            console.log(err, err.data);
            //display message
            server_message.innerHTML = 'Input not valid!';
        });
}
