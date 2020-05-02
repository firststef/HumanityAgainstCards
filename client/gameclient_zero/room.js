const parent=require('./gamemanager');

var gameClient;
var updateInterval;
var playerHandElement;
var blackCardElement;
var scoreBoardElement;
var temporarySelectedCards = [];
var selectedCards = [];

function request(data, callback) {
    fetch('http://localhost:8081/game_manager/response',{
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        }
    ).then(response => {
        return response.json();
    }).then(response => {
        if (response !== undefined) {
            if (response.success === false) {
                console.log('[ERROR] Server error: ' + response.err);
            } else {
                if(response.data.error !== undefined)
                    console.log(response.data.error);
                callback(response.data);
            }
        }
        else {
            console.log("[ERROR] Server error - undefined header!");
            //handle exit gracefully
        }
    });
}

function load() {
    blackCardElement = document.getElementById("currentBlackCard");
    scoreBoardElement = document.getElementById("scoreBoard");
    playerHandElement = document.getElementById("playerHand");

    //Getting SID, normally this will be provided at auth time
    request({header: 'get_id'}, request => {
        if (request.header === 'sent_id'){
            let clientId = request.id;
            gameClient = new parent.GameClient(clientId);

            checkForUpdate();
            updateInterval = setInterval(()=>{
                checkForUpdate();
            }, 1000);
        }
        else
            throw 'could_not_retrieve_id';
    });
}

//todo: ui to add to the input array when the selection is complete
function checkForUpdate() {
    let input = getUserInput();
    let updated = gameClient.update(input);
    //if (updated === 'no-change')
    //    return;

    let requestedData = gameClient.getNecessaryData();
    //if (requestedData === 'no-change')
    //    return;
    request(requestedData, update);
}

function getUserInput() {
    let take = selectedCards;
    selectedCards = [];
    return take;
}

function update(response) {
    let changes = gameClient.putData(response);
    applyChanges(changes);
}

function applyChanges(changes) {
    console.log(changes);
    if (changes.header === 'show_cards'){
        let playerHandStr = '';
        changes.cards.forEach((card, index) => {
            playerHandStr += getCardHtml(card, "white");
        });
        playerHandElement.innerHTML = playerHandStr;

        blackCardElement.innerHTML = getCardHtml({text: changes.black_card.text, type: changes.black_card_type}, "black");

        scoreBoardElement.innerHTML = getPlayerTableHtml(changes.player_list);
    }
}

function getCardHtml(card, type){
    if (type === 'white'){
        return `
        <div class="card bg-light mb-3" onclick="selectCardWithId(${card.id})">
            <div class="card-body">
                <p class="card-text">${card.text}</p>
            </div>
        </div>`;
    }
    else if (type === 'black'){
        return `
        <div class="card bg-dark mb-3">
            <div class="card-body">
                <p class="card-text">${card.text}</p>
                <p class="card-type">${card.type}</p>
            </div>
        </div>`;
    }
}

function getPlayerTableHtml(players) {
    let playerTableStr = `
        <table class="table table-dark">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Score</th>
                </tr>
                </thead>
                <tbody>`;

    players.forEach((playerObj, index) => {
        playerTableStr += `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${playerObj.name}</td>
                    <td>${playerObj.points}</td>
                </tr>
        `;
    });

    playerTableStr += `
                </tbody>
        </table>`;
    return playerTableStr;
}

function selectCardWithId(index) {
    if (temporarySelectedCards.length < gameClient.getBlackCardPick()){
        temporarySelectedCards.push(index);
    }
    else {
        selectedCards = temporarySelectedCards;
        console.log("Selection made", selectedCards);
    }
}