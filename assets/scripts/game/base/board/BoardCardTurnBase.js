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

        this.playedCards = null;
        this.turnAdapter = null;
    }

    onLoad(){
        super.onLoad();
        this.playedCards = [];
    }

    getLastMovePlayer(){
        return this.scene.gamePlayers.findPlayer(this.turnAdapter.lastPlayedTurn);
    }

    onEnable(renderer){
        super.onEnable();
        this.turnAdapter = new BoardTurnBaseAdapter();
        this.turnAdapter.onEnable();

        this.scene.on(Events.ON_GAME_CLEAN_TURN_ROUTINE_DATA, this._cleanTurnRoutineData, this);
        this.scene.on(Events.ON_PLAYER_PLAYED_CARDS, this._onPlayerPlayedCards, this, 0);
    }

    onDisable(){
        super.onDisable();
        this.turnAdapter.onDisable();
    }

    _onPlayerPlayedCards(playerId, playedCards, srcCardList, isItMe){
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

    _cleanTurnRoutineData(lastPlayedId, cleanDeck = true){
        this.playedCards = [];
        cleanDeck && this.renderer.cleanDeckCards();
    }

    getTurnDuration(){
        this.turnAdapter.timelineDuration;
    }

    onGameStatePreChange(state, data){
        super.onGameStatePreChange(state, data);

        if (state == app.const.game.state.BOARD_STATE_TURN_BASE_TRUE_PLAY) {
            this._handleBoardTurnBaseTruePlay(data);
        }
    }

    _handleBoardTurnBaseTruePlay(data){

        let turnDuration = utils.getValue(data, Keywords.TURN_BASE_PLAYER_TURN_DURATION)
        if (turnDuration) {
            this.scene.emit(Events.HANDLE_TURN_DURATION, turnDuration);
        }

        this.scene.emit(Events.ON_GAME_STATE_TRUE_PLAY, data);

        let nextTurnPlayerId = utils.getValue(data, Keywords.TURN_PLAYER_ID);
        if (nextTurnPlayerId) {
            this.scene.emit(Events.HANDLE_CHANGE_TURN, nextTurnPlayerId);
        }
    }

    onBoardPlaying(data, isJustJoined){
        super.onBoardPlaying(data, isJustJoined);
    }

    getDeckCards(){
        return this.renderer.deckCardRenderer;
    }
}