/**
 * Created by Thanh on 9/15/2016.
 */

import app from 'app'
import CardList from 'CardList'
import PlayerRenderer from 'PlayerRenderer';

export default class PlayerCardRenderer extends PlayerRenderer {
    constructor() {
        super();

        this.cardList = null;
        
    }

    _initUI(data){
        super._initUI();

        let cardListComponent = app.createComponent(CardList)
        this.cardList = this.node.addComponent(cardListComponent);
    }

    onLoad(){
        super.onLoad();
    }

    renderCards(cards){
        this.cardList.fillHolderWithCards(cards);
    }

}