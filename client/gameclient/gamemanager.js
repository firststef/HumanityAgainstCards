const basedata=require('./basedata');

function fetchAI(blackCard, listOfCards){
    return {
        then: (func) => func(listOfCards[0])
    };
}

class GameManager {
    constructor(numberOfPlayers, numberOfAIPlayers, playerIDList) { //should actually be initialized with a gameId, created by looking at the db, assuring it is unique
        this.waitEnded_Players = false;
        this.waitEnded_Czar = false;

        this.numberOfPlayers = numberOfPlayers;
        this.numberOfAIPlayers = numberOfAIPlayers;
        this.readyPlayers = 0;
        this.playerList = [];

        this.currentCzarIndex = null;
        this.commonBlackCard = null;
        this.blackCardType = 0;
        this.selectedWhiteCards = []; //cards selected by normal players; index in this array represents player index
        this.winningCardSet = []; //card chosen by czar
        this.winnerPlayer = null;

        this.maxPoints = 2; //2 is set just for cycle preview -- use higher values

        this.timeOut = 5; //seconds to wait for card choice
        this.elapsedTime = 0;
        this.timerHandle = null;
        this.timerStart = 0;

        playerIDList.forEach((pid) => this.playerList.push(new basedata.Player(pid)));
        //here add foreach ai player an ai player with a flag and unique id for ai

        //init selected cards array for each player
        for(let i=0; i < this.numberOfPlayers + this.numberOfAIPlayers; i++) {
            this.selectedWhiteCards[i] = new Array(3);
        }
    }

    timerStep(){
        this.elapsedTime = (Date.now() - this.timerStart)/1000;
        console.log(this.elapsedTime);
        if (this.elapsedTime >= this.timeOut){
            if(this.waitEnded_Players === false && this.waitEnded_Czar === false){
                this.waitEnded_Players = true;
            } else if (this.waitEnded_Players === true && this.waitEnded_Czar === false){
                this.waitEnded_Czar = true;
            }
            this.stopTimer();
        }
    }

    startTimer(){
        this.timerStart = Date.now();
        this.timerHandle = setInterval(this.timerStep.bind(this), 1000);
    }

    stopTimer(){
        clearInterval(this.timerHandle);
        this.timerHandle = null;
    }

    getBlackCard(){
        //todo: request card
        this.commonBlackCard = new basedata.Card(999, 'Some black card text');
        this.blackCardType = 2;
    }

    resetData(){
        this.readyPlayers = 0;
        this.selectedWhiteCards = [];
        for(let i=0; i < this.numberOfPlayers + this.numberOfAIPlayers; i++) {
            this.selectedWhiteCards[i] = new Array(3);
        }
        this.winningCardSet = [];
        this.waitEnded_Players = false;
        this.waitEnded_Czar = false;
    }

