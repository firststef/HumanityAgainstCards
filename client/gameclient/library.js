const RequestHeaders = {
    REQUEST_ID: 1,
    RESPONSE_REQUEST_ID:2,
    REQUEST_BEGIN_GAME:3,
    RESPONSE_BEGIN_GAME:4,
    REQUEST_CHOSE_CARD:5,
    RESPONSE_CHOSE_CARD:6,
    REQUEST_WAIT_ENDED_PLAYERS: 7,
    RESPONSE_WAIT_ENDED_PLAYERS: 8,
    REQUEST_WAIT_ENDED_CZAR: 9,
    RESPONSE_WAIT_ENDED_CZAR: 10,
    REQUEST_END_ROUND: 11,
    RESPONSE_END_ROUND: 12
};
Object.freeze(RequestHeaders);

const GameStates = {
    INITIAL:0,
    CHOOSE_WHITE_CARD:1,
    CHOSEN_WHITE_CARD:2,
    CHOOSE_BLACK_CARD:3,
    CHOSEN_BLACK_CARD:4,
    WAIT_FOR_PLAYERS:5,
    WAIT_FOR_CZAR:6,
    END_ROUND:7,
    GAME_END:8
};

const PlayerTypes = {
    CZAR: 0,
    PLAYER: 1,
};


class Card {
    constructor(id, name, text) {
        this.id = id;
        this.name = name;
        this.text = text;
    }
}

//Only used for arrays
class Player {
    constructor(id) {
        this.id = id;
        this.name = '';
        this.points = 0;
        this.cards = [];
        this.type = null;
    }
}

function fetchAI(blackCard, listOfCards){
    return {
        then: (func) => func(listOfCards[0])
    };
}



/** Momentan reprezinta un singur joc, e treaba backend-ului sa aiba grija de apelurile catre fiecare obiect GameManager sa fie facut corect */
class GameManager {
    constructor(numberOfPlayers, numberOfAIPlayers, playerIDList) { //should actually be initialized with a gameId, created by looking at the db, assuring it is unique
        this.waitEnded_Players = false;
        this.waitEnded_Czar = false;

        this.numberOfPlayers = numberOfPlayers;
        this.readyPlayers = 0;
        this.playerList = [];

        this.currentCzarIndex = null;
        this.commonBlackCard = null;
        this.blackCardType = 0;
        this.selectedWhiteCards = []; //cards selected by normal players
        this.winningCardSet = []; //card chosen by czar
        this.winnerPlayer = null;

        this.maxPoints = 2; //2 is set just for cycle preview -- use higher values

        playerIDList.forEach((pid) => this.playerList.push(new Player(pid)));
        //here add foreach ai player an ai player with a flag and unique id for ai


        //init selected cards array for each player
        for(var i=0; i < numberOfPlayers + numberOfAIPlayers; i++) {
            this.selectedWhiteCards[i] = new Array(2);
        }
    }

    getBlackCard(){
        //todo: request card
        this.commonBlackCard = new Card(999, 'Black Card', 'Some black card text');
        this.blackCardType = 2;
    }

    resetData(){
        this.readyPlayers = 0;
        this.selectedWhiteCards = [];
        for(var i=0; i < numberOfPlayers + numberOfAIPlayers; i++) {
            this.selectedWhiteCards[i] = new Array(2);
        }
        this.winningCard = [];
        this.waitEnded_Players = false;
        this.waitEnded_Czar = false;
    }

