/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import utils from 'utils';
import BoardRenderer from 'BoardRenderer';
import BoardCardRenderer from 'BoardCardRenderer';
import BoardCardBetTurnRenderer from 'BoardCardBetTurnRenderer';

export default class BoardBaCayRenderer extends BoardCardBetTurnRenderer {
    constructor() {
        super();
    }

    onEnable(){
        super.onEnable();
    }
}

app.createComponent(BoardBaCayRenderer);