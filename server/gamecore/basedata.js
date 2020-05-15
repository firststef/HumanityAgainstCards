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
    RESPONSE_END_ROUND: 12,
    REQUEST_EMPTY: 13,
    RESPONSE_EMPTY: 14
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
    constructor(id, text) {
        this.id = id;
        this.text = text;
    }
}

//Only used for arrays
class Player {
    constructor(id, name) {
        this.id = id;
        this.ai = false;
        this.name = name;
        this.points = 0;
        this.cards = [];
        this.type = null;
    }
}

module.exports.RequestHeaders = RequestHeaders;
module.exports.GameStates = GameStates;
module.exports.PlayerTypes = PlayerTypes;
module.exports.Card = Card;
module.exports.Player = Player;
