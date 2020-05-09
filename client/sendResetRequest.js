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
    let email = document.getElementById('fp_email').value;
    //console.log("Script for reset request");
    let url = "http://localhost:8081/auth/reset_password";


    sendHttpRequest('POST', url, {
        "email": email,
    })
        .then(responseData => {
            console.log(responseData);
            alert("Success! Go check your email!");


        })
        .catch(err => {
            console.log(err, err.data);
            alert("Email not valid");
        });
}
