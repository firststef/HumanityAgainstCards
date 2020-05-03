function submitName(){
    localStorage.setItem("HACPlayerName", document.getElementById("PlayerName").value);
    window.location.href = "/lobbies.html";
}