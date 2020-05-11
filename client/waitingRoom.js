let roomID;
let sid;

function load() {
    sid = getCookie("HAC_SID");
    if (sid === null){
        window.location = "/";
    }

    window.onresize = () => {
        revealIfHost();
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    roomID = urlParams.get("roomID");
    if (roomID === null) {
        window.location.href = '/lobbies.html';
    }

    document.getElementById("roomId").innerHTML = roomID;
    getJoinedPlayers();
    setInterval(getJoinedPlayers, 1000);

    revealIfHost();
}

function revealIfHost() {
    fetch('/get_hosted_rooms', {
        method: 'get',
        headers: {
            "Content-type": "application/json",
            "session": sid
        }
    })
        .then(res => res.json())
        .then(res => {
            if (res.success === true) {
                if (res.rooms.includes(parseInt(roomID))) {
                    if (window.innerWidth < 769) {
                        document.getElementById("hostInfo").style.display = 'block';
                        document.getElementById("mobileButton").style.display = 'block';
                        document.getElementById("startGameDiv").style.display = 'none';
                    } else {
                        document.getElementById("startGameDiv").style.display = 'flex';
                        document.getElementById("hostInfo").style.display = 'none';
                        document.getElementById("mobileButton").style.display = 'none';
                    }
                }
                else {
                    setInterval(joinRoomIfStarted,1000);
                }
            } else {
                console.log("error on isHost");
            }
        });
}

function attemptStartGame(event) {
    event.preventDefault();
    fetch('/start_game', {
        method: 'post',
        headers: {
            "Content-type": "application/json",
            "session": sid
        },
        body: JSON.stringify({ roomID: roomID })
    })
        .then(res => res.json())
        .then(res => {
            if (res.success === true) {
                window.location.href = '/game?roomID=' + roomID;
            } else {
                alert('Could not start game room');
            }
        });
}

function getJoinedPlayers() {
    fetch('/players_from_room/'+roomID, {
        method: 'get',
        headers: {
            "Content-type": "application/json",
            "session": sid
        }
    })
        .then(res => res.json())
        .then(res => {
            if (res.success === true) {
                document.getElementById("playerList").innerHTML = res.players.map(p => getPlayerDiv(p)).join('');
            } else {
                console.log('Could not get players room');
            }
        });
}

function joinRoomIfStarted() {
    fetch('/game_started/'+roomID, {
        method: 'get',
        headers: {
            "Content-type": "application/json",
            "session": sid
        }
    })
        .then(res => res.json())
        .then(res => {
            if (res.success === true) {
                if(res.status === "started"){
                    window.location.href = '/game?roomID=' + roomID;
                    console.log("Started");
                }
            } else {
                console.log('Could not get players room');
            }
        });
}

function getPlayerDiv(playerName) {
    return `
        <div class="player">
            <b>${playerName}</b>
        </div>
    `;
}