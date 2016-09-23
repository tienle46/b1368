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

    constructor(room, scene) {
        super(room, scene);

        this.turnAdapter = new BoardTurnBaseAdapter(this);
    }

    _init(data = {}){
        super._init(data);
        this.turnAdapter._init(this.scene);
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