    response(data){//TODO: in server === 'error' should be consistent
        let playerIndex = this.playerList.findIndex(player => player.id === data.player_id);
        if (playerIndex === -1){
            console.log('[SERVER] Error on player index: ' + playerIndex);
            return {
                error: 'Error on player index'
            }
        }

        /**
         * Give the player a set of white cards, the common black card, player list and whoever is the czar
         */
        if (data.header === basedata.RequestHeaders.REQUEST_BEGIN_GAME){
            let card_lst = [];
            //these are random but they need to be taken from a db
            // - we will get the number of cards in the database
            // - each used id will be put in usedCards[]
            // - each client gets a unique set of id's (Cards)
            if (this.generateCardId === undefined){ //will be replaced with actual cards
                this.generateCardId = 0;
            }

            [...Array(10).keys()].forEach((x) => {
                let card = new basedata.Card(this.generateCardId, getRandomString());
                this.generateCardId++;
                card_lst.push(card);
                this.playerList[playerIndex].cards.push(card);
            });

            this.getBlackCard();

            if(this.currentCzarIndex === null) {
                this.currentCzarIndex = Math.floor((Math.random() * 1000) % (this.numberOfPlayers + this.numberOfAIPlayers));
            }
            this.playerList.forEach(player => {
                if(this.playerList[this.currentCzarIndex].id === player.id) {
                    player.type = basedata.PlayerTypes.CZAR; //CZAR
                } else {
                    player.type = basedata.PlayerTypes.PLAYER;
                }
            });

            if(this.timerHandle === null){
                this.startTimer();
            }

            return {
                header: basedata.RequestHeaders.RESPONSE_BEGIN_GAME,
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
        if (data.header === basedata.RequestHeaders.REQUEST_CHOSE_CARD){
            console.log('[SERVER] Client id ' + data.player_id + ' chose cards: ' + data.cards);
            if(this.playerList[playerIndex].type === basedata.PlayerTypes.PLAYER) {
                if(data.cards.length === 0){
                    this.playerList[playerIndex].timedout = true;
                    return {
                        header: basedata.RequestHeaders.RESPONSE_CHOSE_CARD,
                        cards: [],
                    }
                }
                //iterate through the normal player selected cards
                for (let i = 0; i < this.blackCardType; i++) {
                    let cardIndex = this.playerList[playerIndex].cards.findIndex(card => card.id === data.cards[i].id);
                    if (cardIndex !== -1) {
                        this.selectedWhiteCards[playerIndex][i] = (this.playerList[playerIndex].cards[cardIndex]);
                    } else {
                        return {
                            error: 'Error on card index in REQUEST_CHOSE_CARD - normal player'
                        }
                    }
                }
            }
            else {
                /**
                 * Generate the new black card for next round
                 * when czar chooses white card set index in the current round
                 */

                //if czar chose nothing, move on
                if(data.cards.length === 0){
                    this.playerList[playerIndex].timedout = true;
                    this.winningCardSet = [];
                    this.waitEnded_Czar = true;
                    this.currentCzarIndex = (this.currentCzarIndex + 1) % this.numberOfPlayers;
                    return {
                        header: basedata.RequestHeaders.RESPONSE_CHOSE_CARD,
                        cards: [],
                    }
                }

                //for czar, data.cards is the index in selectedWhiteCards
                if (data.cards < this.selectedWhiteCards.length){
                    this.winningCardSet = this.selectedWhiteCards[data.cards];
                    let foundOwner =  false;
                    this.playerList.forEach(player => {
                        if(player.type !== basedata.PlayerTypes.CZAR) {
                            //if we find all cards from the winning set in the players' hand then give him points
                            if (this.winningCardSet.every(card => player.cards.includes(card))) {
                                player.points++;
                                foundOwner = true;
                                if (player.points >= this.maxPoints) {
                                    this.winnerPlayer = player;
                                    console.log('[SERVER] Winner set(id): ' + +player.id + '; points= ' + player.points);
                                }
                                console.log('[SERVER] Updated points for client id: ' + player.id + '; points= ' + player.points);
                            }
                            //from every player delete the cards he used
                            for (let i = 0; i < this.blackCardType; i++) {
                                let tempPlayerIndex = this.playerList.findIndex(p => p.id === player.id);
                                let cardIndex = player.cards.findIndex(card => card.id === this.selectedWhiteCards[tempPlayerIndex][i].id);
                                if (cardIndex !== -1) {
                                    player.cards.splice(cardIndex, 1);
                                }
                                else
                                {
                                    console.log("Card not found");
                                }
                            }
                        }


                    });
                    if (!foundOwner) {
                        return {//todo: error object
                            error: 'Error - invalid owner'
                        }
                    }
                }
                else{
                    return {
                        error: 'Error - selected index outside selectedWhiteCards range'
                    }
                }
                //because of the deleted cards we mut put getBlackCard() at the end;
                this.getBlackCard();
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
            }


            return {
                header: basedata.RequestHeaders.RESPONSE_CHOSE_CARD,
                cards: data.cards,
            }
        }

        /**
         * Wait ended for players, send czar the selected cards array
         */
        if(data.header === basedata.RequestHeaders.REQUEST_WAIT_ENDED_PLAYERS){
            console.log('[SERVER] Client requested game status');
            //start timer for czar
            if(this.waitEnded_Players === true){
                if(this.timerHandle === null){
                    this.startTimer();
                }
            }
            return {
                header: basedata.RequestHeaders.RESPONSE_WAIT_ENDED_PLAYERS,
                selected_cards: this.selectedWhiteCards,
                wait_end: this.waitEnded_Players
            }
        }

        /**
         * Wait ended for czar, send winning card to players
         */
        if(data.header === basedata.RequestHeaders.REQUEST_WAIT_ENDED_CZAR){
            console.log('[SERVER] Client requested game status');
            return {
                header: basedata.RequestHeaders.RESPONSE_WAIT_ENDED_CZAR,
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
        if(data.header === basedata.RequestHeaders.REQUEST_END_ROUND) {
            console.log('[SERVER] Client id ' + data.player_id + ' requested end round');

            let returnObject = {};

            returnObject.winner_player = this.winnerPlayer;
            returnObject.common_black_card = this.commonBlackCard;
            returnObject.black_card_type = this.blackCardType;
            returnObject.current_czar = this.currentCzarIndex;
            returnObject.cards = this.playerList[playerIndex].cards;
            returnObject.player_list = this.playerList; //todo: unsafe

            if (this.winnerPlayer === null) {
                console.log('[SERVER] Client id ' + data.player_id + ' has begun new round');
                this.resetData();

                if(this.timerHandle === null){
                    this.startTimer();
                }

                if(playerIndex === this.currentCzarIndex){
                    console.log('Player id ' + this.playerList[playerIndex].id + ' is czar');
                    this.playerList[playerIndex].type = basedata.PlayerTypes.CZAR;
                } else {
                    this.playerList[playerIndex].type = basedata.PlayerTypes.PLAYER;
                    let card = null;
                    //request white card here
                    if(this.playerList[playerIndex].timedout === false) {
                        card = new basedata.Card(555, "Something...");
                    }
                    this.playerList[playerIndex].timedout = false;
                    this.playerList[playerIndex].cards.push(card);
                    console.log(card);
                    returnObject.white_card = card;
                }

                //for each ai player
                //fetchAI(this.commonBlackCard, [0,0,0,0,0]).then((id) => this.response({header: basedata.RequestHeaders.REQUEST_CHOSE_CARD, card_id: id}));
            }

            returnObject.header = basedata.RequestHeaders.RESPONSE_END_ROUND;
            return returnObject;
        }

        return 'error';
    }
}
function getRandomString() {
    return Array(1).fill(null).map(() => Math.random().toString(36).substr(2)).join('')
}

module.exports.GameManager = GameManager;
module.exports.fetchAI=fetchAI;
