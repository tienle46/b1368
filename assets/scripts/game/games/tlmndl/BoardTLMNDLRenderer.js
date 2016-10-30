/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import utils from 'utils';
import BoardRenderer from 'BoardRenderer';
import BoardCardRenderer from 'BoardCardRenderer';
import BoardCardTurnBaseRenderer from 'BoardCardTurnBaseRenderer';

export default class BoardTLMNDLRenderer extends BoardCardTurnBaseRenderer {
    constructor() {
        super();
    }

    _initUI(data){
        // this.assign(this.boardPrefab, 'BoardRenderer');
        // this.assign(this.boardCardPrefab, 'BoardCardRenderer');
        // this.assign(this.boardCardTurnBasePrefab, 'BoardCardTurnBaseRenderer');

        super._initUI(data)
        this._initCenterDeckCard();
    }

    onLoad() {
        super.onLoad();
    }

}

app.createComponent(BoardTLMNDLRenderer);