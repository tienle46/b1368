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
        this.scene.on('xocdia.on.player.bet', this._onPlayerBet, this);
    }

    // _addGlobalListener() {
    //     super._addGlobalListener();
    // }

    _reset() {
        super._reset();
        // 
        console.debug('_reset');
    }

    _extension() {
        console.debug('on extension');
    }

    _onPlayerBet(data) {
        console.debug('_onPlayerBet BoardXocDia', data);
        let { playerId, betsList, isSuccess, err } = data;

        // XocDiaAnim.tossChip(myPos, toNode, chipInfo, (() => {
        //     console.debug('scene', this.scene);
        // }).bind(this));
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
        if (state === app.const.game.state.STATE_BET) {

        }
    }

    _loadGamePlayData(data) {
        super._loadGamePlayData({...data, masterIdOwner: true });
    }

    onBoardEnding(data) {
        console.debug("onGameEnding Board");
        super.onBoardEnding(data);
    }

    _onGameBegin() {
        // hiding all bets and table on game board
        this.renderer.hideElements();
    }

}

app.createComponent(BoardXocDia);