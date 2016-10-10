/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import CardList from 'CardList';
import DeckCardRenderer from 'DeckCardRenderer';
import BoardCardRenderer from 'BoardCardRenderer';

export default class BoardCardTurnBaseRenderer extends BoardCardRenderer {
    constructor() {
        super();

        this.deckCardAnchor  = {
            default: null,
            type: cc.Node
        }

        this.deckCardPrefab  = {
            default: null,
            type: cc.Prefab
        }

        this.deckCards = null;
    }

    _initUI(data) {
        super._initUI(data);

        let deckCardNode = cc.instantiate(this.deckCardPrefab);
        this.deckCardAnchor.addChild(deckCardNode);

        this.deckCards = deckCardNode.getComponent('DeckCardRenderer');
    }

    _reset(){
        this.cleanDeckCards();
    }

    cleanDeckCards(){
        this.deckCards.clear();
    }

    addToDeck(cards, srcCardList, isItMe){
        debug("add to DECK")
        this.deckCards.addCards(cards, srcCardList, isItMe);
    }
}

app.createComponent(BoardCardTurnBaseRenderer);

