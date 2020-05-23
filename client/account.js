/**
 * Function that fills the user profile information
 */
window.onload = () => profileFill();
function profileFill() {
    let user = document.getElementById('account_username');
    let nick = document.getElementById('account_nickname');
    let email = document.getElementById('account_email');
    let games_played = document.getElementById('account_played');
    let games_won = document.getElementById('account_won');

    let profile=JSON.parse(localStorage.getItem("user_profile"));
    // console.log(profile);

    user.innerHTML= 'Username : ' + profile.username;
    nick.innerHTML= 'Nickname : ' + profile.nickname;
    email.innerHTML= 'Email : ' + profile.email;
    games_played.innerHTML= 'Games played : ' + profile.games_played;
    games_won.innerHTML= 'Games played : ' + profile.games_won;

}


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

function deleteCookies() {
    document.cookie = "HAC_SID= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
}

/**
 * Function that makes a POST request to the server for disconnect
 */
function disconnect() {
    let url = "http://localhost:8081/auth/logout";

    sendHttpRequest('POST', url,{})
        .then(responseData => {
            console.log(responseData);
            localStorage.removeItem("json");
            localStorage.removeItem("user_profile");
            deleteCookies();
            window.location = "/";
        }).catch(err => {
        console.log(err);
    });

}