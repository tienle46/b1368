/**
 * Created by Thanh on 8/23/2016.
 */

import utils from 'utils'
import Events from 'Events'
import GameAdapter from 'GameAdapter';
import {Keywords} from 'core'

export default class BoardTurnBaseAdapter extends GameAdapter {
    constructor(board) {
        super();

        this.board = board;
        this.preTurnPlayerId;
        this.currentTurnPlayerId;
        this.lastPlayedTurn;
        this.timelineDuration = 20;
    }

    _init(scene){
        this.scene = scene;
        this._addSystemListener();
    }

    _reset(){
        this.preTurnPlayerId = 0;
        this.currentTurnPlayerId = 0;
        this.lastPlayedTurn = 0;
    }

    _addSystemListener(){
        this.scene.on(Events.HANDLE_TURN_DURATION, this._handleTurnDuration, this);
        this.scene.on(Events.HANDLE_CHANGE_TURN, this._handleChangeTurn, this);
        this.scene.on(Events.HANDLE_PLAY_TURN, this._handlePlayTurn, this);
        this.scene.on(Events.ON_PLAYER_TURN, this._onPlayerTurn, this);
        this.scene.on(Events.ON_GAME_LOAD_PLAY_DATA, this._loadGamePlayData, this);
    }

    _handleTurnDuration(duration){
        this.timelineDuration = duration;
    }

    _handleChangeTurn(turnPlayerId){
        this.preTurnPlayerId = this.currentTurnPlayerId;
        this.currentTurnPlayerId = turnPlayerId;
    }

    _handlePlayTurn(data){
        this.lastPlayedTurn = utils.getValue(data, Keywords.PLAYER_ID);
    }

    _onPlayerTurn(turnPlayerId){
        if(turnPlayerId == this.lastPlayedTurn){
            debug('CLEAN_TURN_ROUTINE_DATA: ', turnPlayerId);
            this.preTurnPlayerId = 0;
            this.lastPlayedTurn = 0;
            this.currentTurnPlayerId = 0;
            this.scene.emit(Events.CLEAN_TURN_ROUTINE_DATA, turnPlayerId);
        }
    }

    _loadGamePlayData(data){
        this.lastPlayedTurn = utils.getValue(data, Keywords.LAST_MOVE_PLAYER_ID);
    }
}

