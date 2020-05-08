const parent=require('./gamemanager');

var gameClient;
var updateInterval;
var playerHandElement;
var blackCardElement;
var scoreBoardElement;
var otherPlayedCardsElement;
var temporarySelectedCards = [null, null, null];
var selectedCards = [];

function request(data, callback) {
    fetch('http://localhost:8081/game_manager/response',{
            method: 'POST',
            cache: 'no-cache',
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
    }).catch(err => console.log(err));
}

function load() {
    blackCardElement = document.getElementById("currentBlackCard");
    scoreBoardElement = document.getElementById("scoreBoard");
    playerHandElement = document.getElementById("playerHand");
    otherPlayedCardsElement = document.getElementById("otherPlayedCards");

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
        changes.cards.forEach((card) => {
            playerHandStr += getCardHtml(card, "white");
        });

        playerHandElement.innerHTML = playerHandStr;
        blackCardElement.innerHTML = getCardHtml({text: changes.black_card.text, type: changes.black_card_type}, "black");
        scoreBoardElement.innerHTML = getPlayerTableHtml(changes.player_list);
    }
    if (changes.header === 'czar_allow_white_card_choice'){
        replaceSelectedCards(changes.selected_cards);
    }
    if (changes.header === 'not_yet_ended_wait'){//todo: this replaces with every update, optimization required
        if (changes.selected_cards !== undefined){
            replaceSelectedCards(changes.selected_cards);//am ramas aici, trebuie sa dau refresh la cartile din mana, si la score
        }
    }
}

function replaceSelectedCards(cards){
    let otherPlayedStr = '';
    cards.forEach(set => {
            if (!set.every(e => e === null)) {
                otherPlayedStr += '<div class="card-set">';
                set.forEach((card) => {
                    if (card !== null) {
                        otherPlayedStr += getCardHtml(card, "white");
                    }
                });
                otherPlayedStr += '</div>';
            }
        }
    );

    otherPlayedCardsElement.innerHTML = otherPlayedStr;
}

function getCardHtml(card, type){
    if (type === 'white'){
        return `
        <div class="card bg-light mb-3" id="card${card.id}" onclick="selectCardWithId(event, ${card.id})">
            <div class="card-body">
                <p class="card-text">${card.text}</p>
                <button id="submitButton${card.id}" class="btn btn-success submit-button" onclick="submitCards()">Submit</button>
                <h1 class="card-index" id="cardIndex${card.id}"></h1>
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

function selectCardWithId(event, id) {
    if (gameClient.getPlayerType() === PlayerTypes.PLAYER){
        let found = false;
        for (let card of gameClient.getCards()){
            if (card.id === id)
                found = true;
        }
        if (!found) {
            return;
        }

        let index = temporarySelectedCards.indexOf(id);
        if (index !== -1){
            updateCardUIIndexes();
            unselectCard();
            hideSubmitButtons();
            temporarySelectedCards[index] = null;
        }
        else if (temporarySelectedCards.filter(el => el !== null).length < gameClient.getBlackCardPick()) {
            let i = 0;
            while (i < 3){
                if(temporarySelectedCards[i] === null){
                    temporarySelectedCards[i] = id;
                    break;
                }
                i++;
            }
        }
        if (temporarySelectedCards.filter(el => el !== null)) {
            selectCard();
            updateCardUIIndexes();
        }
        if (temporarySelectedCards.filter(el => el !== null).length === gameClient.getBlackCardPick()){
            showSubmitButtons();
        }
    }
    else {
        selectedCards[0] = id;
    }
}

function updateCardUIIndexes() {
    temporarySelectedCards.forEach(id => {
        if (id !== null) {
            let cardIndex = document.getElementById(`cardIndex${id}`);
            let i = temporarySelectedCards.indexOf(id);
            cardIndex.innerHTML=`${i + 1}`;
            cardIndex.style.display = "block";
        }
    });
}

function showSubmitButtons(){
    temporarySelectedCards.forEach(id => {
        if (id !== null) {
            document.getElementById(`submitButton${id}`).style.display = "block";
        }
    });
}

function hideSubmitButtons(){
    temporarySelectedCards.forEach(id => {
        if (id !== null) {
            document.getElementById(`submitButton${id}`).style.display = "none";
        }
    });
}

function unselectCard(){
    temporarySelectedCards.forEach(id => {
        if (id !== null) {
            let element = document.getElementById(`card${id}`);
            element.classList.remove("selected");
            let cardIndex = document.getElementById(`cardIndex${id}`);
            cardIndex.innerHTML="";
        }
    });
}

function selectCard(){
    temporarySelectedCards.forEach(id => {
        if (id !== null) {
            let element = document.getElementById(`card${id}`);
            element.classList.add("selected");
        }
    });
}

function submitCards() {
    if (gameClient.getPlayerType() === PlayerTypes.PLAYER) {
        if (temporarySelectedCards.filter(el => el !== null).length === gameClient.getBlackCardPick()) {
            hideSubmitButtons();
            selectedCards = temporarySelectedCards.filter(el => el !== null);
            temporarySelectedCards = [null, null, null];
        }
    }
}