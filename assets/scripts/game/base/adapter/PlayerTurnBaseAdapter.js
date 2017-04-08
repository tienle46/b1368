/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app'
import utils from 'utils';
import Events from 'Events';
import GameAdapter from 'GameAdapter';
import Commands from 'Commands';
import Keywords from 'Keywords'

export default class PlayerTurnBaseAdapter extends GameAdapter {

    constructor(player) {
        super();
        this.player = player;
        this.timelineDuration = 20;
        this.preTurnPlayerId = 0;
        this.currentTurnPlayerId = 0;
    }

    _reset(){
        this.preTurnPlayerId = 0;
        this.currentTurnPlayerId = 0;
        this.player.skippedTurn = false;

        console.warn("reser player turn: ")
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

    _addListener(){

        this.scene.on(Events.HANDLE_TURN_DURATION, this._handleTurnDuration, this);
        this.scene.on(Events.HANDLE_CHANGE_TURN, this._handleChangeTurn, this);
        this.scene.on(Events.HANDLE_PLAYER_PLAY_TURN, this._handlePlayTurn, this);
        this.scene.on(Events.HANDLE_LOSE_TURN, this._handleLoseTurn, this);
        this.scene.on(Events.HANDLE_SKIP_TURN, this._handleSkipTurn, this);
        this.scene.on(Events.ON_GAME_STATE_ENDING, this._onGameEnding, this);
        this.scene.on(Events.ON_GAME_CLEAN_TURN_ROUTINE_DATA, this._cleanTurnRoutineData, this);
        this.scene.on(Events.ON_GAME_LOAD_PLAY_DATA, this._loadGamePlayData, this);
        this.scene.on(Events.ON_GAME_REJOIN, this._onGameRejoin, this);
    }

    _removeListener(){
        this.scene.off(Events.HANDLE_TURN_DURATION, this._handleTurnDuration, this);
        this.scene.off(Events.HANDLE_CHANGE_TURN, this._handleChangeTurn, this);
        this.scene.off(Events.HANDLE_PLAYER_PLAY_TURN, this._handlePlayTurn, this);
        this.scene.off(Events.HANDLE_LOSE_TURN, this._handleLoseTurn, this);
        this.scene.off(Events.HANDLE_SKIP_TURN, this._handleSkipTurn, this);
        this.scene.off(Events.ON_GAME_STATE_ENDING, this._onGameEnding, this);
        this.scene.off(Events.ON_GAME_CLEAN_TURN_ROUTINE_DATA, this._cleanTurnRoutineData, this);
        this.scene.off(Events.ON_GAME_LOAD_PLAY_DATA, this._loadGamePlayData, this);
        this.scene.off(Events.ON_GAME_REJOIN, this._onGameRejoin, this);
    }

    _onGameRejoin(data){
        if(this.scene.isPlaying()) {
            let onTurnPlayerId = utils.getValue(this.scene.gameData, Keywords.TURN_PLAYER_ID);
            let remainTime = utils.getValue(data, Keywords.PLAYER_REJOIN_TURN_COUNT_REMAIN);

            onTurnPlayerId == this.player.id && remainTime && this.player.startTimeLine(remainTime);
        }
    }

    isTurn() {
        
        console.log("isTurn check this.currentTurnPlayerId: ", this.currentTurnPlayerId)
        
        return this.player.id == this.currentTurnPlayerId;
    }

    isSkippedTurn () {
        return this.player.skippedTurn || (this.board.lastMove && this.id == this.board.lastMove.id);
    }

    _cleanTurnRoutineData(){
        this._reset();
    }

    _handleSkipTurn(data){

        let skipTurnPlayerId = utils.getValue(data, Keywords.PLAYER_ID);
        (skipTurnPlayerId == this.player.id) && this._handleLoseTurn(skipTurnPlayerId);

        let onTurnPlayerId = utils.getValue(data, Keywords.TURN_PLAYER_ID);
        (onTurnPlayerId == this.player.id) && this._handleChangeTurn(onTurnPlayerId);
    }

    _handleGetTurn(data){

        let onTurnPlayerId = utils.getValue(data, Keywords.TURN_PLAYER_ID);

        this._handleChangeTurn(onTurnPlayerId);
    }

    _handleTurnDuration(duration){
        this.player.timelineDuration = duration;
    }

    _handleChangeTurn(turnPlayerId){
        this.preTurnPlayerId = this.currentTurnPlayerId;
        if(this.player.id === turnPlayerId) {
            // let preTurnPlayer = this.scene.gamePlayers.findPlayer(this.preTurnPlayerId);
            // preTurnPlayer && preTurnPlayer.turnAdapter.onLoseTurn();
            this.onTurn();
        }
        this.currentTurnPlayerId = turnPlayerId;
    }

    _handlePlayTurn(playerId, data){
        if(this.player.id === playerId)
        {
            this.handlePlayTurn(data);
            this.player.stopTimeLine();
        }
    }

    _showWaitTurnControls(){
        this.player.isItMe() && this.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);
    }

    _handleLoseTurn(playerId){
        this.player.id === playerId && this.onLoseTurn();
    }

    /**
     * @abstract
     */
    handlePlayTurn(data){
    }

    /**
     * @abstract
     */
    playTurn(...args){
    }

    skipTurn(){
        app.service.send({cmd: Commands.PLAYER_SKIP_TURN, data: {}, room: this.scene.room});
        if(this.player.isItMe()){
            this.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);
        }
    }

    onTurn(){

        this.player._assetIsReady()
        this.scene.emit(Events.ON_PLAYER_TURN, this.player.id);
        this.player.startTimeLine(this.timelineDuration);

        //TODO play sound

        let showPlayControlOnly = !this.preTurnPlayerId && !this.scene.board.getLastPlayedTurnPlayerId();

        if(this.player.isItMe()) {
            this.scene.emit(Events.SHOW_ON_TURN_CONTROLS, showPlayControlOnly);
        }
    }

    onLoseTurn(){
        this.player.skippedTurn = true;
        this.player.stopTimeLine();
        this._showWaitTurnControls();
    }

    _onGameEnding(data){
        if(this.player.id == this.currentTurnPlayerId){
            this.onLoseTurn();
        }
    }

    _loadGamePlayData(data){
        /**
         * Start on turn player time line if current game state is not in WAIT OR READY state
         */

        if(this.scene.gameState != app.const.game.state.WAIT && this.scene.gameState != app.const.game.state.READY){

            let turnOwnerId = utils.getValue(data, Keywords.TURN_PLAYER_ID);
            if(turnOwnerId == this.player.id){
                let turnDuration = utils.getValue(data, Keywords.BOARD_PHASE_DURATION);
                if (turnDuration) {
                    this.player.startTimeLine(turnDuration);
                }
            }
        }

    }
}
