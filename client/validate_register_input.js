var letter = /[a-zA-Z]/;
var number = /[0-9]/;

var check = function() {
if (document.getElementById('register_password').value.length < 5 ){
    document.getElementById('register_message').style.color = 'red';
    document.getElementById('register_message').innerHTML = 'Password must be at least 5 characters !';
}
else if(!letter.test(document.getElementById('register_password').value) || !number.test(document.getElementById('register_password').value))
{
    document.getElementById('register_message').style.color = 'red';
    document.getElementById('register_message').innerHTML = 'Password must contain an uppercase and a number!';
}
else{
if (document.getElementById('register_password').value ==
  document.getElementById('register_cpassword').value)
  {
  document.getElementById('register_message').style.color = 'green';
  document.getElementById('register_message').innerHTML = 'Good to go';
} else {
  document.getElementById('register_message').style.color = 'red';
  document.getElementById('register_message').innerHTML = 'Passwords not matching!';
}
}
}