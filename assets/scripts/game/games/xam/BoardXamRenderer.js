/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import utils from 'utils';
import BoardRenderer from 'BoardRenderer';
import BoardCardRenderer from 'BoardCardRenderer';
import BoardCardTurnBaseRenderer from 'BoardCardTurnBaseRenderer';

export default class BoardXamRenderer extends BoardCardTurnBaseRenderer {
    constructor() {
        super();
    }

    onEnable(){
        super.onEnable();
        this._initCenterDeckCard();
    }
}

app.createComponent(BoardXamRenderer);