    response(data){//TODO: in server === 'error' should be consistenct
        let playerIndex = this.playerList.findIndex(player => player.id === data.player_id);
        if (playerIndex === -1){
            console.log('[SERVER] Error on player index: ' + playerIndex);
            return {
                error: 'Error'
            }
        }

        /**
         * Give the player a set of white cards, the common black card, player list and whoever is the czar
         */
        if (data.header === RequestHeaders.REQUEST_BEGIN_GAME){
            let card_lst = [];
            //these are random but they need to be taken from a db
            // - we will get the number of cards in the database
            // - each used id will be put in usedCards[]
            // - each client gets a unique set of id's (Cards)
            if (this.generateCardId === undefined){ //will be replaced with actual cards
                this.generateCardId = 0;
            }

            [...Array(10).keys()].forEach((x) => {
                let card = new Card(this.generateCardId, getRandomString(), getRandomString());
                this.generateCardId++;
                card_lst.push(card);
                this.playerList[playerIndex].cards.push(card);
            });

            this.getBlackCard();

            if(this.currentCzarIndex === null) {
                this.currentCzarIndex = Math.floor((Math.random() * 1000) % this.numberOfPlayers);
            }
            this.playerList.forEach(player => {
                if(this.playerList[this.currentCzarIndex].id === player.id) {
                    player.type = PlayerTypes.CZAR;
                } else {
                    player.type = PlayerTypes.PLAYER;
                }
            });

            return {
                header: RequestHeaders.RESPONSE_BEGIN_GAME,
                cards: card_lst,
                black_card:  this.commonBlackCard,
                black_card_type: this.blackCardType,
                player_list: this.playerList,//todo: remove player cards from getting to other players
                current_czar: this.currentCzarIndex
            };
        }

        /**
         * After a player chooses cards, add the cards to the list and remove them from hand
         * count how many players are ready and send which wait ended
         */
        if (data.header === RequestHeaders.REQUEST_CHOSE_CARD){
            console.log('[SERVER] Client id ' + data.player_id + ' chose card id: ' + data.card_id);
            if(this.playerList[playerIndex].type === PlayerTypes.PLAYER) {
                //iterate through the normal player selected cards
                for (let i = 0; i < this.blackCardType; i++) {
                    let cardIndex = this.playerList[playerIndex].cards.findIndex(card => card.id === data.cards[i].id);
                    if (cardIndex !== -1) {
                        this.selectedWhiteCards[playerIndex].push(this.playerList[playerIndex].cards[cardIndex]);
                        this.playerList[playerIndex].cards.filter(card => card.id === data.cards[i].id);
                    } else {
                        return {
                            error: 'Error'
                        }
                    }
                }
            }
            else {
                /**
                 * Generate the new black card for next round
                 * when czar chooses white card set index in the current round
                 */

                this.getBlackCard();

                if (data.choice < this.selectedWhiteCards.length){
                    this.winningCardSet = this.selectedWhiteCards[data.choice];
                    let foundOwner =  false;
                    this.playerList.forEach(player => {
                        //if we find all cards from the winning set in the players' hand then give him points
                        if(this.winningCardSet.every(card => player.cards.includes(card))){
                            player.points++;
                            foundOwner = true;
                            if (player.points >= this.maxPoints) {
                                this.winnerPlayer = player;
                                console.log('[SERVER] Winner set(id): ' + +player.id + '; points= ' + player.points);
                            }
                            console.log('[SERVER] Updated points for client id: ' + player.id + '; points= ' + player.points);
                        }
                    });
                    if (!foundOwner) {
                        return {//todo: error object
                            error: 'Error'
                        }
                    }
                }
                else{
                    return {
                        error: 'Error'
                    }
                }
            }

            this.readyPlayers++;

            if(this.readyPlayers === this.numberOfPlayers - 1){
                this.waitEnded_Players = true;

                // if czard is aistart ai choice ->
                //fetchAI(0, [1,2,45,6]).then( () => console.log("AICI AI-Ul intoarce optiunea aleasa si muta state-ul inainte adica ii dai un request"));
            }
            else if(this.readyPlayers === this.numberOfPlayers){
                this.waitEnded_Czar = true;
                this.currentCzarIndex = (this.currentCzarIndex + 1) % this.numberOfPlayers; //change czar here so it only happens once
                console.log('[SERVER] Set czar index: ' + this.currentCzarIndex);
            }

            //return the cards because we removed some from the players' hand
            return {
                header: RequestHeaders.RESPONSE_CHOSE_CARD,
                cards: this.playerList[playerIndex].cards,
            }
        }

        /**
         * Wait ended for players, send czar the selected cards array
         */
        if(data.header === RequestHeaders.REQUEST_WAIT_ENDED_PLAYERS){
            console.log('[SERVER] Client requested game status');
            return {
                header: RequestHeaders.RESPONSE_WAIT_ENDED_PLAYERS,
                selected_cards: this.selectedWhiteCards,
                wait_end: this.waitEnded_Players
            }
        }

        /**
         * Wait ended for czar, send winning card to players
         */
        if(data.header === RequestHeaders.REQUEST_WAIT_ENDED_CZAR){
            console.log('[SERVER] Client requested game status');
            return {
                header: RequestHeaders.RESPONSE_WAIT_ENDED_CZAR,
                wait_end: this.waitEnded_Czar,
                winning_cards: this.winningCardSet
            }
        }

        /**
         * Find the index for the client id then if winner is null:
         * reset data, determine if he is czar or not
         * if he is normal player, send a white card
         * if there is a winner set 'endGame' to true
         */
        if(data.header === RequestHeaders.REQUEST_END_ROUND) {
            console.log('[SERVER] Client id ' + data.player_id + ' requested end round');
            let returnObject = {};

            returnObject.winner_player = this.winnerPlayer;
            returnObject.common_black_card = this.commonBlackCard;
            returnObject.black_card_type = this.blackCardType;
            returnObject.current_czar = this.currentCzarIndex;
            returnObject.player_list = this.playerList; //todo: unsafe

            if (this.winnerPlayer === null) {
                console.log('[SERVER] Client id ' + data.player_id + ' has begun new round');
                this.resetData();

                if(playerIndex === this.currentCzarIndex){
                    this.playerList[playerIndex].type = PlayerTypes.CZAR;
                } else {
                    this.playerList[playerIndex].type = PlayerTypes.PLAYER;
                    let card = new Card(555, "White card", "Something...");
                    this.playerList[playerIndex].cards.push(card);
                    console.log(card);
                    returnObject.white_card = card;
                }

                //for each ai player
                //fetchAI(this.commonBlackCard, [0,0,0,0,0]).then((id) => this.response({header: RequestHeaders.REQUEST_CHOSE_CARD, card_id: id}));
            }

            returnObject.header = RequestHeaders.RESPONSE_END_ROUND;
            return returnObject;
        }

        return 'error';
    }
}

