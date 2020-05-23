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
 * Function that makes a POST request to the server for disconnect
 */
function disconnect() {
    let url = "http://localhost:8081/auth/logout";

    sendHttpRequest('POST', url,{})
        .then(responseData => {
            console.log(responseData);
            eraseCookie("HAC_SID");
            window.location = "/";
        }).catch(err => {
        console.log(err);
    });

}