// const nume = require(path-ul fisierului)
const fetch = require('node-fetch');
const parent = require('./library');

/** FRONTEND CODE START */
//Constants & Vars
const initialRequest = {header: 'get_id'};
let clientId;
let gameClient;
//Code

initFrontend();
//interval = setInterval(update, 3000); //main loop

//Functions
function initFrontend(){
    fakeRequest(initialRequest, request => {
        if (request.header === 'sent_id'){
            clientId = request.id;
            gameClient = new parent.GameClient(clientId);

            let interval = setInterval(()=>{
                requestUpdate();
            }, 1000);
        }
    });
}

function fakeRequest(data, callback) {
    console.log("data", data);
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
        //if valid
        if (response !== undefined) {
            if (response.success === false) {
                console.log('[ERROR] Server error: ' + JSON.stringify(response.err));
            }else{
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

function requestUpdate() {
    let input = getUserInput();
    let updated = gameClient.update(input);
    if (updated === 'no-change')
        return;

    let requestedData = gameClient.getNecessaryData();
    fakeRequest(requestedData, update);
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
    //czar chooses the index for a card set instead of individual cards
    if (gameClient.getPlayerType() === 1) {
        return [
            gameClient.getCards()[0] && gameClient.getCards()[0].id,
            gameClient.getCards()[1] && gameClient.getCards()[1].id,
            gameClient.getCards()[2] && gameClient.getCards()[2].id
        ];
    }
    else{
        if (gameClient.getSelectedSets().length === 0)
            return [1999];

        return [
            (gameClient.getSelectedSets()[0] && gameClient.getSelectedSets()[0][0] && gameClient.getSelectedSets()[0][0].id) !== null ?
                gameClient.getSelectedSets()[0][0].id :
                (gameClient.getSelectedSets()[1] && gameClient.getSelectedSets()[1][0] && gameClient.getSelectedSets()[1][0].id)
        ];
    }
}
/** FRONTEND CODE END*/

/*------------------------------------------------------------------------------------- NOTES

1. The loop would actually block the app that is why this will be handled by:
setInterval(update, 1000); // application loop

*/