/**
 * Created by Thanh on 9/28/2016.
 */

import app from 'app';
import {Component} from 'components';
import {Card, CardList} from 'game-components';

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

        if (this.cardList1.cards.length > 0) {
            if (this.cardList2.cards.length > 0) {
                this.cardList2.clear();
            }
            this.cardList1.transferCards(this.cardList1.cards, this.cardList2);
        }

        if (srcCardList) {
            srcCardList.transferCards(cards, this.cardList1)
        } else {
            this.cardList1.setCards(cards);
        }
    }

    _createCardList() {
        let cardListNode = cc.instantiate(this.cardListPrefab);
        let cardList = cardListNode.getComponent('CardList');
        cardList.setAnchorPoint(0.5, 0.5);
        cardList._setMaxHeight(CardList.HEIGHT * DeckCardRenderer.DEFAULT_SCALE);
        cardList._setMaxWidth(500);
        return cardList;
    }

    clear() {
        this.cardList1.clear();
        this.cardList2.clear();
    }
}

app.createComponent(DeckCardRenderer);