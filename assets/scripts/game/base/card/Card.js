

export default class Card {
    constructor(rank, suit) {
        this.init(rank, suit)
    }

    onLoad() {

    }

    update(dt) {

    }

    init(rank, suit){
        this.rank = rank
        this.suit = suit
    }

    static from(byteValue){
        let rank =  cardByte >> 2;
        let suit = cardByte & 0x03;

        this.init(rank, suit);
    }
}


Card.RANK_AT = 1;
Card.RANK_HAI = 2;
Card.RANK_BA = 3;
Card.RANK_BON = 4;
Card.RANK_NAM = 5;
Card.RANK_SAU = 6;
Card.RANK_BAY = 7;
Card.RANK_TAM = 8;
Card.RANK_CHIN = 9;
Card.RANK_MUOI = 10;
Card.RANK_J = 11;
Card.RANK_Q = 12;
Card.RANK_K = 13;
Card.RANK_ACE = 14;
Card.RANK_DEUCE = 15;

Card.SUIT_BICH = 0;
Card.SUIT_TEP = 1;
Card.SUIT_ZO = 2;
Card.SUIT_CO = 3;

Card.STATE_TO_MOVE = +1;
Card.STATE_ON_HAND = 0;
Card.STATE_TO_PUSH = -1;

Card.MOVEUP_CARD_DURATION = 0.08;
/**/
Card.FOCUS_OVER_INDEX = 0;
Card.SELECT_OVER_INDEX = 1;
Card.EAT_INDEX = 2;
/**/
Card.FIRST_CARD_GROUP = 0;
Card.SECOND_CARD_GROUP = 1;
Card.THIRD_CARD_GROUP = 2;
Card.VERTICAL_SPACE_TO_SECOND_POSITION_Y = 24;
/**/
Card.CARD_WIDTH = 75;
Card.CARD_HEIGHT = 100;
Card.CARD_SHADOW_LEFT_WIDTH = 2;
Card.CARD_SHADOW_RIGHT_WIDTH = 1;
Card.CARD_KNOW_LEFT = 13;
Card.CARD_KNOW_RIGHT = 58;
Card.CARD_KNOW_TOP = 13;
Card.CARD_KNOW_BOTTOM = 80;
Card.HAND_LEFT_MARGIN_RIGHT = 18;
Card.HAND_LEFT_MARGIN_BOTTOM = 50;
Card.HAND_RIGHT_MARGIN_LEFT = 17;
Card.HAND_RIGHT_MARGIN_BOTTOM = 30;