/**
 * Function used to make a HTTP request to a given URL and method using fetch
 */
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

/**
 * Function that makes a POST request to the server
 * transmitting the code necessary for the activation of an account
 */

function sendActivationCode(){
    let server_message = document.getElementById('activation_message');
    let username = document.getElementById('username').value;
    let code = document.getElementById('activation_code').value;

    server_message.style.color='red';
    console.log("Script for account activation request");
    let url = "http://localhost:8081/confirm_account/" + username + "/" + code;

    sendHttpRequest('POST', url)
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
