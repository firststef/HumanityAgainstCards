const basedata=require('./basedata');
const fetch = require('node-fetch');

// returns a set from the cards, or null if error
async function fetchAIAnswer(blackCard, blackCardType, listOfCards){
    let blackCardArray = [];
    let whiteCards = listOfCards.map(arr => { return arr.map(card => {return {'_id': card.id, 'text': ''}})});
    let black_card = {
        _id : blackCard.id,
        text: blackCard.text,
        pick: blackCardType
    };
    blackCardArray.push(black_card);

    let bodyreq = {
        'black_card': blackCardArray,
        'white_cards': whiteCards
    };
    console.log(bodyreq);

    try {
        let response = await fetch('http://localhost:8081/ai/sendCards', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyreq)
        });
        let data = await response.json();
        //console.log(data);

        if (data.success === true) {
            //console.log("ddata", data.response);
            return data.response.map(card => {return {
                'id': card._id,
                'text': listOfCards.filter(s=> s.filter(c => c.id === card._id).length === 1)[0].filter(c => c.id === card._id)[0].text
            }});
        } else {
            console.log('Error: fetch /ai/sendCards failed -- ', data);
            return null;
        }
    }
    catch (e) {
        console.log('Fatal error -- ', e);
        return null;
    }
}

async function fetchBlackCard(){
    let card = {
        id: -1,
        text: '',
        type: 1
    };
    let response = await fetch('http://localhost:8081/get_black_card', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let data = await response.json();

    if(data.success === true) {
        card.id = parseInt(data.card._id);
        card.text = data.card.text;
        card.type = parseInt(data.card.pick);
    } else {
        console.log('Error: fetch /get_black_card failed -- ', data.error);
    }

    return card;
}

async function fetchWhiteCards(cardCount){
    let cardList = []
    let response = await fetch('http://localhost:8081/get_white_cards/' + cardCount, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
    });

    let data = await response.json();

    if(data.success === true) {
        cardList = data.cards;
    } else {
        console.log('Error: fetch /get_white_cards failed -- ', data.error);
    }

    return cardList;
}

async function fetchEndGame(roomID, sid){
    let res = await fetch('http://localhost:8081/end_game', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            session: sid
        },
        body: JSON.stringify({roomID: roomID})
    });
    res = await res.json();
    if (res.success !== true){
        console.log('Failed to send end game on room '+ roomID);
    }
}

class GameManager {
    constructor(roomID, players, numberOfAIPlayers, host) { //should actually be initialized with a gameId, created by looking at the db, assuring it is unique
        this.waitEnded_Players = false;
        this.waitEnded_Czar = false;

        this.roomID = roomID;
        this.host = host;
        this.players = players;
        this.numberOfPlayers = players.length;
        this.numberOfAIPlayers = numberOfAIPlayers;
        this.readyPlayers = 0;
        this.playerList = [];
        this.usedWhiteCardIds = [];
        this.usedBlackCardIds = [];

        this.currentCzarIndex = null;
        this.commonBlackCard = null;
        this.blackCardType = 0;
        this.selectedWhiteCards = []; //cards selected by normal players; index in this array represents player index
        this.winningCardSet = []; //cards chosen by czar
        this.winnerPlayer = null;
        this.maxPoints = 2; //2 is set just for cycle preview; get value from room settings

        this.init();
    }

    init(){
        this.players.forEach((pl) => {
            let player = new basedata.Player(pl.sid, pl.username);
            player.ai = false;
            this.playerList.push(player);
        });
        //init ai players
        for (let i = 1; i <= this.numberOfAIPlayers; i++){
            let player = new basedata.Player(i * (-1), "AIplayer");
            player.ai = true;
            this.playerList.push(player);
        }
        //init selected cards array for each player
        for(let i=0; i < this.getAllPlayerCount(); i++) {
            this.selectedWhiteCards[i] = new Array(3);
        }

        this.currentCzarIndex = Math.floor((Math.random() * 1000) % (this.getAllPlayerCount()));
        this.changePlayerTypes();
        let thisRef = this;
        setTimeout(async () => {
            await this.setNewBlackCard();

            //init ai players
            for (let player of thisRef.playerList){
                if (player.ai === true){
                    for (let i = 0; i < 10; i++){
                        let card = await this.getWhiteCard();
                        player.cards.push(card);
                    }
                }
            }

            await this.makeAiPlayerChoices();
        }, 1);
    }

