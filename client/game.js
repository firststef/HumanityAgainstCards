const RequestHeaders = {
    REQUEST_ID: 1,
    RESPONSE_REQUEST_ID:2,
    REQUEST_CARDS:3,
    RESPONSE_REQUEST_CARD:4,
    REQUEST_CHOSE_CARD:5,
    RESPONSE_CHOSE_CARD:6
};
Object.freeze(RequestHeaders);

const GameStates = {
    INITIAL:0,
    CHOOSE_WHITE_CARD:1,
    CHOSEN_WHITE_CARD:2,
    END_ROUND_AS_PLAYER:3,
    CHOOSE_BLACK_CARD:4,
    CHOSEN_BLACK_CARD:5,
    WAIT_FOR_PLAYERS:6,
    ENDED_WAIT_FOR_PLAYERS:7,
    END_ROUND_AS_CZAR:8
};

class Card {
    constructor(id, name, text) {
        this.id = id;
        this.name = name;
        this.text = text;
    }
}

/** Momentan reprezinta un singur joc, e treaba backend-ului sa aiba grija de apelurile catre fiecare obiect GameManager sa fie facut corect */
class GameManager {
    constructor() { //should actually be initialized with a gameId, created by looking at the db, assuring it is unique
    }

    newId(){
        if (this.counter === undefined){
            this.counter = 0;
        }
        return this.counter++;
    }

    response(data){
        if (data.header === RequestHeaders.REQUEST_ID){
            console.log('[SERVER] created new id');
            return {
                header: RequestHeaders.RESPONSE_REQUEST_ID,
                id: this.newId()
            };
        }
        if (data.header === RequestHeaders.REQUEST_CARDS){
            console.log('[SERVER] gave client some cards');
            let card_lst = [];
            [...Array(5).keys()].forEach((x) => card_lst.push(new Card(x, getRandomString(), getRandomString())));
            return {
                header: RequestHeaders.RESPONSE_REQUEST_CARD,
                cards: card_lst
            };
        }
        return 'error';
    }
}

class GameClient {
    constructor(token) {
        this.token = token;
        this.cards = [];
        this.points = 0;
        
        this.state = GameStates.INITIAL;
    }

    update(data){//this will return maybe a response with accepted/invalid
        if (this.state === GameStates.CHOOSE_WHITE_CARD){
            console.log('Chosen white card');
            this.state = GameStates.CHOSEN_WHITE_CARD;
        }
        if (this.state === GameStates.CHOOSE_BLACK_CARD){
            console.log('Chosen black card');
            this.state = GameStates.CHOSEN_BLACK_CARD;
        }
    }

    getNecessaryData(){
        if (this.state === GameStates.INITIAL) {
            return {
                header: RequestHeaders.REQUEST_CARDS
            }
        }
        return 'error';
    }

    putData (data){
        if (this.state === GameStates.INITIAL && data.header === RequestHeaders.RESPONSE_REQUEST_CARD){
            console.log('Received cards:', data.cards);
            this.state = GameStates.CHOOSE_WHITE_CARD;
            this.cards += data.cards;
            this.state = GameStates.CHOOSE_WHITE_CARD;
            return {
                header:'show_cards',
                cards: this.cards
            }
        }
        return 'error';
    }
}

/** BACKEND CODE START */
//Constants & Vars
let gameManager;
//Code

initBackend();

//Functions
function initBackend(){
    gameManager = new GameManager();
}

function backEndFunction(data) {
    return gameManager.response(data);
}

/** BACKEND CODE END */

/** FRONTEND CODE START */
//Constants & Vars
const initialRequest = {header: RequestHeaders.REQUEST_ID};
let clientId;
let gameClient;
//Code

initFrontend();
//interval = setInterval(update, 3000); //main loop
while (true){
    update();
}

//Functions
function initFrontend(){
    let request = fakeRequest(initialRequest);
    if (request.header === RequestHeaders.RESPONSE_REQUEST_ID){
        clientId = request.id;
        gameClient = new GameClient(clientId);
    }
}

function fakeRequest(data) {
    return backEndFunction(data);
}

function update() {
    let input = getUserInput();
    gameClient.update(input);

    let request = gameClient.getNecessaryData();
    let response = fakeRequest(request);
    let changes = gameClient.putData(response);

    applyChanges(changes);
}

function applyChanges(changes) {
    console.log(changes);
}

function getUserInput() {
    console.log('Checked for input');
    return {
        card_id: 0
    };
}
/** FRONTEND CODE END*/

/*------------------------------------------------------------------------------------- NOTES

1. The loop would actually block the app that is why this will be handled by:
setInterval(update, 1000); // application loop

*/

//Utils
function getRandomString() {
    return Array(1).fill(null).map(() => Math.random().toString(36).substr(2)).join('')
}