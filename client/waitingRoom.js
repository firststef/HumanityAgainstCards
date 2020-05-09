let roomID;

function load() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    roomID = urlParams.get("roomID");
    if (roomID === null) {
        window.location.href = '/lobbies.html';
    }

    getJoinedPlayers();
    setInterval(getJoinedPlayers, 1000);

    revealIfHost();
}

function revealIfHost() {
    fetch('/get_hosted_rooms', {
        method: 'get',
        headers: {
            "Content-type": "application/json",
            "session": 'dGs0bXJqOTh1bmRlZmluZWQxNTg4NDEzMjE4ODA4Y3c='
        }
    })
        .then(res => res.json())
        .then(res => {
            if (res.success === true) {
                document.getElementById("startGameDiv").style.display = 'block';
            } else {
                console.log("error on isHost");
            }
        });
}

function attemptStartGame() {
    fetch('/start_game', {
        method: 'post',
        headers: {
            "Content-type": "application/json",
            "session": 'dGs0bXJqOTh1bmRlZmluZWQxNTg4NDEzMjE4ODA4Y3c='
        },
        body: JSON.stringify({roomID: roomID})
    })
        .then(res => res.json())
        .then(res => {
            if (res.success === true) {
                window.location.href = '/room?roomID=' + roomID;
            } else {
                alert('Could not start game room');
            }
        });
}

function getJoinedPlayers() {
    fetch('/players_from_room', {
        method: 'get',
        headers: {
            "Content-type": "application/json",
            "session": 'dGs0bXJqOTh1bmRlZmluZWQxNTg4NDEzMjE4ODA4Y3c=',
            "roomID": roomID
        }
    })
        .then(res => res.json())
        .then(res => {
            if (res.success === true) {
                document.getElementById("player-list").innerHTML = res.players.map(p => getPlayerDiv(p)).join('');
            } else {
                console.log('Could not get players room');
            }
        });
}

function getPlayerDiv(playerName) {
    return `
        <div class="playerDiv">
            <p>${playerName}</p>
        </div>
    `;
}