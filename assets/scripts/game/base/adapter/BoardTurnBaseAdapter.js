/**
 * Created by Thanh on 8/23/2016.
 */

import Events from 'Events'
import GameAdapter from 'GameAdapter';

export default class BoardTurnBaseAdapter extends GameAdapter {
    constructor(board) {
        super();

        this.board = board;
        this.preTurnPlayerId;
        this.currentTurnPlayerId;
        this.turnDuration = 20;
    }

    _init(scene){
        this.scene = scene;
        this._registerListener();
    }

    _registerListener(){
        this.scene.on(Events.HANDLE_TURN_DURATION, this._handleTurnDuration, this);
        this.scene.on(Events.HANDLE_CHANGE_TURN, this._handleChangeTurn, this);
    }

    _handleTurnDuration(duration){
        this.turnDuration = duration;
    }

    _handleChangeTurn(turnPlayerId){
        this.preTurnPlayerId = this.currentTurnPlayerId;
        this.currentTurnPlayerId = turnPlayerId;
    }
}

