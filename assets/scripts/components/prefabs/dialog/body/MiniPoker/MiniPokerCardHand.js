import app from 'app';
import Actor from 'Actor';
import MiniPokerCardType from 'MiniPokerCardType';
import Card from 'Card';

class MiniPokerCardHand extends Actor {

    constructor() {
        super();

        this.properties = this.assignProperties({
            cardAtlas: cc.SpriteAtlas,
            card1: cc.Sprite,
            card2: cc.Sprite,
            card3: cc.Sprite,
            card4: cc.Sprite,
            card5: cc.Sprite
        });
    }

    loadCardsByType(type) {
        switch (type) {
            case MiniPokerCardType.DOI_J:
                this.loadCardsByValues([46, 47, 48, 52, 4])
                break;
            case MiniPokerCardType.HAI_DOI:
                this.loadCardsByValues([46, 47, 50, 51, 52]);
                break;
            case MiniPokerCardType.SAM:
                this.loadCardsByValues([4, 5, 6, 10, 15]);
                break;
            case MiniPokerCardType.SANH:
                this.loadCardsByValues([7, 11, 14, 18, 21]);
                break;
            case MiniPokerCardType.THUNG:
                this.loadCardsByValues([4, 12, 20, 28, 44]);
                break;
            case MiniPokerCardType.CU_LU:
                this.loadCardsByValues([4, 5, 6, 10, 11]);
                break;
            case MiniPokerCardType.TU_QUY:
                this.loadCardsByValues([4, 5, 6, 7, 44]);
                break;
            case MiniPokerCardType.THUNG_PHA_SANH:
                this.loadCardsByValues([7, 11, 15, 19, 23]);
                break;
            case MiniPokerCardType.THUNG_PHA_SANH_J:
                this.loadCardsByValues([30, 34, 38, 42, 46]);
                break;
            default:
                this.loadCardsByValues([40, 44, 48, 52, 4]);
                break;
        }
    }

    loadCardsByValues(cards) {
        this.card1.spriteFrame = this._getSpriteFrame(cards[0]);
        this.card2.spriteFrame = this._getSpriteFrame(cards[1]);
        this.card3.spriteFrame = this._getSpriteFrame(cards[2]);
        this.card4.spriteFrame = this._getSpriteFrame(cards[3]);
        this.card5.spriteFrame = this._getSpriteFrame(cards[4]);
    }

    _getSpriteFrame(card) {
        return this.cardAtlas.getSpriteFrame(this._getSpriteName(card));
    }

    _getSpriteName(card) {
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

app.createComponent(MiniPokerCardHand);