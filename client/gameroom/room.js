const gm=require('./gamemanager');

var roomID;
var sid;
var gameClient;
var updateInterval;
var playerHandElement;
var blackCardElement;
var scoreBoardElement;
var otherPlayedCardsElement;
var temporarySelectedCards = [null, null, null];
var selectedCards = [];

window.onload = () => load();

function load() {
    blackCardElement = document.getElementById("currentBlackCard");
    scoreBoardElement = document.getElementById("scoreBoard");
    playerHandElement = document.getElementById("playerHand");
    otherPlayedCardsElement = document.getElementById("otherPlayedCards");

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    roomID = urlParams.get("roomID");
    if (roomID === null) {
        window.location = '/';
    }

    sid = getCookie("HAC_SID");
    if (sid === null){
        window.location = "/";
    }

    gameClient = new gm.GameClient(sid);

    checkForUpdate();
    updateInterval = setInterval(()=>{
        checkForUpdate();
    }, 1000);
}

function request(data, callback) {
    fetch('http://localhost:8081/game_manager/' + roomID,{
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

//todo: ui to add to the input array when the selection is complete
function checkForUpdate() {
    let input = getUserInput();
    let updated = gameClient.update(input);
    //if (updated === 'no_change')
    //    return;

    let requestedData = gameClient.getNecessaryData();
    //if (requestedData === 'no_change')
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
        replaceHandCards(changes.cards);
        blackCardElement.innerHTML = getCardHtml({text: changes.black_card.text, type: changes.black_card_type}, "black");
        scoreBoardElement.innerHTML = getPlayerTableHtml(changes.player_list);
        if (gameClient.getPlayerType() === PlayerTypes.PLAYER){
            document.getElementById("role").innerHTML = 'Your roles is PLAYER';
        }
        else{
            document.getElementById("role").innerHTML = 'Your roles is CZAR';
        }
    }
    if (changes.header === 'no_change'){
        if (changes.selected_cards !== undefined){
            replaceSelectedCards(changes.selected_cards);
        }
    }
    if (changes.header === 'czar_allow_white_card_choice'){
        replaceSelectedCards(changes.selected_cards);
    }
    if (changes.header === 'not_yet_ended_wait'){//todo: this replaces with every update, optimization required
        if (changes.selected_cards !== undefined){
            replaceSelectedCards(changes.selected_cards);
        }
    }
    if (changes.header === 'player_round_end'){
        document.getElementById(`card${changes.winning_cards[0].id}`).parentNode.style.border = 'green solid 2px';
    }
    if (changes.header === 'new_round_for_normal_player'){
        replaceHandCards(changes.player_cards);
        blackCardElement.innerHTML = getCardHtml({text: changes.black_card.text, type: changes.black_card_type}, "black");
        scoreBoardElement.innerHTML = getPlayerTableHtml(changes.player_list);
        if (gameClient.getPlayerType() === PlayerTypes.PLAYER){
            document.getElementById("role").innerHTML = 'Your roles is PLAYER';
        }
        else{
            document.getElementById("role").innerHTML = 'Your roles is CZAR';
        }
    }
    if (changes.header === 'wait_for_players'){
        replaceHandCards(changes.player_cards);
        blackCardElement.innerHTML = getCardHtml({text: changes.black_card.text, type: changes.black_card_type}, "black");
        scoreBoardElement.innerHTML = getPlayerTableHtml(changes.player_list);
        otherPlayedCardsElement.innerHTML = '';
        if (gameClient.getPlayerType() === PlayerTypes.PLAYER){
            document.getElementById("role").innerHTML = 'Your role is PLAYER';
        }
        else{
            document.getElementById("role").innerHTML = 'Your role is CZAR';
        }
    }
    if (changes.header === "game_has_ended"){
        scoreBoardElement.innerHTML = getPlayerTableHtml(changes.player_list);
        alert("Game has ended");
    }
}

function replaceHandCards(cards){
    let playerHandStr = '';
    cards.forEach((card) => {
        playerHandStr += getCardHtml(card, "white");
    });
    playerHandElement.innerHTML = playerHandStr;
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
                <button id="submitButton${card.id}" class="btn btn-success submit-button" onclick="submitCards(event)">Submit</button>
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
        let found = false;
        for (let set of gameClient.getSelectedSets()){
            if (set === null){
                continue;
            }
            for (let card of set){
                if (card != null && card.id === id) {
                    found = true;
                    break;
                }
                if (found)
                    break;
            }
        }
        if (!found) {
            return;
        }

        selectedCards[0] = id;
        document.getElementById(`card${id}`).parentNode.style.border = 'green solid 2px';
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

function submitCards(event) {
    event.stopPropagation();
    if (gameClient.getPlayerType() === PlayerTypes.PLAYER) {
        if (temporarySelectedCards.filter(el => el !== null).length === gameClient.getBlackCardPick()) {
            hideSubmitButtons();
            selectedCards = temporarySelectedCards.filter(el => el !== null);
            temporarySelectedCards = [null, null, null];
        }
    }
}