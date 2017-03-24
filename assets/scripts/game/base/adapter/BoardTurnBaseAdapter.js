/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';
import utils from 'utils'
import Events from 'Events'
import GameAdapter from 'GameAdapter';
import {Keywords} from 'core'
import GameUtils from 'GameUtils';

export default class BoardTurnBaseAdapter extends GameAdapter {
    constructor(board) {
        super();
        this.board = board;
        this.preTurnPlayerId;
        this.currentTurnPlayerId;
        this.lastPlayedTurn;
        this.timelineDuration = 20;
    }

    onEnable(){
        super.onEnable();
        this.scene = app.system.currentScene;
        this._addListener();
    }

    onDisable(){
        super.onDisable();
        this._removeListener();
    }

    _reset(){
        this.preTurnPlayerId = 0;
        this.currentTurnPlayerId = 0;
        this.lastPlayedTurn = 0;
    }

    _addListener(){
        this.scene.on(Events.HANDLE_TURN_DURATION, this._handleTurnDuration, this);
        this.scene.on(Events.HANDLE_CHANGE_TURN, this._handleChangeTurn, this);
        this.scene.on(Events.HANDLE_PLAY_TURN, this._handlePlayTurn, this, 0);
        this.scene.on(Events.ON_PLAYER_TURN, this._onPlayerTurn, this);
        this.scene.on(Events.ON_GAME_LOAD_PLAY_DATA, this._loadGamePlayData, this);
    }

    _removeListener(){
        this.scene.off(Events.HANDLE_TURN_DURATION, this._handleTurnDuration, this);
        this.scene.off(Events.HANDLE_CHANGE_TURN, this._handleChangeTurn, this);
        this.scene.off(Events.HANDLE_PLAY_TURN, this._handlePlayTurn, this, 0);
        this.scene.off(Events.ON_PLAYER_TURN, this._onPlayerTurn, this);
        this.scene.off(Events.ON_GAME_LOAD_PLAY_DATA, this._loadGamePlayData, this);
    }

    _handleTurnDuration(duration){
        this.timelineDuration = duration;
    }

    _handleChangeTurn(turnPlayerId){
        this.preTurnPlayerId = this.currentTurnPlayerId;
        this.currentTurnPlayerId = turnPlayerId;

        let preTurnPlayer = this.scene.gamePlayers.findPlayer(this.preTurnPlayerId);
        preTurnPlayer && preTurnPlayer.turnAdapter.onLoseTurn();
    }

    _handlePlayTurn(data){

        this.lastPlayedTurn = utils.getValue(data, Keywords.PLAYER_ID);
        let preTurnOwner = this.scene.gamePlayers.findPlayer(this.lastPlayedTurn);

        if(preTurnOwner){
            this.scene.emit(Events.HANDLE_PLAYER_PLAY_TURN, this.lastPlayedTurn, data)
        }else{
            let cards = GameUtils.convertBytesToCards(utils.getValue(data, Keywords.GAME_LIST_CARD, []));
            cards.length > 0 && this.scene.emit(Events.ON_PLAYER_PLAYED_CARDS, this.lastPlayedTurn, cards);
            this.lastPlayedTurn = 0;
        }

        let nextTurnPlayerId = utils.getValue(data, Keywords.TURN_PLAYER_ID);
        nextTurnPlayerId && this.scene.emit(Events.HANDLE_CHANGE_TURN, nextTurnPlayerId);
    }

    _onPlayerTurn(turnPlayerId){
        if(turnPlayerId == this.lastPlayedTurn){
            this.preTurnPlayerId = 0;
            this.lastPlayedTurn = 0;
            this.currentTurnPlayerId = 0;
            this.scene.emit(Events.ON_GAME_CLEAN_TURN_ROUTINE_DATA, turnPlayerId);
        }
    }

    _loadGamePlayData(data){
        this.lastPlayedTurn = utils.getValue(data, Keywords.LAST_MOVE_PLAYER_ID);
    }
}
