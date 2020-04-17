const basedata=require('./basedata');


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
        this.counter = 0;
        this.state = basedata.GameStates.INITIAL;

        this.test = false;
    }

    update(data){//this will return maybe a response with accepted/invalid
        if(this.type === 0) console.log('Player is CZAR');
        else console.log('Player is NORMAL');

        if (this.state === basedata.GameStates.CHOOSE_WHITE_CARD){
            console.log('Choosing white card');
            if (this.type === basedata.PlayerTypes.PLAYER) {
                this.counter++;
                if (data.card_index < this.cards.length) {
                    this.choice = [];
                    this.choice.push(this.cards[data.card_index]);
                    if(this.blackCardType > 1)
                        this.choice.push(this.cards[data.card_index_second])
                    this.state = basedata.GameStates.CHOSEN_WHITE_CARD;
                }
            }
            else{ //czar chooses the index for a card set instead of individual cards; czar might pick a null set!!!
                if (data.card_index < this.selectedWhiteCardSets.length) {
                    if(this.selectedWhiteCardSets[data.card_index][0] !== null)
                        this.choice = data.card_index;
                    else
                        this.choice = (data.card_index+1)%this.playerList.length;
                    this.state = basedata.GameStates.CHOSEN_WHITE_CARD;
                }
            }
        }

        if (this.state === basedata.GameStates.END_ROUND){
            console.log('Round ended');
        }

        if (this.state === basedata.GameStates.WAIT_FOR_PLAYERS){
            console.log('Waiting for other normal players to choose card');
        }

        if (this.state === basedata.GameStates.WAIT_FOR_CZAR){
            console.log('Waiting for czar to choose card');
        }

        if (this.state === basedata.GameStates.GAME_END){
            console.log('Game has ended');
            process.exit(0); //todo: remove this, only for testing
        }
    }

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

        return 'error';
    }

    putData (data){

        console.log('[PID] ' + this.id);
        /**
         * Init white cards, black card, player list and type
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
         * White card choice behavior. If czar picks white, end round for czar.
         * If normal player picks white, remove card from list and set state to wait.
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
         * Also receive the array with cards that the players chose.
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
         * When czar has chosen the card, end round for player and show him the winning card.
         * If the player choice is the winning card, then give him a point.
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
                header: 'not_yet_ended_wait'
            }
        }

        /**
         * After all players updated the points, we need to check if anyone won.
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

            if (this.type === basedata.PlayerTypes.PLAYER) {
                console.log('Received card: ', data.white_card);
                this.cards.push(data.white_card);
                this.state = basedata.GameStates.CHOOSE_WHITE_CARD;
                this.test = true;
                return {
                    header: 'new_round_for_normal_player',
                    player_list: this.playerList
                };
            } else {
                this.state = basedata.GameStates.WAIT_FOR_PLAYERS;

                return {
                    header: 'wait_for_players',
                    player_list: this.playerList,
                    cards: this.cards
                };
            }
        }

        return 'error';
    }
}

module.exports.GameClient = GameClient;