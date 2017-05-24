import app from 'app';
import Component from 'Component';
import { utils, GameUtils } from 'utils';
import { Keywords } from 'core';
import { Events } from 'events';
import BoardCardBetTurn from 'BoardCardBetTurn';
import XocDiaAnim from 'XocDiaAnim';
import { requestTimeout, clearRequestTimeout, requestInterval, clearRequestInterval } from 'TimeHacker';

export default class BoardXocDia extends BoardCardBetTurn {
    constructor() {
        super();

        this.interval = null;
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

        this.timeLineInterval && clearRequestInterval(this.timeLineInterval);
    }

    _reset() {
        super._reset();
        debug('_reset BoardXocDia.js');
        this.renderer.hideElements();
    }

    _onUpdateBoardResultHistory(histories) {
        histories && this.renderer.updateBoardResultHistory(histories);
    }

    startTimeLine(duration, message) {
        this.stopTimeLine();
        let hiddenText = false;
        if (utils.isEmpty(message)) {
            switch (this.scene.gameState) {
                case app.const.game.state.ENDING:
                    message = app.res.string('game_replay_waiting_time');
                    hiddenText = true;
                    break;
                // case app.const.game.state.READY:
                //     message = app.res.string('game_start');
                //     hiddenText = true;
                //     break;
                case app.const.game.state.STATE_BET:
                    this.renderer.stopDishShakeAnim();
                    message = 'Đặt cược';
                    break;
                default:          
                    message = app.res.string('game_waiting');
                    this.renderer.hideTimeLine();
                    break;
            }
        }
        
        this.scene.gameState && this.renderer.showTimeLine(duration, message, hiddenText);
        
        
        if (this.scene.gameState == app.const.game.state.READY) {
            this.renderer.hideTimeLine();
        }
    }

    onGameStatePreChange(boardState, data, isJustJoined) {
        super.onGameStatePreChange(boardState, data);
        debug('onGameStatePreChange', boardState, data, isJustJoined);

        if (boardState === app.const.game.state.STATE_BET) {
            this.scene.emit(Events.ON_GAME_STATE_STARTING);
            // todo anything
            this.renderer.showElements();
        }

        let duration = utils.getValue(data, app.keywords.BOARD_PHASE_DURATION);
        duration && this.startTimeLine(duration);
    }

    onGameStateChanged(boardState, data, isJustJoined) {

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
    }

    _loadGamePlayData(data) {
        super._loadGamePlayData({...data, masterIdOwner: true });
        data.b && data.b.length > 0 && this.scene.gameControls.initBoard(data.b, data.pl);
    }

    // state === app.const.game.state.ENDING
    onBoardEnding(data) {
        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER, []);
        let bets = utils.getValue(data, Keywords.XOCDIA_BET.AMOUNT, []);
        let playingPlayerIds = this.scene.gamePlayers.filterPlayingPlayer(playerIds);
        let balanceChangeAmounts = this._getPlayerBalanceChangeAmounts(playerIds, data);
        let playerResults = utils.getValue(data, Keywords.WIN, []);

        super.onBoardEnding(data);
        let dots = utils.getValue(data, Keywords.XOCDIA_RESULT_END_PHASE);
        if (dots && dots.length > 0) {
            this.renderer && this.renderer.initDots(dots);
            var t1 = requestTimeout(() => {
                this.renderer && this.renderer.openBowlAnim(); // this will end up 1s
                clearRequestTimeout(t1);
                var t2 = requestTimeout(() => {
                    clearRequestTimeout(t2);
                    // show result
                    this.renderer && this.renderer.displayResultFromDots(dots);

                    var t3 = requestTimeout(() => {
                        clearRequestTimeout(t3);

                        this.renderer && this.renderer.hideResult();
                    }, 3500); // hide it after 2s
                    // emit anim
                    playingPlayerIds && playingPlayerIds.forEach((id, index) => {
                        let playerId = id;
                        let balance = balanceChangeAmounts[id];
                        this.scene && this.scene.emit(Events.XOCDIA_ON_PLAYER_RUN_MONEY_BALANCE_CHANGE_ANIM, { balance, playerId });
                    });
                }, 1200); // show result and runing money balance anim after 1.2s

                var t4 = requestTimeout(() => {
                    clearRequestTimeout(t4);

                    this.scene && this.scene.emit(Events.XOCDIA_ON_DISTRIBUTE_CHIP, { playingPlayerIds, bets, playerResults, dots });
                }, 1500); // emit event after 1.5s
            }, 500);
        }

        // this.scene.emit(Events.XOCDIA_ON_CONTROL_SAVE_PREVIOUS_BETDATA, bets, playerIds);
    }

    _onGameBegin() {
        this.renderer.runDishShakeAnim();
        // hiding all bets and table on game board
        this.renderer.hideElements();
        // check if room has history, preload data
        if (this.room.variables[Keywords.VARIABLE_XOCDIA_HISTORY]) {
            let histories = this.room.variables[Keywords.VARIABLE_XOCDIA_HISTORY].value;
            histories && this.renderer.updateBoardResultHistory(histories);
        }
    }

}

app.createComponent(BoardXocDia);