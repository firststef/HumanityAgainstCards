const basedata=require('../../server/gamecore/basedata');

/** Momentan reprezinta un singur joc, e treaba backend-ului sa aiba grija de apelurile catre fiecare obiect GameManager sa fie facut corect */

class GameClient {
    constructor(token) {
        this.id = token;

        this.cards = [];
        this.selectedWhiteCardSets = []; //cards selected by normal players
        this.commonBlackCard = null;
        this.blackCardType = 0;
        this.winningCardSet = null;

        this.points = 0;
        this.choice = null; //array with selected cards player
        this.type = basedata.PlayerTypes.PLAYER;

        this.playerList = [];
        this.playerIndex = -1;
        this.currentCzarIndex = null;
        this.winnerPlayer = null;
        this.state = basedata.GameStates.INITIAL;
    }

    setPlayerChoice(data){
        this.choice = [];
        data.forEach(c_id => {
            let cardIndex = this.cards.findIndex(card => card.id === c_id);
            if (cardIndex === -1) {
                return false;
            }
            this.choice.push(this.cards[cardIndex]);
        });
        this.state = basedata.GameStates.CHOSEN_WHITE_CARD;
        return true;
    }

    setCzarChoice(data){
        //czar chooses the index for a card set instead of individual cards
        let index = 0;
        for (let set of this.selectedWhiteCardSets){
            for (let card of set){
                if (card !== null && data[0] === parseInt(card.id)){
                    this.choice = index;
                    this.state = basedata.GameStates.CHOSEN_WHITE_CARD;
                    return true;
                }
            }
            index++;
        }
        return false;
    }

    getBlackCardPick(){
        return this.blackCardType;
    }

    getCards(){
        return this.cards;
    }

    getPlayerType(){
        return this.type;
    }

    getSelectedSets(){
        return this.selectedWhiteCardSets;
    }

    /**=======Client update on data======**/

    update(data){
        if(this.type === 0) console.log('Player is CZAR');
        else console.log('Player is NORMAL');

        if (data.length === 0)
            return ;

        if (this.state === basedata.GameStates.CHOOSE_WHITE_CARD){
            console.log('Choosing white card');
            if (this.type === basedata.PlayerTypes.PLAYER) {
                if(!this.setPlayerChoice(data)){
                    throw 'Error: card ID not in hand';
                }
            } else {
                if(!this.setCzarChoice(data)) {
                    throw 'Error: card Index not in selection';
                }
            }
        }
        else if (this.state === basedata.GameStates.END_ROUND){
            console.log('Round ended');
        }
        else if (this.state === basedata.GameStates.WAIT_FOR_PLAYERS){
            console.log('Waiting for other normal players to choose card');
        }
        else if (this.state === basedata.GameStates.WAIT_FOR_CZAR){
            console.log('Waiting for czar to choose card');
        }
        else if (this.state === basedata.GameStates.GAME_END){
            console.log('Game has ended');
        }
    }

    /**=======Client request data======**/

    getNecessaryData(){
        if (this.state === basedata.GameStates.INITIAL) {
            return {
                header: basedata.RequestHeaders.REQUEST_BEGIN_GAME,
                player_id: this.id
            }
        }

        if (this.state === basedata.GameStates.CHOSEN_WHITE_CARD){
            return {
                header: basedata.RequestHeaders.REQUEST_CHOSE_CARD,
                player_id: this.id,
                cards: this.choice,
            }
        }

        if (this.state === basedata.GameStates.WAIT_FOR_PLAYERS){
            return {
                header: basedata.RequestHeaders.REQUEST_WAIT_ENDED_PLAYERS,
                player_id: this.id
            }
        }

        if (this.state === basedata.GameStates.WAIT_FOR_CZAR) {
            return {
                header: basedata.RequestHeaders.REQUEST_WAIT_ENDED_CZAR,
                player_id: this.id
            }
        }

        if(this.state === basedata.GameStates.END_ROUND) {
            return {
                header: basedata.RequestHeaders.REQUEST_END_ROUND,
                player_id: this.id
            }
        }

        return {
            header: basedata.RequestHeaders.REQUEST_EMPTY,
            player_id: this.id
        };
    }

    /**=======Client update on response======**/

