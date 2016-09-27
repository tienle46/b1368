/**
 * Created by Thanh on 9/16/2016.
 */

import BoardCardRenderer from 'BoardCardRenderer';
import CardList from 'CardList'

export default class BoardCardTurnBaseRenderer extends BoardCardRenderer {
    constructor() {
        super();

        this.deckCardRenderer  = {
            default: null,
            type: cc.Node
        }
    }

    _initUI(data) {
        super._initUI(data);
    }

    _resetBoard(){
        this.cleanDeckCards();
    }

    cleanDeckCards(){
        // this.deckCardRenderer.children.forEach(cardListNode => {
        //     let cardList = cardListNode.getComponent(CardList);
        //     cardList && cardList.clear();
        // });
    }

    addToDeck(cards){

    }
}