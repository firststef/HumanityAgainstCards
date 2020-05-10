const basedata=require('./basedata');

function fetchAI(blackCard, listOfCards){
    return {
        then: (func) => func(listOfCards[0])
    };
}

class GameManager {
    constructor(numberOfPlayers, numberOfAIPlayers, playerIDList, roomID) { //should actually be initialized with a gameId, created by looking at the db, assuring it is unique
        this.waitEnded_Players = false;
        this.waitEnded_Czar = false;

        this.numberOfPlayers = numberOfPlayers;
        this.numberOfAIPlayers = numberOfAIPlayers;
        this.playerIDList = playerIDList;
        this.readyPlayers = 0;
        this.playerList = [];

        this.currentCzarIndex = null;
        this.commonBlackCard = null;
        this.blackCardType = 0;
        this.selectedWhiteCards = []; //cards selected by normal players; index in this array represents player index
        this.generateCardId = 0;
        this.winningCardSet = []; //cards chosen by czar
        this.winnerPlayer = null;

        this.maxPoints = 2; //2 is set just for cycle preview; get value from room settings

        this.init();
    }

    init(){
        //init ai players
        this.playerIDList.forEach((pid) => this.playerList.push(new basedata.Player(pid, "player")));
        for (let i = 0; i < this.numberOfAIPlayers; i++){
            this.playerList.push(new basedata.Player(i, "ai"));
        }
        //init selected cards array for each player
        for(let i=0; i < this.getAllPlayerCount(); i++) {
            this.selectedWhiteCards[i] = new Array(3);
        }

        this.currentCzarIndex = Math.floor((Math.random() * 1000) % (this.getAllPlayerCount()));
        this.changePlayerTypes();
        this.setNewBlackCard();
    }

    setNewBlackCard(){
        //todo: request card
        this.commonBlackCard = new basedata.Card(999, 'Black card');
        this.blackCardType = Math.ceil(Math.random() * 3);
    }

    getWhiteCard(){
        //todo: request card
        let card = new basedata.Card(this.generateCardId, getRandomString());
        this.generateCardId++;
        return card;
    }

    setBeginningWhiteCards(playerIndex){
        /*these are random but they need to be taken from a db
             - we will get the number of cards in the database
             - each used id will be put in usedCards[]
             - each client gets a unique set of id's (Cards)*/
        if (this.generateCardId === undefined){ //will be replaced with actual cards
            this.generateCardId = 0;
        }
        [...Array(10).keys()].forEach(() => {
            let card = this.getWhiteCard();
            this.generateCardId++;
            this.playerList[playerIndex].cards.push(card);
        });
    }

    getCleanPlayerList(playerId, playerIndex){
        //this is done to avoid showing other players' cards
        let cleanPlayerList = [];
        this.playerList.forEach((player)=> {
            let playerObj = {
                name: player.name,
                points: player.points
            };
            if (player.id === playerId){
                playerObj.id = player.id;
                playerObj.type = player.type;
                playerObj.cards = this.playerList[playerIndex].cards;
            }
            cleanPlayerList.push(playerObj);
        });
        return cleanPlayerList;
    }

    getAllPlayerCount(){
        return this.numberOfAIPlayers + this.numberOfPlayers;
    }

    changeCzarIndex(){
        this.currentCzarIndex = (this.currentCzarIndex + 1) % (this.getAllPlayerCount());
    }

    changePlayerTypes(){
        this.playerList.forEach(player => {
            if(this.playerList[this.currentCzarIndex].id === player.id) {
                player.type = basedata.PlayerTypes.CZAR;
            } else {
                player.type = basedata.PlayerTypes.PLAYER;
            }
        });
    }

