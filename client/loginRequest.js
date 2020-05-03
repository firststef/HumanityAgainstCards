function sendLoginJSON(){
    let server_message = document.getElementById('login_message');
    let email = document.getElementById('login_email');
    let password = document.getElementById('login_password');

    server_message.style.color='red';

    // Creating a XHR object
    let xhr = new XMLHttpRequest();
//TO DO route config
    let url = "http://localhost:8081/routes/auth/login.js";
    // open a connection
    xhr.open("POST", url, true);

    // Set the request header i.e. which type of content you are sending
    xhr.setRequestHeader("Content-Type", "application/json");


    // Converting JSON data to string
    var data = JSON.stringify({ "email": email.value, "password": password.value });
    // Sending data with the request
    xhr.send(data);

    xhr.addEventListener("readystatechange", processRequest, false);
    xhr.onreadystatechange = processRequest;

    //Load the response from the server
    //if status==200 --> response { sucess: true, session: cookie_session }
    //else [status==401] --> repsonse { succes: false ,  reason: e}

    function processRequest(e) {
        if (xhr.readyState == 4) {
            if(xhr.status==200){
                var response = JSON.parse(xhr.responseText);
                //set cookie
                document.cookie=response.session;
                //redirect to lobby page
                window.location.replace( "confirm_account.html" );

            }
            else{
                // var response = JSON.parse(xhr.responseText);
                // server_message.innerHTML = response.reason;
                server_message.innerHTML = 'Input not valid';

            }
        }

    }

}