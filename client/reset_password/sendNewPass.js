
function sendNewPassword(){
    // let server_message = document.getElementById('reset_message');
    let new_pass = document.getElementById('new_pass');

    // server_message.style.color='red';
    console.log("Script for sending the new password");
    let url = "/auth/reset_password/:username";


    sendHttpRequest('POST', url, {
        "new_password": new_pass.value,
        "confirm_new_password": new_pass.value
    })
    .then(responseData => {
        console.log(responseData);
    })
    .catch(err => {
        console.log(err, err.data);
        //display message
        document.getElementById('reset_message').innerHTML = 'Input not valid!';
    });
}
