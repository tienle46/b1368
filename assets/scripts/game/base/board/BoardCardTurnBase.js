/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app'
import utils from 'utils'
import BoardTurnBaseAdapter from 'BoardTurnBaseAdapter';
import BoardCard from 'BoardCard';
import Keywords from 'Keywords'
import Events from 'Events'

export default class BoardCardTurnBase extends BoardCard {

    constructor() {
        super();

        this.deckCardRenderer = null;
        this.playedCards = null;
        this.turnAdapter = new BoardTurnBaseAdapter(this);
    }

    _init(scene){
        super._init(scene);
        this.playedCards = [];
        this.turnAdapter._init(scene);

        this.scene.on(Events.CLEAN_TURN_ROUTINE_DATA, this._cleanTurnRoutineData, this);
        this.scene.on(Events.ON_PLAYER_PLAYED_CARDS, this._onPlayerPlayedCards, this);
    }

    _onPlayerPlayedCards(playedCards, srcCardList, isItMe){
        this.playedCards = playedCards;
        this.renderer.addToDeck(playedCards, srcCardList, isItMe);
    }

    getLastPlayedTurnPlayerId(){
        return this.turnAdapter.lastPlayedTurn;
    }

    _reset(){
        super._reset();
        this.playedCards = [];
        this.turnAdapter && this.turnAdapter._reset();
    }

    _cleanTurnRoutineData(lastPlayedId){
        this.playedCards = [];
        this.renderer.cleanDeckCards();
    }

    getTurnDuration(){
        this.turnAdapter.timelineDuration;
    }

    onLoad(){
        super.onLoad();
        this.turnAdapter.setBoard(this);
    }

    handleGameStateChange(state, data){
        super.handleGameStateChange(state, data);

        if (state == app.const.game.state.BOARD_STATE_TURN_BASE_TRUE_PLAY) {
            this._handleBoardTurnBaseTruePlay(data);
        }
    }

    _handleBoardTurnBaseTruePlay(data){

        log("_handleBoardTurnBaseTruePlay", data);

        let turnDuration = utils.getValue(data, Keywords.TURN_BASE_PLAYER_TURN_DURATION)
        if (turnDuration) {
            this.scene.emit(Events.HANDLE_TURN_DURATION, turnDuration);
        }

        let nextTurnPlayerId = utils.getValue(data, Keywords.TURN_PLAYER_ID);
        if (nextTurnPlayerId) {
            this.scene.emit(Events.HANDLE_CHANGE_TURN, nextTurnPlayerId);
        }

        log("nextTurnPlayerId: ", nextTurnPlayerId)
    }

    onBoardPlaying(data, isJustJoined){
        super.onBoardPlaying(data, isJustJoined);
    }

    onBoardEnding(data, isJustJoined){
        super.onBoardEnding(data, isJustJoined);
    }
}