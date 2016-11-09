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

        this.properties = {
            ...this.properties,
            deckCardAnchor: cc.Node,
            deckCardPrefab: cc.Prefab,
         }

    }

    _initCenterDeckCard(){
        let deckCardNode = cc.instantiate(this.deckCardPrefab);
        this.deckCardAnchor.addChild(deckCardNode);
        this.deckCardRenderer = deckCardNode.getComponent(DeckCardRenderer.name);
    }

    _reset(){
        this.cleanDeckCards();
    }

    cleanDeckCards(){
        this.deckCardRenderer.clear();
    }

    addToDeck(cards, srcCardList, isItMe){
        this.deckCardRenderer.addCards(cards, srcCardList, isItMe);
    }
}

app.createComponent(BoardCardTurnBaseRenderer);

