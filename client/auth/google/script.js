function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    //Hide old login page
    document.getElementById("gsg").style.display = "none";
    document.getElementById("no-login").style.display = "none";

    //Load user data and display
    gapi.client.load('oauth2', 'v2', function () {
        var request = gapi.client.oauth2.userinfo.get({
            'userId': 'me'
        });
        request.execute(function (resp) {
            var profileHTML = '<h3>'+resp.given_name+'   <a href="#" onclick="signOut();">Sign out</a></h3>';
            profileHTML += '<img src="'+resp.picture+'"/><br><br><br><p><b>Google ID: </b>'+resp.id+'</p><p><b>Name: </b>'+resp.name+'</p><p><b>Email: </b>'+resp.email+'</p>';
            id_token = googleUser.getAuthResponse().id_token;
            profileHTML += '<p><b>Token de trimis la server: </b>'+id_token+'</p>';
            document.getElementById("profile").innerHTML = profileHTML;
            document.getElementById("logged").style.display = "block";
        });
});
}

function signOut() {
    gapi.auth2.getAuthInstance().signOut().then(function () {
        document.getElementById("profile").innerHTML = '';
        document.getElementById("logged").style.display = "none";
        document.getElementById("no-login").style.display = "block";
        
        document.getElementById("gsg").style.display = "block";
        location.reload(true);
    });
    
}