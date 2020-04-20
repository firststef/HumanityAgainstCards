const basedata=require('./basedata');
const gameclient=require('./gameclient');
const gamemanager=require('./gamemanager');

/** Momentan reprezinta un singur joc, e treaba backend-ului sa aiba grija de apelurile catre fiecare obiect GameManager sa fie facut corect */

//TODO: sincronizat playerlist
//TODO: add development option to hide all console logs
//TODO: for every request check if error field is present
// module.exports.[ce nume vrei sa aibe in afara filei] = [variabila/functia/clasa din fila]
module.exports.RequestHeaders = basedata.RequestHeaders;
module.exports.GameStates = basedata.GameStates;
module.exports.Card = basedata.Card;
module.exports.GameManager = gamemanager.GameManager;
//module.exports.getchAI=gamemaneger.fetchAI;
module.exports.GameClient = gameclient.GameClient;
