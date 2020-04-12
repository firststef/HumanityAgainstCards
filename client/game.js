// const nume = require(path-ul fisierului)
const parent=require('./gameclient/library');

/** BACKEND CODE START */
//Constants & Vars
let gameManager;
//Code

initBackend();

//Functions
function initBackend(){
    gameManager = new parent.GameManager(2);
}

function backEndFunction(data) {
    return gameManager.response(data);
}

/** BACKEND CODE END */

/** FRONTEND CODE START */
//Constants & Vars
const initialRequest = {header: parent.RequestHeaders.REQUEST_ID};
let clientId;
let gameClient;
let gameClient2;
//Code

initFrontend();
//interval = setInterval(update, 3000); //main loop
let iterations = 0;
while (true){
    update();
}


//Functions
function initFrontend(){
    let request = fakeRequest(initialRequest);
    if (request.header === parent.RequestHeaders.RESPONSE_REQUEST_ID){
        clientId = request.id;
        gameClient = new parent.GameClient(clientId);
    }
    request = fakeRequest(initialRequest);
    if (request.header === parent.RequestHeaders.RESPONSE_REQUEST_ID){
        clientId = request.id;
        gameClient2 = new parent.GameClient(clientId);
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

    gameClient2.update(input);

    request = gameClient2.getNecessaryData();
    response = fakeRequest(request);
    changes = gameClient2.putData(response);

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