    addToSelectedCardSets(playerIndex, selectedCards){
        //will return false if a card id was not found
        for (let i = 0; i < this.blackCardType; i++) {
            let cardIndex = this.playerList[playerIndex].cards.findIndex(card => card.id === selectedCards[i].id);
            if (cardIndex !== -1) {
                this.selectedWhiteCards[playerIndex][i] = (this.playerList[playerIndex].cards[cardIndex]);
            } else {
                return false;
            }
        }
        return true;
    }

    checkWinningCards(player){
        //if all cards from the winning set are in the players' hand then give him points
        if (this.winningCardSet.every(card => player.cards.includes(card))) {
            player.points++;
            if (player.points >= this.maxPoints) {
                this.winnerPlayer = player;
                //('[SERVER] Winner set(id): ' + +player.id + '; points= ' + player.points);
            }
            return true;
            //console.log('[SERVER] Updated points for client id: ' + player.id + '; points= ' + player.points);
        }
        return false;
    }


    removeCardsFromPlayer(player){
        for (let i = 0; i < this.blackCardType; i++) {
            let tempPlayerIndex = this.playerList.findIndex(p => p.id === player.id);
            let cardIndex = player.cards.findIndex(card => card.id === this.selectedWhiteCards[tempPlayerIndex][i].id);

            //remove a white card and give a new one back
            if (cardIndex !== -1) {
                player.cards.splice(cardIndex, 1);
                player.cards.push(this.getWhiteCard());
            }
            else {
                console.log("Error: Card for remove not found");
            }
        }
    }

    setWinningCardSet(cardSetIndex){
        this.winningCardSet = this.selectedWhiteCards[cardSetIndex];
        let foundOwner = false;
        this.playerList.forEach(player => {
            if(player.type !== basedata.PlayerTypes.CZAR) {
                if(foundOwner === false)
                    foundOwner = this.checkWinningCards(player);
                this.removeCardsFromPlayer(player);
            }
        });
        return foundOwner;
    }

    resetData(){
        this.readyPlayers = 0;
        this.selectedWhiteCards = [];
        for(let i=0; i < this.getAllPlayerCount(); i++) {
            this.selectedWhiteCards[i] = new Array(3);
        }
        this.winningCardSet = [];
        this.waitEnded_Players = false;
        this.waitEnded_Czar = false;
    }


    /**=======Server request handling=======**/

