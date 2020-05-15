let sid;
if (document.cookie.split(';').some((item) => item.trim().startsWith('HAC_SID='))) {
    document.getElementById("authButton").style.display = 'none';
    document.getElementById("accountPageButton").style.display = 'block';
    sid = getCookie("HAC_SID");
    if (sid === null){
        window.location = "/";
    }
}

function getRoomHtml(room) {
    return `
            <div class="card" id="${room.id}">
                <h5 class="card-header" >Room name: ${room.room_name} (${room.players_in_game}/${room.max_players})</h5>
                <div class="card-body">
                    <h5 class="card-title">Players: ${room.players.join(', ')}</h5>
                    <h5 class="card-title">Goal: ${room.score_limit} </h5>
                    <p class="card-text">Id: ${room.id}</p>
                    <a class="btn btn-primary" onclick="attemptJoinRoom(${room.id})">Join as Player</a>
                </div>
            </div>`;
}

function getRooms() {
    fetch('/get_rooms')
        .then(response => response.json())
        .then(function (data) {
            let roomsStr = '';
            if (data["success"] === true) {
                data["rooms"].forEach(room => roomsStr += getRoomHtml(room));
            }
            document.querySelector(".lobbies").innerHTML = roomsStr;
        })
        .catch(err => console.log(err));
}

getRooms();

function validate() {
    var input, li, i;
    input = document.getElementById('search').value;
    li = document.getElementsByClassName('card');
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        if (li[i].id.startsWith(input) || input === "") {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function createRoom() {
    sid = getCookie("HAC_SID");
    if (sid === null){
        window.location = "/";
    }
    let body = {type: 'create_room'};
    $('#roomSettings').serializeArray().forEach((field) => {
        body[field.name] = field.value;
    });
    console.log("send create", body);
    fetch('rooms', {
        method: 'post',
        headers: {
            "session": sid,
            "Content-type": "application/json"
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then(res => {
            if (res.success === true) {
                window.location.href = '/waitingRoom?roomID=' + res.roomID;
            } else alert('Failed to create room');
        });
    return false;
}

function attemptJoinRoom(id) {
    sid = getCookie("HAC_SID");
    if (sid === null){
        window.location = "/";
    }

    let body = {};
    body.roomID = id;
    body.password = '';

    fetch('/join_room', {
        method: 'post',
        headers: {
            "Content-type": "application/json",
            "session": sid
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then(res => {
            if (res.success === true) {
                window.location = '/waitingRoom?roomID=' + id;
            } else {
                alert('Could not join room');
            }
        });
}