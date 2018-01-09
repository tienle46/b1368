import Actor from 'Actor';
import Card from 'Card';

export default class BaseCard extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            cardSpriteAtlas: cc.SpriteAtlas,
        });

        this.rank = Card.RANK_ACE;
        this.suit = Card.SUIT_ZO;
        this.cardSpriteName = 'card_a_ro';
        this.cardSpriteFrame;
    }

    initWithCardValue(cardValue) {
        this.rank = cardValue >> 2;
        this.suit = cardValue & 3;
        this.cardSpriteName = this._getSpriteName();
        this.cardSpriteFrame = this.cardSpriteAtlas.getSpriteFrame(this.cardSpriteName);

    }

    _getSpriteName() {
        return `card_${this._getRankName()}_${this._getSuitName()}`;
    }

    _getRankName() {
        switch (this.rank) {
            case Card.RANK_J:
                return 'j';
            case Card.RANK_Q:
                return 'q';
            case Card.RANK_K:
                return 'k';
            case Card.RANK_AT:
                return 'a';
            default:
                return '' + this.rank;
        }
    }

    _getSuitName() {
        switch (this.suit) {
            case Card.SUIT_BICH:
                return 'bich';
            case Card.SUIT_TEP:
                return 'tep';
            case Card.SUIT_ZO:
                return 'ro';
            case Card.SUIT_CO:
                return 'co';
            default:
                return 'bich';
        }
    }

}