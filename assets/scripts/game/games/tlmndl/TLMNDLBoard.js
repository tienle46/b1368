/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import BoardCardTurnBase from 'BoardCardTurnBase';
import TLMNDLBoardRenderer from 'TLMNDLBoardRenderer';

export default class TLMNDLBoard extends BoardCardTurnBase{

    constructor(room, scene) {
        super(room, scene);

        this.rendererClassName = TLMNDLBoardRenderer;
    }

    onLoad(){
        super.onLoad();
    }
}