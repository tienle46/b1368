
export default class Card {
    constructor(rank, suit) {
        this.init(rank, suit)

        this.rankNode = cc.Label
        this.suitNode = cc.Sprite
        this.mainPic = cc.Sprite
        this.cardBG = cc.Sprite
        this.redTextColor = cc.Color.WHITE
        this.blackTextColor = cc.Color.WHITE
        this.texFrontBG = cc.SpriteFrame
        this.texBackBG = cc.SpriteFrame
        this.texFaces = {
            default: [],
            type: cc.SpriteFrame
        },
            this.texSuitBig = {
                default: [],
                type: cc.SpriteFrame
            },
            this.texSuitSmall = {
                default: [],
                type: cc.SpriteFrame
            }
    }

    onLoad() {

    }

    update(dt) {

    }

    initCard (card) {
        var isFaceCard = card.rank > 10;

        if (isFaceCard) {
            this.mainPic.spriteFrame = this.texFaces[card.rank - 10 - 1];
        }
        else {
            this.mainPic.spriteFrame = this.texSuitBig[card.suit - 1];
        }

        // for jsb
        this.rankNode.string = card.pointName;

        if (card.isRedSuit) {
            this.point.node.color = this.redTextColor;
        }
        else {
            this.point.node.color = this.blackTextColor;
        }

        this.suit.spriteFrame = this.texSuitSmall[card.suit - 1];
    }

    _init(rank, suit) {
        this.rank = rank
        this.suit = suit

        let isFaceCard = this.rank > 10;

        if (isFaceCard) {
            this.mainPic.spriteFrame = this.texFaces[this.rank - 10 - 1];
        }
        else {
            this.mainPic.spriteFrame = this.texSuitBig[this.suit - 1];
        }

        // for jsb
        this.rankNode.string = this._getRankName();

        if (this._isRedSuit()) {
            this.rankNode.node.color = this.redTextColor;
        }
        else {
            this.rankNode.node.color = this.blackTextColor;
        }

        this.suit.spriteFrame = this.texSuitSmall[this.suit - 1];
    }

    static from(byteValue) {
        let rank = cardByte >> 2;
        let suit = cardByte & 0x03;

        this._init(rank, suit);
    }

    _getRankName(){
        switch (this.rank){
            case Card.RANK_J:
                return 'J'
            case Card.RANK_Q:
                return 'Q'
            case Card.RANK_K:
                return 'K'
            default:
                return '' + this.rank
        }
    }

    _isRedSuit(){
        return this.suit == Card.SUIT_ZO || this.suit == Card.SUIT_CO;
    }

    reveal(isFaceUp) {
        this.rankNode.node.active = isFaceUp;
        this.rankNode.node.active = isFaceUp;
        this.mainPic.node.active = isFaceUp;
        this.cardBG.spriteFrame = isFaceUp ? this.texFrontBG : this.texBackBG;
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