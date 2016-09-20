/**
 * Created by Thanh on 9/15/2016.
 */

import app from 'app';
import PlayerCardTurnBaseRenderer from 'PlayerCardTurnBaseRenderer';
import TLMNDLPlayer from 'TLMNDLPlayer';
import TLMNDLPlayerRenderer from 'TLMNDLPlayerRenderer';

export default class PlayerCardBetTurnRenderer extends PlayerCardTurnBaseRenderer {
    constructor() {
        super();

        this.rendererClassName = TLMNDLPlayerRenderer;
    }

    onLoad(){
        super.onLoad();
    }
}