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
                    break;
                case app.const.game.state.READY:
                    message = app.res.string('game_start');
                    break;
                case app.const.game.state.STATE_BET:
                    message = duration;
                    break;
                default:
                    message = app.res.string('game_waiting');
                    break;
            }
        }
        this.renderer.showTimeLine(duration, message);
        if (this.scene.gameState == app.const.game.state.BOARD_STATE_SHAKE) {
            this.renderer.hideTimeLine();
        }
        if (this.scene.gameState == app.const.game.state.STATE_BET) {
            if (this.renderer) {
                var i = requestInterval(() => {
                    if (duration == 0) {
                        clearRequestInterval(i);
                        return;
                    }
                    console.debug(duration);
                    this.renderer.setTimeLineMessage(duration);
                    duration--;
                }, 1000);
            }
        }
    }

    handleGameStateChange(boardState, data, isJustJoined) {
        super.handleGameStateChange(boardState, data);
        debug('handleGameStateChange', boardState, data, isJustJoined);

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
        debug("onGameEnding BoardXocDia.js > data", data);
        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER, []);
        let bets = utils.getValue(data, Keywords.XOCDIA_BET.AMOUNT, []);
        let playingPlayerIds = this.scene.gamePlayers.filterPlayingPlayer(playerIds);
        let balanceChangeAmounts = this._getPlayerBalanceChangeAmounts(playerIds, data);
        let playerResults = utils.getValue(data, Keywords.WIN, []);

        super.onBoardEnding(data);

        this.renderer.stopDishShakeAnim();
        let dots = utils.getValue(data, Keywords.XOCDIA_RESULT_END_PHASE);
        if (dots && dots.length > 0) {
            this.renderer.initDots(dots);
            var t1 = requestTimeout(() => {
                this.renderer.openBowlAnim(); // this will end up 1s
                clearRequestTimeout(t1);
                var t2 = requestTimeout(() => {
                    clearRequestTimeout(t2);
                    // show result
                    this.renderer.displayResultFromDots(dots);

                    var t3 = requestTimeout(() => {
                        clearRequestTimeout(t3);

                        this.renderer.hideResult();
                    }, 3500); // hide it after 2s
                    // emit anim
                    playingPlayerIds.forEach((id, index) => {
                        let playerId = id;
                        let balance = balanceChangeAmounts[id];
                        this.scene.emit(Events.XOCDIA_ON_PLAYER_RUN_MONEY_BALANCE_CHANGE_ANIM, { balance, playerId });
                    });
                }, 1200); // show result and runing money balance anim after 1.2s

                var t4 = requestTimeout(() => {
                    clearRequestTimeout(t4);

                    this.scene.emit(Events.XOCDIA_ON_DISTRIBUTE_CHIP, { playingPlayerIds, bets, playerResults, dots });
                }, 1500); // emit event after 1.5s
            }, 500);
        }

        // this.scene.emit(Events.XOCDIA_ON_CONTROL_SAVE_PREVIOUS_BETDATA, bets, playerIds);
    }

    _onGameBegin() {
        this.renderer.stopDishShakeAnim();
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