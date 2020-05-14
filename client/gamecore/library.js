const basedata=require('./basedata');
const gameclient=require('./gameclient');
const gamemanager=require('../../server/gamecore/gamemanager');

module.exports.RequestHeaders = basedata.RequestHeaders;
module.exports.GameStates = basedata.GameStates;
module.exports.Card = basedata.Card;
module.exports.GameManager = gamemanager.GameManager;
//module.exports.getchAI=gamemaneger.fetchAI;
module.exports.GameClient = gameclient.GameClient;
