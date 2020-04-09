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

/** BACKEND CODE END */

/** FRONTEND CODE START */
//Constants & Vars
const initialRequest = {header: parent.RequestHeaders.REQUEST_ID};
let clientId;
let gameClient;
//Code

initFrontend();
//interval = setInterval(update, 3000); //main loop

//Functions
function initFrontend(){
    fakeRequest(initialRequest, request => {
        if (request.header === parent.RequestHeaders.RESPONSE_REQUEST_ID){
            clientId = request.id;
            gameClient = new parent.GameClient(clientId);

            let interval = setInterval(()=>{
                requestUpdate();
            }, 3000);
        }
    });
}

function fakeRequest(data, callback) {
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
    ).then(response => response.json()).then(response => {
        //if valid
        callback(response.data);
    });
}

function requestUpdate() {
    let input = getUserInput();
    gameClient.update(input);

    let request = gameClient.getNecessaryData();
    fakeRequest(request, update);
}
function update(response){
    let changes = gameClient.putData(response);
    applyChanges(changes);
}

function applyChanges(changes) {
    console.log(changes);
}

function getUserInput() {
    console.log('Checked for input');
    return {
        card_index: 0
    };
}
/** FRONTEND CODE END*/

/*------------------------------------------------------------------------------------- NOTES

1. The loop would actually block the app that is why this will be handled by:
setInterval(update, 1000); // application loop

*/

//Utils
parent.getRandomString();