/**
 * Created by Thanh on 8/23/2016.
 */

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
    }

    isTurn() {
        return this.player.id == this.currentTurnPlayerId;
    }

    isSkippedTurn () {
        return this.player.skippedTurn || (this.board.lastMove && this.id == this.board.lastMove.id);
    }

    _handleTurnDuration(duration){
        this.player.turnDuration = duration;
    }

    _handleChangeTurn(turnPlayerId){

        console.log("_handleChangeTurn");

        this.preTurnPlayerId = this.currentTurnPlayerId;
        this.currentTurnPlayerId = turnPlayerId;

        console.log("this.player.id: ", this.player.id, turnPlayerId)
        
        if(this.player.id === turnPlayerId) {
            let preTurnPlayer = this.scene.playerManager.findPlayer(this.preTurnPlayerId);
            preTurnPlayer && preTurnPlayer.turnAdapter.onLoseTurn();

            this.onTurn();
        }
    }

    _handlePlayTurn(data){
        let playerId = utils.getValue(data, Keywords.PLAYER_ID);

        console.log("_handlePlayTurn : ", playerId, data);

        this.player.id === playerId
        {
            this.handlePlayTurn(data);

            let nextTurnPlayerId = utils.getValue(data, Keywords.TURN_PLAYER_ID);
            if (nextTurnPlayerId) {
                console.log("nextTurnPlayerId: ", nextTurnPlayerId)
                this.scene.emit(Events.HANDLE_CHANGE_TURN, nextTurnPlayerId);
            }
        }
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

        console.log("on Turn")

        this.player.startTimeLine(this.turnDuration);

        //TODO play sound

        if(this.player.isItMe()) {
            console.log("emit SHOW_ON_TURN_CONTROLS")
            this.scene.emit(Events.SHOW_ON_TURN_CONTROLS)
        }
    }

    onLoseTurn(){
        this.player.skippedTurn = true;
        this.player.stopTimeLine();
    }

}