    putData (data){
        console.log('[PID] ' + this.id);

        /**
         * Init white cards, black card, player list and type
         * data: player_list, black_card, black_card_type, current_czar, cards[]
         */
        if (this.state === basedata.GameStates.INITIAL && data.header === basedata.RequestHeaders.RESPONSE_BEGIN_GAME) {
            console.log('Received cards:', data.cards);
            this.cards = data.cards;
            this.commonBlackCard = data.black_card;
            this.blackCardType = data.black_card_type;
            this.playerList = data.player_list;
            this.currentCzarIndex = data.current_czar;
            this.playerIndex = this.playerList.findIndex(player => player.id === this.id);
            if(this.playerList[this.currentCzarIndex].id === this.id)
                this.type = basedata.PlayerTypes.CZAR;

            if(this.type === basedata.PlayerTypes.PLAYER) {
                this.state = basedata.GameStates.CHOOSE_WHITE_CARD;
            } else {
                this.state = basedata.GameStates.WAIT_FOR_PLAYERS;
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
         * White card choice behavior.
         * If czar picks white, send end round request.
         * If normal player picks white, set state to wait.
         *
         * data: ...
         */
        if(this.state === basedata.GameStates.CHOSEN_WHITE_CARD && data.header === basedata.RequestHeaders.RESPONSE_CHOSE_CARD){
            console.log('Player has chosen card set: ', this.choice);
            if(this.type === basedata.PlayerTypes.PLAYER) {
                this.state = basedata.GameStates.WAIT_FOR_CZAR;
            } else {
                this.state = basedata.GameStates.END_ROUND;
            }
            return {
                header: 'white_card_choice',
                cards: data.cards
            }
        }

        /**
         * When players are all ready, czar must choose a white card.
         * Receives the array with cards that the players chose.
         *
         * data: selected_cards[]
         */
        if(this.state === basedata.GameStates.WAIT_FOR_PLAYERS && data.header === basedata.RequestHeaders.RESPONSE_WAIT_ENDED_PLAYERS){
            if(data.wait_end === true){
                console.log('Wait ended for czar, time to choose white card');
                this.state = basedata.GameStates.CHOOSE_WHITE_CARD;
                this.selectedWhiteCardSets = data.selected_cards;

                return {
                    header: 'czar_allow_white_card_choice',
                    selected_cards: this.selectedWhiteCardSets
                }
            }

            return {
                header: 'not_yet_ended_wait'
            }
        }

        /**
         * When czar has chosen the card, end round for player and show the winning cards.
         * If the player choice is the winning card, points are added on server.
         *
         * data: winning_cards[]
         */
        if(this.state === basedata.GameStates.WAIT_FOR_CZAR && data.header === basedata.RequestHeaders.RESPONSE_WAIT_ENDED_CZAR){
            if(data.wait_end === true) {
                console.log('Wait ended for normal players, time to end round');
                this.winningCardSet  = data.winning_cards;
                this.state = basedata.GameStates.END_ROUND;

                return {
                    header: 'player_round_end',
                    winning_cards: this.winningCardSet
                }
            }

            return {
                header: 'not_yet_ended_wait',
                selected_cards: data.selected_cards
            }
        }

        /**
         * If winner is NOT null, continue the game
         * data: player_list, winner_player, black_card, black_card_type, current_czar, cards[]
         */
        if(this.state === basedata.GameStates.END_ROUND && data.header === basedata.RequestHeaders.RESPONSE_END_ROUND) {
            this.playerList = data.player_list;
            if (data.winner_player !== null) {
                this.winnerPlayer = data.winner_player;
                this.state = basedata.GameStates.GAME_END;
                return {
                    header: 'game_has_ended',
                    player_list: this.playerList
                }
            }

            this.type = this.playerList[this.playerIndex].type;
            this.choice = null;
            this.selectedWhiteCardSets = [];
            this.commonBlackCard = data.black_card;
            this.blackCardType = data.black_card_type;
            this.currentCzarIndex = data.current_czar;
            this.cards = data.cards;

            let pCards = [];
            this.playerList.filter(player => player.id === this.id)[0].cards.forEach(el => pCards.push(el));
            if (this.type === basedata.PlayerTypes.PLAYER) {
                this.state = basedata.GameStates.CHOOSE_WHITE_CARD;
                return {
                    header: 'new_round_for_normal_player',
                    player_list: this.playerList,
                    black_card: this.commonBlackCard,
                    black_card_type: this.blackCardType,
                    player_cards: pCards
                };
            } else {
                this.state = basedata.GameStates.WAIT_FOR_PLAYERS;
                return {
                    header: 'wait_for_players',
                    player_list: this.playerList,
                    cards: this.cards,
                    black_card: this.commonBlackCard,
                    black_card_type: this.blackCardType,
                    player_cards: pCards
                };
            }
        }

        /**
         * Response when nothing happens
         * data: selected_cards[]
         */
        if(data.header === basedata.RequestHeaders.RESPONSE_EMPTY){
            return {
                header: 'no_change',
                selected_cards: data.selected_cards
            };
        }

        return {
            header:'error - unknown header'
        };
    }
}

module.exports.GameClient = GameClient;

//TODO: sincronizat playerlist
//TODO: add development option to hide all console logs
//TODO: for every request check if error field is present
//TODO: cleaner, conventioned error handling