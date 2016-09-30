/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app'
import utils from 'utils'
import BoardTurnBaseAdapter from 'BoardTurnBaseAdapter';
import BoardCard from 'BoardCard';
import Keywords from 'Keywords'
import Events from 'Events'
const boardConst = app.const.game.board;

export default class BoardCardTurnBase extends BoardCard {

    constructor() {
        super();

        this.deckCards = null;
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

    _onPlayerPlayedCards(playedCards, srcCardList){
        this.playedCards = playedCards;
        this.renderer.addToDeck(playedCards, srcCardList);
    }

    getLastPlayedTurnPlayerId(){
        return this.turnAdapter.lastPlayedTurn;
    }

    _resetBoard(){
        super._resetBoard();
        this.playedCards = [];
    }

    _cleanTurnRoutineData(lastPlayedId){
        this.playedCards = [];
        this.renderer.cleanDeckCards();
    }

    addToDeck(cards){
        this.renderer.deckCards.addCards(cards);
    }

    getTurnDuration(){
        this.turnAdapter.turnDuration;
    }

    onLoad(){
        super.onLoad();
        this.turnAdapter.setBoard(this);
    }

    handleGameStateChange(state, data){
        super.handleGameStateChange(state, data);

        if (state == boardConst.state.BOARD_STATE_TURN_BASE_TRUE_PLAY) {
            this._handleBoardTurnBaseTruePlay(data);
        }
    }

    _handleBoardTurnBaseTruePlay(data){

        console.log("_handleBoardTurnBaseTruePlay", data);

        let turnDuration = utils.getValue(data, Keywords.TURN_BASE_PLAYER_TURN_DURATION)
        if (turnDuration) {
            this.scene.emit(Events.HANDLE_TURN_DURATION, turnDuration);
        }

        let nextTurnPlayerId = utils.getValue(data, Keywords.TURN_PLAYER_ID);
        if (nextTurnPlayerId) {
            this.scene.emit(Events.HANDLE_CHANGE_TURN, nextTurnPlayerId, true);
        }
    }

    onBoardPlaying(data){

    }
}