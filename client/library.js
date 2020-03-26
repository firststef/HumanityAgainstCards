const RequestHeaders = {
    REQUEST_ID: 1,
    RESPONSE_REQUEST_ID:2,
    REQUEST_CARDS:3,
    RESPONSE_REQUEST_CARD:4,
    REQUEST_CHOSE_CARD:5,
    RESPONSE_CHOSE_CARD:6
};
Object.freeze(RequestHeaders);
//replace REQUEST_CARDS with REQUEST_BEGIN_GAME(cards + order)
const GameStates = {
    INITIAL:0,
    CHOOSE_WHITE_CARD:1,
    CHOSEN_WHITE_CARD:2,
    END_ROUND_AS_PLAYER:3,
    CHOOSE_BLACK_CARD:4,
    CHOSEN_BLACK_CARD:5,
    WAIT_FOR_PLAYERS:6,
    ENDED_WAIT_FOR_PLAYERS:7,
    END_ROUND_AS_CZAR:8
};

const PlayerTypes = {
    CZAR: 0,
    PLAYER: 1
};

class Card {
    constructor(id, name, text) {
        this.id = id;
        this.name = name;
        this.text = text;
    }
}

/** Momentan reprezinta un singur joc, e treaba backend-ului sa aiba grija de apelurile catre fiecare obiect GameManager sa fie facut corect */
class GameManager {
    constructor() { //should actually be initialized with a gameId, created by looking at the db, assuring it is unique
    }

    newId(){
        if (this.counter === undefined){
            this.counter = 0;
        }
        return this.counter++;
    }

    response(data){
        if (data.header === RequestHeaders.REQUEST_ID){
            console.log('[SERVER] created new id');
            return {
                header: RequestHeaders.RESPONSE_REQUEST_ID,
                id: this.newId()
            };
        }
        if (data.header === RequestHeaders.REQUEST_CARDS){
            console.log('[SERVER] gave client some cards');
            let card_lst = [];
            [...Array(5).keys()].forEach((x) => card_lst.push(new Card(x, getRandomString(), getRandomString())));
            return {
                header: RequestHeaders.RESPONSE_REQUEST_CARD,
                cards: card_lst
            };
        }
        if(data.header === RequestHeaders.REQUEST_CHOSE_CARD){
            console.log('[SERVER] Client chose card id: ', data.card_id);
            return {
                header: RequestHeaders.RESPONSE_CHOSE_CARD,
                card_id: data.card_id
            }
        }
        return 'error';
    }
}

class GameClient {
    constructor(token) {
        this.token = token;
        this.cards = [];
        this.points = 0;
        this.choice = -1;
        this.type = PlayerTypes.PLAYER;

        this.state = GameStates.INITIAL;
    }

    update(data){//this will return maybe a response with accepted/invalid
        if (this.state === GameStates.CHOOSE_WHITE_CARD){
            console.log('Chosen white card');
            this.choice = data.card_id;
            this.state = GameStates.CHOSEN_WHITE_CARD;
        }
        if (this.state === GameStates.CHOOSE_BLACK_CARD){
            console.log('Chosen black card');
            this.choice = data.card_id;
            this.state = GameStates.CHOSEN_BLACK_CARD;
        }
        if (this.state === GameStates.END_ROUND_AS_CZAR){
            console.log('Round ended for czar');
            this.state = GameStates.ENDED_WAIT_FOR_PLAYERS;
        }
        if (this.state === GameStates.END_ROUND_AS_PLAYER){
            console.log('Round ended for player');
        }
        if (this.state === GameStates.WAIT_FOR_PLAYERS){
            console.log('Waiting for other players')
        }
        if(this.state === GameStates.ENDED_WAIT_FOR_PLAYERS){
            this.state === GameStates.END_ROUND_AS_PLAYER;
        }


    }

    getNecessaryData(){
        if (this.state === GameStates.INITIAL) {
            return {
                header: RequestHeaders.REQUEST_CARDS
            }
        }
        if(this.state === GameStates.CHOSEN_WHITE_CARD || this.state === GameStates.CHOSEN_BLACK_CARD){
            return {
                header: RequestHeaders.REQUEST_CHOSE_CARD,
                card_id: this.choice
            }
        }
        return 'error';
    }

    putData (data){
        if (this.state === GameStates.INITIAL && data.header === RequestHeaders.RESPONSE_REQUEST_CARD){
            console.log('Received cards:', data.cards);
            this.cards = data.cards;
            if(this.type === PlayerTypes.PLAYER) {
                this.state = GameStates.CHOOSE_WHITE_CARD;
            } else {
                this.state = GameStates.CHOOSE_BLACK_CARD;
            }
            return {
                header:'show_cards',
                cards: this.cards
            }
        }

        if(this.state === GameStates.CHOSEN_WHITE_CARD && data.header === RequestHeaders.RESPONSE_CHOSE_CARD){
            if(this.type === PlayerTypes.PLAYER) {
                console.log('Player has chosen card id: ', data.card_id);
                this.state = GameStates.WAIT_FOR_PLAYERS;
            }
            else {
                console.log('Czar has chosen favourite card id: ', data.card_id);
                this.state = GameStates.END_ROUND_AS_CZAR;
            }
            return {
                header: 'white_card_choice',
                card_id: data.card_id
            }

        }

        if(this.state === GameStates.CHOSEN_BLACK_CARD && data.header === RequestHeaders.RESPONSE_CHOSE_CARD){
            console.log('Czar has chosen black card id: ', data.card_id);
            this.state = GameStates.WAIT_FOR_PLAYERS;
            return {
                header: 'black_card_choice',
                card_id: data.card_id
            }
        }

        return 'error';
    }
}

function getRandomString() {
    return Array(1).fill(null).map(() => Math.random().toString(36).substr(2)).join('')
}


// module.exports.[ce nume vrei sa aibe in afara filei] = [variabila/functia/clasa din fila]
module.exports.RequestHeaders = RequestHeaders;
module.exports.GameStates = GameStates;
module.exports.Card = Card;
module.exports.GameManager = GameManager;
module.exports.GameClient = GameClient;
module.exports.getRandomString= getRandomString;