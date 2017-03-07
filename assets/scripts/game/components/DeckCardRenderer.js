/**
 * Created by Thanh on 9/28/2016.
 */

import app from 'app';
import Component from 'components';
import {Card, CardList} from 'game-components';
import GameUtils from 'GameUtils';

export default class DeckCardRenderer extends Component {

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

    addCards(cards, srcCardList, isItMe) {
        if (!cards) return;

        cards = cards instanceof Card ? [cards] : cards;
        this._addNewCardList(cards, srcCardList, isItMe);
    }

    _addNewCardList(cards, srcCardList, isItMe) {

        if (this.cardList1.cards.length > 0) {
            if (this.cardList2.cards.length > 0) {
                this.cardList2.clear();
            }

            this.cardList1.transferTo(this.cardList2, this.cardList1.getRawCards());
        }


        if (srcCardList) {
            if (isItMe) {
                srcCardList.transferTo(this.cardList1, cards);
            } else {
                srcCardList.removeCards(cards.length);
                let addedCards = srcCardList.addCards(cards, true, true);
                srcCardList.transferTo(this.cardList1, addedCards);
            }
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

DeckCardRenderer.DEFAULT_SCALE = 0.8

app.createComponent(DeckCardRenderer);