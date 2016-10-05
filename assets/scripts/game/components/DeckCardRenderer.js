/**
 * Created by Thanh on 9/28/2016.
 */

import app from 'app';
import {Component} from 'components';
import {Card, CardList} from 'game-components';
import GameUtils from 'GameUtils';

export default class DeckCardRenderer extends Component {
    static get DEFAULT_SCALE() {
        return 0.8
    };

    constructor() {
        super();

        this.cardListPrefab = {
            default: null,
            type: cc.Prefab
        }

        this.cardList1Anchor = {
            default: null,
            type: cc.Node
        }

        this.cardList2Anchor = {
            default: null,
            type: cc.Node
        }

        this.cardList1 = null;
        this.cardList2 = null;
    }

    onLoad() {
        this.cardList1 = this._createCardList();
        this.cardList2 = this._createCardList();

        this.cardList1Anchor.addChild(this.cardList1.node);
        this.cardList2Anchor.addChild(this.cardList2.node);
    }

    addCards(cards, srcCardList) {
        if (!cards) return;

        cards = cards instanceof Card ? [cards] : cards;
        this._addNewCardList(cards, srcCardList);
    }

    _addNewCardList(cards, srcCardList) {

        console.debug("_addNewCardList: ", cards, this.cardList1._align, this.cardList2._align)

        if (this.cardList1.cards.length > 0) {
            if (this.cardList2.cards.length > 0) {
                this.cardList2.clear();
            }

            console.debug("transfer cards: ", this.cardList1.cards)
            this.cardList1.transfer(this.cardList1.getRawCards(), this.cardList2);
        }

        if (srcCardList) {
            srcCardList.transfer(cards, this.cardList1)
        } else {
            this.cardList1.setCards(cards);
        }

    }

    _createCardList() {
        let cardListNode = cc.instantiate(this.cardListPrefab);
        let cardList = cardListNode.getComponent('CardList');
        cardList.setProperties({scale: DeckCardRenderer.DEFAULT_SCALE, x: 0, y: 0, maxDimension: 500})
        cardList.setAnchorPoint(0.5, 0.5);
        return cardList;
    }

    clear() {
        this.cardList1.clear();
        this.cardList2.clear();
    }
}

app.createComponent(DeckCardRenderer);