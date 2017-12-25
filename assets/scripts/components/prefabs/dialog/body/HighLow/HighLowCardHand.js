import app from 'app';
import Actor from 'Actor';
import Card from 'Card';

class HighLowCardHand extends Actor {

    constructor() {
        super();

        this.properties = this.assignProperties({
            cardAtlas: cc.SpriteAtlas,
        });
    }

    getSpriteName(card) {
        var rank = card >> 2;
        var suit = card & 0x03;
        return `card_${this._getRankName(rank)}_${this._getSuitName(suit)}`;
    }

    _getRankName(rank) {
        switch (rank) {
            case Card.RANK_J:
                return 'j';
            case Card.RANK_Q:
                return 'q';
            case Card.RANK_K:
                return 'k';
            case Card.RANK_AT:
                return 'a';
            default:
                return '' + rank;
        }
    }

    _getSuitName(suit) {
        switch (suit) {
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

app.createComponent(HighLowCardHand);