class GameClient {
    constructor(token) {
        this.id = token;

        this.cards = [];
        this.selectedWhiteCardSets = []; //cards selected by normal players
        this.commonBlackCard = null;
        this.blackCardType = 0;
        this.winningCard = null;

        this.points = 0;
        this.choice = []; //array with selected cards player
        this.type = PlayerTypes.PLAYER;

        this.playerList = [];
        this.playerIndex = -1;
        this.currentCzarIndex = null;
        this.winnerPlayer = null;

        this.state = GameStates.INITIAL;

        this.test = false;
    }

    update(data){//this will return maybe a response with accepted/invalid
        if (this.state === GameStates.CHOOSE_WHITE_CARD){
            console.log('Choosing white card');
            if (this.type === PlayerTypes.PLAYER) {
                if (data.card_index < this.cards.length) {
                    this.choice.push(this.cards[data.card_index].id);
                    if(this.blackCardType > 1)
                        this.choice.push(this.cards[data.card_index_second].id)
                    this.state = GameStates.CHOSEN_WHITE_CARD;
                }
            }
            else{ //czar chooses the index for a card set instead of individual cards
                if (data.card_index < this.selectedWhiteCardSets.length) {
                    this.choice = this.selectedWhiteCardSets[data.card_index];
                    this.state = GameStates.CHOSEN_WHITE_CARD;
                }
            }
        }

        if (this.state === GameStates.END_ROUND){
            console.log('Round ended');
        }

        if (this.state === GameStates.WAIT_FOR_PLAYERS){
            console.log('Waiting for other normal players to choose card');
        }

        if (this.state === GameStates.WAIT_FOR_CZAR){
            console.log('Waiting for czar to choose card');
        }

        if (this.state === GameStates.GAME_END){
            console.log('Game has ended');
            process.exit(0); //todo: remove this, only for testing
        }
    }

    getNecessaryData(){

        if (this.state === GameStates.INITIAL) {
            return {
                header: RequestHeaders.REQUEST_BEGIN_GAME,
                player_id: this.id
            }
        }

        if (this.state === GameStates.CHOSEN_WHITE_CARD){
            return {
                header: RequestHeaders.REQUEST_CHOSE_CARD,
                player_id: this.id,
                cards: this.choice,
            }
        }

        if (this.state === GameStates.WAIT_FOR_PLAYERS){
            return {
                header: RequestHeaders.REQUEST_WAIT_ENDED_PLAYERS,
                player_id: this.id
            }
        }

        if (this.state === GameStates.WAIT_FOR_CZAR) {
            return {
                header: RequestHeaders.REQUEST_WAIT_ENDED_CZAR,
                player_id: this.id
            }
        }

        if(this.state === GameStates.END_ROUND) {
            return {
                header: RequestHeaders.REQUEST_END_ROUND,
                player_id: this.id
            }
        }

        return 'error';
    }

