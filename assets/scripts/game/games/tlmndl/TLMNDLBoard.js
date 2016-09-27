/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import BoardCardTurnBase from 'BoardCardTurnBase';

export default class TLMNDLBoard extends BoardCardTurnBase {

    constructor() {
        super();

        this.winRank = 0;
        this.handCardSize = 13;
    }

    _init(scene) {
        super._init(scene);
    }

    onLoad() {
        super.onLoad();
    }

    _resetBoard() {
        super._resetBoard();
        this.winRank = 0;
        this.renderer.setVisibleAnTrang(false);
        this.renderer.setVisibleDutBaBich(false);
    }

    handleGameStateChange(boardState, data) {
        super.handleGameStateChange(boardState, data);

    }
}

app.createComponent(TLMNDLBoard);