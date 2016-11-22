/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import CardList from 'CardList';
import GameUtils from 'GameUtils';
import BoardCardTurnBaseRenderer from 'BoardCardTurnBaseRenderer';

export default class BoardPhomRenderer extends BoardCardTurnBaseRenderer {
    constructor() {
        super();
    }

    fillDeckFakeCards(){
        this.deckCardRenderer.setCards(GameUtils.convertBytesToCards(Array(16).fill(0)));
    }

    onLoad(){
        super.onLoad();
    }

    onEnable(){
        super.onEnable();
        this._initCenterDeckCard();
    }
}

app.createComponent(BoardPhomRenderer);