    response(data){
        let playerIndex = this.playerList.findIndex(player => player.id === data.player_id);
        if (playerIndex === -1){
            //console.log('[SERVER] Error on player index: ' + playerIndex);
            return {
                error: 'Error: Invalid player index'
            }
        }

        /**
         * Get initial cards for player and send initial game data
         *
         * data: player_id
         */
        if (data.header === basedata.RequestHeaders.REQUEST_BEGIN_GAME){
            this.setBeginningWhiteCards(playerIndex);

            return {
                header: basedata.RequestHeaders.RESPONSE_BEGIN_GAME,
                cards: this.playerList[playerIndex].cards,
                black_card:  this.commonBlackCard,
                black_card_type: this.blackCardType,
                player_list: this.getCleanPlayerList(data.player_id, playerIndex),
                current_czar: this.currentCzarIndex
            };
        }


        /**
         * After a player chooses cards, add the cards to the list and remove them from hand
         * count how many players are ready and send which wait ended
         *
         * data: cards[], player_id
         */
        if (data.header === basedata.RequestHeaders.REQUEST_CHOSE_CARD){
            //console.log('[SERVER] Client id ' + data.player_id + ' chose cards: ' + data.cards);
            if(this.playerList[playerIndex].type === basedata.PlayerTypes.PLAYER) {
                if(!this.addToSelectedCardSets(playerIndex, data.cards)) {
                    return {
                        error: 'Error: invalid card index selected by normal player'
                    }
                }
            } else {
                //for czar, data.cards is the index in selectedWhiteCards
                if (data.cards < this.selectedWhiteCards.length){
                    if (!this.setWinningCardSet(data.cards)) {
                        return {
                            error: 'Error: invalid card set index selected by czar'
                        }
                    }
                } else {
                    return {
                        error: 'Error: selected index outside selectedWhiteCards range'
                    }
                }
            }

            this.readyPlayers++;

            if(this.readyPlayers === this.numberOfPlayers - 1){
                this.waitEnded_Players = true;
                // if czard is ai start ai choice ->
                //fetchAI(0, [1,2,45,6]).then( () => console.log("AICI AI-Ul intoarce optiunea aleasa si muta state-ul inainte adica ii dai un request"));

                //fetchAI(this.commonBlackCard, player.cards)
                //.then((id) => this.response({header: basedata.RequestHeaders.REQUEST_CHOSE_CARD, player_id, cards: selectedWhiteCards]}));
                //in this.response se modifica player.cards -> var locala
                //trainAI
            } else if(this.readyPlayers === this.numberOfPlayers){
                this.waitEnded_Czar = true;
            }

            return {
                header: basedata.RequestHeaders.RESPONSE_CHOSE_CARD,
                cards: data.cards,
            }
        }

        /**
         * Wait ended for players, send czar the selected cards array
         *
         * data: player_id
         */
        if(data.header === basedata.RequestHeaders.REQUEST_WAIT_ENDED_PLAYERS){
            //console.log('[SERVER] Client requested game status');
            return {
                header: basedata.RequestHeaders.RESPONSE_WAIT_ENDED_PLAYERS,
                selected_cards: this.selectedWhiteCards,
                wait_end: this.waitEnded_Players
            }
        }

        /**
         * Wait ended for czar, send winning cards to players
         *
         * data: player_id
         */
        if(data.header === basedata.RequestHeaders.REQUEST_WAIT_ENDED_CZAR){
            //console.log('[SERVER] Client requested game status');
            return {
                header: basedata.RequestHeaders.RESPONSE_WAIT_ENDED_CZAR,
                wait_end: this.waitEnded_Czar,
                selected_cards: this.selectedWhiteCards,
                winning_cards: this.winningCardSet
            }
        }

        /**
         * Note: this is requested from every player
         * If winner is null: reset data, change czar, get new black card
         * When winner is NOT null, the game has ended
         *
         * data: player_id
         */
        if (data.header === basedata.RequestHeaders.REQUEST_END_ROUND) {
            //console.log('[SERVER] Client id ' + data.player_id + ' requested end round');
            if (this.winnerPlayer === null) {
                //console.log('[SERVER] Client id ' + data.player_id + ' has begun new round');

                //condition so that the methods are called only once per round
                if (this.readyPlayers === this.getAllPlayerCount()) {
                    this.resetData();
                    this.changeCzarIndex();
                    this.changePlayerTypes();
                    this.setNewBlackCard();
                }

                //for each ai player
                //fetchAI(this.commonBlackCard, player.cards)
                //.then((id) => this.response({header: basedata.RequestHeaders.REQUEST_CHOSE_CARD, player_id, cards: [...]]}));
                //in this.response se modifica player.cards -> var locala
                //trainAI
            }

            return {
                header: basedata.RequestHeaders.RESPONSE_END_ROUND,
                winner_player: this.winnerPlayer,
                cards: this.playerList[playerIndex].cards,
                black_card: this.commonBlackCard,
                black_card_type: this.blackCardType,
                current_czar: this.currentCzarIndex,
                player_list: this.getCleanPlayerList(data.player_id, playerIndex)
            }
        }
        /**
         * data: player_id
         **/
        if (data.header === basedata.RequestHeaders.REQUEST_EMPTY){
            return {
                selected_cards: this.selectedWhiteCards,
                header: basedata.RequestHeaders.RESPONSE_EMPTY
            }
        }

        return {
            error: 'Error: Header unknown'
        };
    }
}
function getRandomString() {
    return Array(1).fill(null).map(() => Math.random().toString(36).substr(2)).join('')
}

module.exports.GameManager = GameManager;
module.exports.fetchAI=fetchAI;
