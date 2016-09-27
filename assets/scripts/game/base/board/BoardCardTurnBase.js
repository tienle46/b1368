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


        this.deckCards = [];
        this.playedCards = [];
        this.turnAdapter._init(scene);

        this.scene.on(Events.CLEAN_TURN_ROUTINE_DATA, this._cleanTurnRoutineData, this);
    }

    _resetBoard(){
        super._resetBoard();

        this.deckCards = [];
        this.playedCards = [];
    }

    _cleanTurnRoutineData(lastPlayedId){
        this.deckCards = [];
        this.playedCards = [];
        this.renderer.cleanDeckCards();
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

        console.log("_handleBoardTurnBaseTruePlay")

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