/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app'
import BoardCardTurnBase from 'BoardCardTurnBase'
import TLMNDLBoardRenderer from 'TLMNDLBoardRenderer'

export default class TLMNDLBoard extends BoardCardTurnBase{

    constructor(room, scene) {
        super(room, scene);

        this.handCardSize = 13;

        this.deckCards = [];
        this.winRank = 0;
        this.rendererClassName = TLMNDLBoardRenderer;
    }

    _init(data = {}){
        super._init(data);
    }

    onLoad(){
        super.onLoad()

    }

    onResetBoard(){
        super.onResetBoard();
        this.winRank = 0;
        this.renderer.setVisibleAnTrang(false);
        this.renderer.setVisibleDutBaBich(false);
    }
}