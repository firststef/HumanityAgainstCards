const fetch = require('node-fetch');

// const nume = require(path-ul fisierului)
const parent=require('./library');

/** BACKEND CODE START */
//Constants & Vars
let gameManager;
//Code

initBackend();

//Functions
function initBackend(){
    gameManager = new parent.GameManager();
}

async function backEndFunction(data) {
    console.log(data);
    return fetch('http://localhost:8081/game_manager/response',{
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
        }
    ).then(res => res.json());
}

/** BACKEND CODE END */

/** FRONTEND CODE START */
//Constants & Vars
const initialRequest = {header: parent.RequestHeaders.REQUEST_ID};
let clientId;
let gameClient;
//Code

initFrontend();
//interval = setInterval(update, 3000); //main loop
let iterations = 0;
let interval = setInterval(update, 1000);

//Functions
function initFrontend(){
    let request = fakeRequest(initialRequest);
    if (request.header === parent.RequestHeaders.RESPONSE_REQUEST_ID){
        clientId = request.id;
        gameClient = new parent.GameClient(clientId);
        console.log(gameClient);
    }
}

async function fakeRequest(data) {
    let x = await backEndFunction(data);
    console.log(x);
    return x;
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
parent.getRandomString();