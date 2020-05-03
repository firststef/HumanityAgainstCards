var letter = /[a-zA-Z]/;
var number = /[0-9]/;

var validatePass = function() {
    if (document.getElementById('new_pass').value.length < 5 ){
        document.getElementById('reset_message').style.color = 'red';
        document.getElementById('reset_message').innerHTML = 'Password must be at least 5 characters !';
    }
    else if(!letter.test(document.getElementById('new_pass').value) || !number.test(document.getElementById('new_pass').value))
    {
        document.getElementById('reset_message').style.color = 'red';
        document.getElementById('reset_message').innerHTML = 'Password must contain an uppercase and a number!';
    }
    else{
        if (document.getElementById('new_pass').value == document.getElementById('c_new_pass').value)
        {
            document.getElementById('reset_message').style.color = 'green';
            document.getElementById('reset_message').innerHTML = 'Good to go';
        } else {
            document.getElementById('reset_message').style.color = 'red';
            document.getElementById('reset_message').innerHTML = 'Passwords not matching!';
        }
    }
}