    async setNewBlackCard(){
        let card = await fetchBlackCard();
        if(card.id !== -1) {
            if (!this.usedBlackCardIds.includes(card.id)){
                this.commonBlackCard = new basedata.Card(card.id, card.text);
                this.blackCardType = card.type;
                this.usedBlackCardIds.push(card.id);
            }
            else {
                await this.setNewBlackCard();
            }
        }
    }

    async getWhiteCard() {
        let data = await fetchWhiteCards(1);
        if (data.length !== 0) {
            if (!this.usedWhiteCardIds.includes(data[0]._id)){
                this.usedWhiteCardIds.push(data[0]._id);
                return new basedata.Card(data[0]._id, data[0].text);
            } else {
                return await this.getWhiteCard();
            }
        }
    }

    getCleanPlayerList(playerId, playerIndex){
        //this is done to avoid showing other players' cards
        let cleanPlayerList = [];
        this.playerList.forEach((player)=> {
            let playerObj = {
                name: player.name,
                points: player.points,
                type: player.type
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
        if (this.winningCardSet.every(card => player.cards.some(c => JSON.stringify(c) === JSON.stringify(card)))) {
            player.points++;
            this.round_winner_player = player;
            if (player.points >= this.maxPoints) {
                this.winnerPlayer = player;
                //('[SERVER] Winner set(id): ' + +player.id + '; points= ' + player.points);
            }
            return true;
            //console.log('[SERVER] Updated points for client id: ' + player.id + '; points= ' + player.points);
        }
        return false;
    }

    async removeCardsFromPlayer(player){
        for (let i = 0; i < this.blackCardType; i++) {
            let tempPlayerIndex = this.playerList.findIndex(p => p.id === player.id);
            let cardIndex = player.cards.findIndex(card => card.id === this.selectedWhiteCards[tempPlayerIndex][i].id);

            //remove a white card and give a new one back
            if (cardIndex !== -1) {
                player.cards.splice(cardIndex, 1);
                player.cards.push(await this.getWhiteCard());
            }
            else {
                console.log("Error: Card for remove not found");
            }
        }
    }

    async makeAiPlayerChoices(){
        let thisRef = this;
        console.log('Called makeAiPlayerChoices');
        for (let player of this.playerList) {
            if(player.ai === true && player.type === basedata.PlayerTypes.PLAYER){
                let permutations = basedata.generateCombinations(player.cards, this.blackCardType);
                console.log('[AI] Called ai ' + player.id + ' choice');
                let cards = [];
                for (let card of player.cards){
                    if (card !== null){
                        cards.push([card]);
                    }
                }
                let data = await fetchAIAnswer(this.commonBlackCard, this.blackCardType, cards);
                if (data == null || !data.every(card => player.cards.some(c => JSON.stringify(c) === JSON.stringify(card)))){
                    console.log('[AI ERROR]: AI request returned with index out of bonds');
                    setTimeout(() => thisRef.response({
                        player_id: player.id,
                        header: basedata.RequestHeaders.REQUEST_CHOSE_CARD,
                        cards: permutations[Math.floor((Math.random() * 1000) % permutations.length)]
                    }), 1);
                }
                else{
                    console.log('ai has chosen ' + JSON.stringify(data));
                    setTimeout(() => thisRef.response({
                        player_id: player.id,
                        header: basedata.RequestHeaders.REQUEST_CHOSE_CARD,
                        cards: data
                    }), 1);
                }
            }
        }
    }

    async makeAICzarChoices(){
        //AI Czar choice
        console.log('Called makeAiPlayerChoices');
        let thisRef = this;
        for (let player of this.playerList) {
            if(player.ai === true && player.type === basedata.PlayerTypes.CZAR){
                console.log('[AI] Called czar choice');
                let set = [];
                let randomNonNullSet = -1;
                let i = 0;
                for (let cards of this.selectedWhiteCards){
                    let filtered = [];
                    for (let card of cards){
                        if (card !== undefined && card !== null){
                            filtered.push(card);
                        }
                    }
                    if (filtered.length > 0)
                    {
                        randomNonNullSet = i;
                        set.push(filtered);
                    }
                    i++;
                }
                let data = await fetchAIAnswer(this.commonBlackCard, this.blackCardType, set);
                let index;
                if (data != null){
                    index = set.findIndex(mul => JSON.stringify(mul) === JSON.stringify(data));
                }
                if (data === null || index === -1){
                    console.log('[AI ERROR]: AI request returned with index out of bonds');
                    setTimeout(() => thisRef.response({
                        player_id: player.id,
                        header: basedata.RequestHeaders.REQUEST_CHOSE_CARD,
                        cards: randomNonNullSet
                    }), 1);
                }
                else{
                    console.log('czar ai has chosen ' + JSON.stringify(thisRef.selectedWhiteCards[index]));
                    setTimeout(() => thisRef.response({
                        player_id: player.id,
                        header: basedata.RequestHeaders.REQUEST_CHOSE_CARD,
                        cards: index
                    }), 1);
                }

                break;
            }
        }
    }

    async setWinningCardSet(cardSetIndex){
        this.winningCardSet = this.selectedWhiteCards[cardSetIndex];
        let foundOwner = false;
        for (let player of this.playerList){
            if(player.type !== basedata.PlayerTypes.CZAR) {
                if(foundOwner === false)
                    foundOwner = this.checkWinningCards(player);
                await this.removeCardsFromPlayer(player);
            }
        }

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

    endGame(){
        setTimeout(() => fetchEndGame(this.roomID, this.host), 1);
    }

    /**=======Server request handling=======**/

    async response(data){
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
            for (let i = 0; i < 10; i++){
                let card = await this.getWhiteCard();
                if (this.playerList[playerIndex].cards.length < 10){
                    this.playerList[playerIndex].cards.push(card);
                }
            }

            if (this.commonBlackCard === null){
                await this.setNewBlackCard();
            }

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
                    if (this.winningCardSet.length === 0 &&!await this.setWinningCardSet(data.cards)) {
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

            this.readyPlayers = this.selectedWhiteCards.filter(set => {return set.filter(card => card !== null).length > 0 }).length +
                this.waitEnded_Players;

            if (this.waitEnded_Players === false && this.readyPlayers === this.getAllPlayerCount() - 1) {
                this.waitEnded_Players = true;

                //AI Czar choice
                if (this.playerList[playerIndex].type === basedata.PlayerTypes.PLAYER) { //only the players could trigger this
                    setTimeout(() => this.makeAICzarChoices(),1);
                }
            } else if(this.readyPlayers === this.getAllPlayerCount()){
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
                winning_cards: this.winningCardSet,
                winner_player_n:  this.round_winner_player.name,
                is_winner_ai: this.round_winner_player ? this.round_winner_player.ai : undefined
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
                //condition so that the methods are called only once per round
                if (this.readyPlayers === this.getAllPlayerCount()) {
                    this.resetData();
                    this.changeCzarIndex();
                    this.changePlayerTypes();
                    await this.setNewBlackCard();
                    setTimeout(() => this.makeAiPlayerChoices(), 1);
                }
            }
            else{
                this.endGame();
            }

            return {
                header: basedata.RequestHeaders.RESPONSE_END_ROUND,
                winner_player: this.winnerPlayer,
                cards: this.playerList[playerIndex].cards,
                black_card: this.commonBlackCard,
                black_card_type: this.blackCardType,
                current_czar: this.currentCzarIndex,
                player_list: this.getCleanPlayerList(data.player_id, playerIndex),
                winning_cards: this.winningCardSet,
                winner_player_n:  this.round_winner_player ? this.round_winner_player.name : undefined,
                absolute_winner_n: this.winnerPlayer ? this.winnerPlayer.name : undefined,
                is_winner_ai: this.round_winner_player ? this.round_winner_player.ai : undefined,
                is_absolute_winner_ai: this.winnerPlayer ? this.winnerPlayer.ai : undefined,
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