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
        
        this.properties = this.assignProperties({
            deckCardNode: cc.Node,
            deckCardPrefab: cc.Prefab,
            deckCardName: "CardList"
        });
    }

    _initCenterDeckCard(){
        if(this.deckCardPrefab){
            let newDeckCardNode = cc.instantiate(this.deckCardPrefab);
            this.deckCardNode.addChild(newDeckCardNode);
            this.deckCardRenderer = this.deckCardName && newDeckCardNode.getComponent(this.deckCardName);
        }else{
            this.deckCardRenderer = this.deckCardNode.getComponent('CardList');
        }
    }

    _reset(){
        this.cleanDeckCards();
    }

    cleanDeckCards(){
        this.deckCardRenderer && this.deckCardRenderer.clear();
    }

    addToDeck(cards, srcCardList, isItMe){
        this.deckCardRenderer.addCards(cards, srcCardList, isItMe);
    }
}

app.createComponent(BoardCardTurnBaseRenderer);

