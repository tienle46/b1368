/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import BoardCardTurnBase from 'BoardCardTurnBase';
import TLMNDLBoardRenderer from 'TLMNDLBoardRenderer';
import GameUtils from 'GameUtils'

export default class TLMNDLBoard extends BoardCardTurnBase {

    constructor(room, scene) {
        super(room, scene);

        this.handCardSize = 13;

        this.deckCards = [];
        this.winRank = 0;
        this.rendererClassName = TLMNDLBoardRenderer;
    }

    _init(data = {}) {
        super._init(data);

    }

    onLoad() {
        super.onLoad()
    }

    onResetBoard() {
        super.onResetBoard();
        this.winRank = 0;
        this.renderer.setVisibleAnTrang(false);
        this.renderer.setVisibleDutBaBich(false);
    }

    changeBoardState(boardState, data){
        super.changeBoardState(boardState, data);

        if (data && data.hasOwnProperty(app.keywords.DEAL_CARD_LIST_KEYWORD)) {
            boardState = app.const.game.board.state.DEAL_CARD;
        }

        this.onBoardStateChanged(boardState);
    }
}