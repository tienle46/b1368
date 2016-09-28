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

    constructor() {
        super();
        this.turnDuration = 20;
        this.preTurnPlayerId = 0;
        this.currentTurnPlayerId = 0;
        this.lastPlayedTurnPlayerId = 0;
    }

    _init(scene, player){
        this.scene = scene;
        this.player = player;
        this._registerListener();
        
        console.log("init turn: ", this.player.id);
    }

    _registerListener(){
        this.scene.on(Events.HANDLE_TURN_DURATION, this._handleTurnDuration, this);
        this.scene.on(Events.HANDLE_CHANGE_TURN, this._handleChangeTurn, this);
        this.scene.on(Events.HANDLE_PLAY_TURN, this._handlePlayTurn, this);
        this.scene.on(Events.HANDLE_LOSE_TURN, this._handleLoseTurn, this);
        this.scene.on(Events.HANDLE_SKIP_TURN, this._handleSkipTurn, this);
        this.scene.on(Events.CLEAN_TURN_ROUTINE_DATA, this._cleanTurnRoutineData, this);
    }

    isTurn() {
        return this.player.id == this.currentTurnPlayerId;
    }

    isSkippedTurn () {
        return this.player.skippedTurn || (this.board.lastMove && this.id == this.board.lastMove.id);
    }

    _cleanTurnRoutineData(){
        this.lastPlayedTurnPlayerId = undefined;
    }

    _handleSkipTurn(data){
        console.log(data)

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
        this.player.turnDuration = duration;
    }

    _handleChangeTurn(turnPlayerId, isFirstTurn){
        this.preTurnPlayerId = this.currentTurnPlayerId;
        this.currentTurnPlayerId = turnPlayerId;
        
        if(this.player.id === turnPlayerId) {

            if(!this.scene.gamePlayers){
                console.debug("this.scene.gamePlayers", this.scene);
            }

            let preTurnPlayer = this.scene.gamePlayers.findPlayer(this.preTurnPlayerId);
            preTurnPlayer && preTurnPlayer.turnAdapter.onLoseTurn();

            this.onTurn(isFirstTurn);
        }
    }

    _handlePlayTurn(data){

        console.log("_handlePlayTurn")

        let playerId = utils.getValue(data, Keywords.PLAYER_ID);

        this.player.id === playerId;
        {
            this.handlePlayTurn(data);
            let nextTurnPlayerId = utils.getValue(data, Keywords.TURN_PLAYER_ID);
            nextTurnPlayerId && this.scene.emit(Events.HANDLE_CHANGE_TURN, nextTurnPlayerId);

            console.log("set  lastPlayedTurnPlayerId")

            this.lastPlayedTurnPlayerId = playerId;
        }
    }

    _handleLoseTurn(playerId){
        if(typeof playerId == 'object') playerId == utils.getValue(data, Keywords.PLAYER_ID);

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

    onTurn(isFirstTurn){

        console.log("on Turn: ", this.player.id, this.lastPlayedTurnPlayerId)

        if(this.player.id == this.lastPlayedTurnPlayerId){
            this.scene.emit(Events.CLEAN_TURN_ROUTINE_DATA, this.player.id);
        }

        this.player.startTimeLine(this.turnDuration);

        //TODO play sound

        if(this.player.isItMe()) {
            console.log("emit SHOW_ON_TURN_CONTROLS")
            this.scene.emit(Events.SHOW_ON_TURN_CONTROLS, isFirstTurn)
        }
    }

    onLoseTurn(){
        this.player.skippedTurn = true;
        this.player.stopTimeLine();
        this.player.isItMe() && this.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);
    }

}

