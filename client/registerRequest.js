function sendRegisterJSON(){
    let server_message = document.getElementById('register_message');
    let username = document.getElementById('register_username');
    let nickname = document.getElementById('register_nickname');
    let email = document.getElementById('register_email');
    let password = document.getElementById('register_password');

    server_message.style.color='red';
    console.log("Script for register request");


    // Creating a XHR object
    let xhr = new XMLHttpRequest();
//TO DO route config

    let url = "http://localhost:8081/routes/auth/login";

    // open a connection
    xhr.open("POST", url, true);
    // Set the request header i.e. which type of content you are sending
    xhr.setRequestHeader("Content-Type", "application/json");

    // Converting JSON data to string
    var data = JSON.stringify({ "username": username.value, "password": password.value, "email": email.value, "nickname": nickname.value });
    // Sending data with the request
    xhr.send(data);


    xhr.addEventListener("readystatechange", processRequest, false);
    xhr.onreadystatechange = processRequest;


    //Load the response from the server
    //if status==200 --> response { sucess: true, username : username }
    //else [status==401] --> repsonse { succes: false ,  reason: e}

    function processRequest(e) {
        if (xhr.readyState == 4) {
            if(xhr.status==200){
                server_message.style.color='green';
                server_message.innerHTML='Success! Go activate your account!';
                document.getElementById('account_activation').style.display='block';

            }
            else{
                // var response = JSON.parse(xhr.responseType);
                server_message.innerHTML = JSON.parse(xhr.response).e;

            }
        }

    }


}