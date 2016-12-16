import app from 'app';
import Component from 'Component';
import { utils, GameUtils } from 'utils';
import { Keywords } from 'core';
import { Events } from 'events';
import BoardCardBetTurn from 'BoardCardBetTurn';
import XocDiaAnim from 'XocDiaAnim';
import SFS2X from 'SFS2X';

export default class BoardXocDia extends BoardCardBetTurn {
    constructor() {
        super();
    }

    onLoad() {
        super.onLoad();
    }

    onEnable() {
        this.renderer = this.node.getComponent('BoardXocDiaRenderer');
        super.onEnable();

        this.scene.on(Events.ON_GAME_STATE_BEGIN, this._onGameBegin, this);
        this.scene.on(Events.ON_GAME_STATE, this._onGameState, this);
        this.scene.on(Events.XOCDIA_ON_BOARD_UPDATE_PREVIOUS_RESULT_HISTORY, this._onUpdateBoardResultHistory, this);
    }

    onDestroy() {
        super.onDestroy();

        this.scene.off(Events.ON_GAME_STATE_BEGIN, this._onGameBegin, this);
        this.scene.off(Events.ON_GAME_STATE, this._onGameState, this);
        this.scene.off(Events.XOCDIA_ON_BOARD_UPDATE_PREVIOUS_RESULT_HISTORY, this._onUpdateBoardResultHistory, this);
    }

    _reset() {
        super._reset();
        // 
        console.debug('_reset BoardXocDia.js');
        this.renderer.hideElements();
    }

    _onUpdateBoardResultHistory(room) {
        if (room.variables[app.keywords.VARIABLE_XOCDIA_HISTORY].value) {
            // this.renderer.updateBoardResultHistory();
        }
    }

    handleGameStateChange(boardState, data, isJustJoined) {
        super.handleGameStateChange(boardState, data);
        console.debug('handleGameStateChange', boardState, data, isJustJoined);

        if (boardState === app.const.game.state.STATE_BET) {
            this.scene.emit(Events.ON_GAME_STATE_STARTING);
            // todo anything
            this.renderer.showElements();
        }

        let duration = utils.getValue(data, app.keywords.BOARD_PHASE_DURATION);
        duration && this.startTimeLine(duration);
    }

    // //@override
    // onBoardStarting(data = {}, isJustJoined) {

    //     if (isJustJoined) {

    //     }

    //     this.state = app.const.game.state.STARTING;
    //     // this.scene.gameControls.hideAllControlsBeforeGameStart();
    //     this.stopTimeLine();
    // }

    _onGameState(state, data, isJustJoined) {
        if (state === app.const.game.state.BOARD_STATE_SHAKE) {
            this.renderer.runDishShakeAnim();
        }
    }

    _loadGamePlayData(data) {
        super._loadGamePlayData({...data, masterIdOwner: true });
    }

    // state === app.const.game.state.ENDING
    onBoardEnding(data) {
        console.debug("onGameEnding BoardXocDia.js > data", data);
        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER, []);
        let balanceChangeAmounts = this._getPlayerBalanceChangeAmounts(playerIds, data);
        console.debug("onGameEnding BoardXocDia.js > balanceChangeAmounts", balanceChangeAmounts);

        super.onBoardEnding(data);


        this.renderer.stopDishShakeAnim();
        let dots = data[app.keywords.XOCDIA_RESULT_END_PHASE];
        if (dots && dots.length > 0) {
            this.renderer.initDots(dots);
            setTimeout(() => {
                this.renderer.openBowlAnim();
            }, 700);
        }

        this.scene.emit(Events.XOCDIA_ON_CONTROL_SAVE_PREVIOUS_BETDATA, data[app.keywords.XOCDIA_BET.AMOUNT], playerIds);
    }

    _onGameBegin() {
        // hiding all bets and table on game board
        this.renderer.hideElements();
    }

}

app.createComponent(BoardXocDia);