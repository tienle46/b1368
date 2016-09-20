/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import PlayerCardTurnBase from 'PlayerCardTurnBase';
import TLMNDLPlayerRenderer from 'TLMNDLPlayerRenderer';

export default class TLMNDLPlayer extends PlayerCardTurnBase {

    constructor(board, user) {
        super(board, user);

        this.rendererClassName = TLMNDLPlayerRenderer;
    }

    onLoad(){
        super.onLoad();
    }
}