    putData (data){

        console.log('[PID] ' + this.id);
        /**
         * Init white cards, black card, player list and type
         */
        if (this.state === GameStates.INITIAL && data.header === RequestHeaders.RESPONSE_BEGIN_GAME) {
            console.log('Received cards:', data.cards);
            this.cards = data.cards;
            this.commonBlackCard = data.black_card;
            this.blackCardType = data.black_card_type;
            this.playerList = data.player_list;
            this.currentCzarIndex = data.current_czar;
            this.playerIndex = this.playerList.findIndex(player => player.id === this.id);
            if(this.playerList[this.currentCzarIndex].id === this.id)
                this.type = PlayerTypes.CZAR;

            if(this.type === PlayerTypes.PLAYER) {
                this.state = GameStates.CHOOSE_WHITE_CARD;
            } else {
                this.state = GameStates.WAIT_FOR_PLAYERS;
            }

            return {
                header:'show_cards',
                cards: this.cards,
                black_card: this.commonBlackCard,
                black_card_type: this.blackCardType,
                player_list: this.playerList

            }
        }

        /**
         * White card choice behavior. If czar picks white, end round for czar.
         * If normal player picks white, remove card from list and set state to wait.
         */
        if(this.state === GameStates.CHOSEN_WHITE_CARD && data.header === RequestHeaders.RESPONSE_CHOSE_CARD){
            console.log('Player has chosen card set: ', data.cards);
            if(this.type === PlayerTypes.PLAYER) {
                this.state = GameStates.WAIT_FOR_CZAR;
                this.cards = data.cards;
            } else {
                this.state = GameStates.END_ROUND;
            }
            return {
                header: 'white_card_choice',
                cards: data.cards
            }
        }

        /**
         * When players are all ready, czar must choose a white card.
         * Also receive the array with cards that the players chose.
         */
        if(this.state === GameStates.WAIT_FOR_PLAYERS && data.header === RequestHeaders.RESPONSE_WAIT_ENDED_PLAYERS){
            console.log('Wait ended for czar, time to choose white card');
            if(data.wait_end === true){
                this.state = GameStates.CHOOSE_WHITE_CARD;
                this.selectedWhiteCards = data.selected_cards;

                return {
                    header: 'czar_allow_white_card_choice',
                    selected_cards: this.selectedWhiteCards
                }
            }

            return {
                header: 'not_yet_ended_wait'
            }
        }

        /**
         * When czar has chosen the card, end round for player and show him the winning card.
         * If the player choice is the winning card, then give him a point.
         */
        if(this.state === GameStates.WAIT_FOR_CZAR && data.header === RequestHeaders.RESPONSE_WAIT_ENDED_CZAR){
            if(data.wait_end === true) {
                console.log('Wait ended for normal players, time to end round');
                this.winningCard  = data.winning_card;
                this.state = GameStates.END_ROUND;

                return {
                    header: 'player_round_end',
                    winning_card: this.winningCard
                }
            }

            return {
                header: 'not_yet_ended_wait'
            }
        }

        /**
         * After all players updated the points, we need to check if anyone won.
         */
        if(this.state === GameStates.END_ROUND && data.header === RequestHeaders.RESPONSE_END_ROUND) {
            this.playerList = data.player_list;
            if (data.winner_player !== null) {
                this.winnerPlayer = data.winner_player;
                this.state = GameStates.GAME_END;
                return {
                    header: 'game_has_ended',
                    player_list: this.playerList
                }
            }

            this.type = this.playerList[this.playerIndex].type;
            this.choice = [];
            this.selectedWhiteCards = [];
            this.commonBlackCard = data.black_card;
            this.blackCardType = data.black_card_type;
            this.currentCzarIndex = data.current_czar;

            if (this.type === PlayerTypes.PLAYER) {
                console.log('Received card: ', data.white_card);
                this.cards.push(data.white_card);
                this.state = GameStates.CHOOSE_WHITE_CARD;
                this.test = true;
                return {
                    header: 'new_round_for_normal_player',
                    player_list: this.playerList
                };
            } else {
                this.state = GameStates.WAIT_FOR_PLAYERS;

                return {
                    header: 'wait_for_players',
                    player_list: this.playerList
                };
            }
        }

        return 'error';
    }
}

function getRandomString() {
    return Array(1).fill(null).map(() => Math.random().toString(36).substr(2)).join('')
}
//TODO: sincronizat playerlist
//TODO: add development option to hide all console logs
//TODO: for every request check if error field is present
// module.exports.[ce nume vrei sa aibe in afara filei] = [variabila/functia/clasa din fila]
module.exports.RequestHeaders = RequestHeaders;
module.exports.GameStates = GameStates;
module.exports.Card = Card;
module.exports.GameManager = GameManager;
module.exports.GameClient = GameClient;
module.exports.getRandomString= getRandomString;
