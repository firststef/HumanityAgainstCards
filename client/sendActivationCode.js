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


function sendActivationCode(){
    let server_message = document.getElementById('activation_message');
    let code = document.getElementById('code');

    server_message.style.color='red';
    console.log("Script for account activation request");
    let url = "http://localhost:8081/auth/confirm_account";


    sendHttpRequest('POST', url, {
        "code": code.value,
    })
        .then(responseData => {
            console.log(responseData);
            //show log in link
            document.getElementById("account_activation").style.display="block";


        })
        .catch(err => {
            console.log(err, err.data);
            server_message.innerHTML = 'Code not valid!';
        });
}
