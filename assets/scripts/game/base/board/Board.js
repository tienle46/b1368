/**
 * Created by Thanh on 8/23/2016.
 */

import utils from 'utils';
import app from 'app';
import game from 'game';
import { Actor } from 'components';
import Events from 'events';
import { Keywords } from 'core';

export default class Board extends Actor {

    constructor() {
        super();

        this.scene = null;
        this.room = null;
        this.owner = null;
        this.ownerId = 0;
        this.minBet = null;
        this.state = null;
        this.serverState = app.const.game.state.INITED;
        this.readyPhaseDuration = app.const.DEFAULT_READY_PHASE_DURATION;
        this.timelineRemain = 0;
        this.gameCode = "";
    }

    onEnable(...args) {
        super.onEnable(...args);

        this.scene = app.system.currentScene;
        this.room = this.scene.room;
        this.gameCode = this.scene.gameCode;
        this.state = app.const.game.state.INITED;
        this.gameData = this.scene.gameData;

        this._loadBoardMinBet();

        if (this.gameData.hasOwnProperty(app.keywords.BOARD_STATE_KEYWORD)) {
            this.serverState = this.gameData[app.keywords.BOARD_STATE_KEYWORD];
            this.state = app.const.game.state.BEGIN;
        }

        this.scene.on(Events.ON_GAME_RESET, this.onGameReset, this);
        this.scene.on(Events.ON_GAME_STATE_PRE_CHANGE, this.onGameStatePreChange, this, 0);
        this.scene.on(Events.ON_GAME_STATE_CHANGED, this.onGameStateChanged, this, 0);
        this.scene.on(Events.ON_GAME_STATE_BEGIN, this.onBoardBegin, this, 0);
        this.scene.on(Events.ON_GAME_STATE_STARTING, this.onBoardStarting, this, 0);
        this.scene.on(Events.ON_GAME_STATE_STARTED, this.onBoardStarted, this, 0);
        this.scene.on(Events.ON_GAME_STATE_PLAYING, this.onBoardPlaying, this, 0);
        this.scene.on(Events.ON_GAME_STATE_ENDING, this.onBoardEnding, this, 0);
        this.scene.on(Events.ON_GAME_LOAD_PLAY_DATA, this._loadGamePlayData, this);
        this.scene.on(Events.ON_PLAYER_READY_STATE_CHANGED, this._onPlayerSetReadyState, this);
        this.scene.on(Events.ON_GAME_REJOIN, this._onGameRejoin, this);
        this.scene.on(Events.ON_ROOM_CHANGE_MIN_BET, this._onRoomMinBetChanged, this);
    }

    _onRoomMinBetChanged() {
        this._loadBoardMinBet();
    }

    _loadBoardMinBet() {
        if (this.room.containsVariable(app.keywords.VARIABLE_MIN_BET)) {
            this.minBet = utils.getVariable(this.room, app.keywords.VARIABLE_MIN_BET);
        }
    }

    onDestroy() {
        super.onDestroy();
        this.stopTimeLine();
    }

    _onGameRejoin(data) {
        if (this.scene.isBegin()) {
            let remainTime = utils.getValue(data, Keywords.PLAYER_REJOIN_TURN_COUNT_REMAIN);
            remainTime && this.startTimeLine(remainTime);
        }
    }

    _onPlayerSetReadyState(playerId, ready, isItMe) {
        // isItMe && (ready ? this.stopTimeLine() : this.startTimeLine(this.readyPhaseDuration * 2));
    }

    /**
     * @abstract
     */
    get gameType() {}

    setState(state) {
        this.state = state;
    }

    isPlaying() {
        return this.scene.isPlaying();
    }

    isStarting() {
        return this.scene.isStarting();
    }

    isReady() {
        return this.scene.isReady();
    }

    isBegin() {
        return this.scene.isBegin();
    }

    isNewBoard() {
        return this.scene.isNewBoard();
    }

    isEnding() {
        return this.scene.isEnding();
    }

    getRoomNumber() {
        return this.room.name.substring(5);
    }

    getGroupNumber() {
        return app.context.groupId.length >= 3 && app.context.groupId.substring(3);
    }

    getSeatType() {
        //TODO
        // return xg.GameConstant.gameTableSeatType[xg.GameContext.getInstance().getGameID()];
    }

    isSpectator() {
        return this.gamePlayers.isSpectator();
    }

    getPlayerSeatID(playerId) {
        //TODO
        // return this.positionManager.getPlayerSeatID(playerId);
    }

    _updatePlayerState(boardInfoObj) {
        let playerIds = boardInfoObj[xg.Keywords.GAME_LIST_PLAYER];
        if (playerIds) {
            this.gamePlayers.changePlayerState(playerIds, app.const.playerState.READY);
        }
    }

    /**
     * Start board timeline trong cac truong hop: Cho sansang, ket thuc van chuan bi sang van moi (tiep tuc)
     * Hoac cac state khac luc chua playing nhu Bao Xam, Chia bai...
     *
     * @overrideable
     */
    _shouldUpdateBoardTimeLineOnRejoin() {
        return (this.isReady() && this.gamePlayers.shouldMeReady()) || this.isEnding();
    }

    /**
     * @overrideable
     */
    _shouldUpdatePlayerTimeLineOnRejoin() {
        return false;
    }


    /**
     * @overrideable
     */
    _shouldStartReadyTimeLine() {
        return !this.isSpectator() && this.isReady() && this.gamePlayers.shouldMeReady();
    }

    /**
     * @overrideable
     */
    _shouldStartPhaseTimeline() {
        return this._shouldStartReadyTimeLine() || this.isEnding();
    }

    startTimeLine(timeInSecond, message = "", timeoutCb) {
        this.stopTimeLine();

        if (utils.isEmpty(message)) {
            if (this.scene.gameState == app.const.game.state.ENDING) {
                message = app.res.string('game_replay_waiting_time');
            } else {
                message = app.res.string('game_waiting');
            }
        }

        this.renderer.showTimeLine(timeInSecond, message);

        // this.timelineRemain = timeInSecond;
        // this.timelineInterval = setInterval(() => {
        //     this.timelineRemain--;
        //     if (this.timelineRemain < 0) {
        //         this.stopTimeLine();
        //         timeoutCb && timeoutCb();
        //     } else {
        //         this.renderer.setTimeLineRemainTime(this.timelineRemain);
        //     }
        // }, 1000);

    }

    stopTimeLine() {
        // this.timelineInterval && clearInterval(this.timelineInterval);
        this.renderer && this.renderer.hideTimeLine();
    }

    /**
     * Convert server state ve cac state tuong ung cua board. Cac state nhu sau:
     * xg.Board.INITED = -1;
     * xg.Board.STATE_WAIT = -2;
     * xg.Board.BEGIN = -3;
     * xg.Board.STARTING = -4;
     * xg.Board.PLAYING = -6;
     *
     * @return Local state tuong ung voi {@param state}
     * @overrideable
     */
    convertToLocalBoardState(state) {

        let _isInstanceOfPlayingState = (state) => {
            return state === app.const.game.state.PLAYING;
        };

        let localState = state;
        if (_isInstanceOfPlayingState(state)) {
            localState = xg.Board.PLAYING;
        } else {
            localState = state;
        }

        return localState;
    }

    onGameStateChanged(boardState, data, isJustJoined) {

    }

    onGameStatePreChange(boardState, data) {
        this.serverState = boardState;

        console.log("onGameStatePreChange...", data);

        //TODO Process board state changed here
    }

    _reset() {
        this.scene.clearReadyPlayer();
        this.scene.hideGameResult();
        this.renderer && this.renderer._reset();
    }

    onGameReset() {
        this._reset();
    }

    onBoardBegin(data = {}, isJustJoined) {

        if (!isJustJoined) {
            this._reset();
        }

        let boardTimeLine = utils.getValue(data, Keywords.BOARD_PHASE_DURATION);
        boardTimeLine && (this.readyPhaseDuration = boardTimeLine);

        //Support for new ready flow
        if (this.readyPhaseDuration && this.scene.enoughPlayerToStartGame()) {
            if (isJustJoined) {
                //Delay client - server && board init time
                boardTimeLine -= 2;
            }

            // this.startTimeLine(boardTimeLine, () => { this.scene.emit(Events.ON_ACTION_EXIT_GAME) });
            this.startTimeLine(boardTimeLine);
            this.scene.emit(Events.SHOW_START_GAME_CONTROL);
        }

        this.state = app.const.game.state.BEGIN;
    }

    onBoardStarting(data = {}, isJustJoined) {

        if (isJustJoined) {

        }

        this.state = app.const.game.state.STARTING;
        // this.scene.gameControls.hideAllControlsBeforeGameStart();
        this.stopTimeLine();
        this.scene.updatePlayerReadyFromGameData();
    }

    onBoardStarted(data = {}, isJustJoined) {
        if (isJustJoined) {

        }

        this.state = app.const.game.state.STARTED;
    }

    onBoardPlaying(data = {}, isJustJoined) {
        if (isJustJoined) {}

        this.state = app.const.game.state.PLAYING;
        //TODO
    }

    _startEndBoardTimeLine(duration) {
        duration && duration > 0 && this.startTimeLine(duration, app.res.string('game_replay_waiting_time'));
    }

    onBoardEnding(data = {}, isJustJoined) {
        this.timelineRemain = utils.getValue(data, Keywords.BOARD_PHASE_DURATION);

        if (isJustJoined) {
            this._startEndBoardTimeLine(this.timelineRemain);
        }

        this.state = app.const.game.state.ENDING;
        this._handleSetPlayerBalance(data);

        // TODO Khi cần show hiệu ứng thì dùng thông tin này để hiển thị các trường hợp đặc biệt
        // Byte tbBoardWinType = resObj.getByte(SmartfoxKeyword.KEYWORD_WIN_TYPE);
        // if (tbBoardWinType != null) {
        //     setWinType(tbBoardWinType.byteValue());
        // }

    }

    _getPlayerBalanceChangeAmounts(playerIds = [], data) {

        let balanceChangedAmounts = {};
        let currentPlayerBalances = this.scene.gamePlayers.getCurrentPlayerBalances(playerIds);
        let newPlayersBalance = utils.getValue(data, Keywords.USER_BALANCE, []);

        playerIds.forEach((id, i) => {
            let newBalance = newPlayersBalance[i];
            let currentBalance = currentPlayerBalances[id];
            balanceChangedAmounts[id] = newBalance - currentBalance;
        });

        console.log("currentPlayerBalances: ", currentPlayerBalances, newPlayersBalance);

        return balanceChangedAmounts;
    }

    _handleSetPlayerBalance(data) {

        console.log("_handleSetPlayerBalance: ", data);

        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER);
        let playersBalance = utils.getValue(data, Keywords.USER_BALANCE, []);
        let playersExp = utils.getValue(data, Keywords.BOARD_EXP_POINT_LIST, []);

        playerIds && playersBalance && playersExp && playerIds.forEach((id, i) => {
            let newBalance = playersBalance[i];
            let newExp = playersExp[i];

            newBalance && this.scene.emit(Events.ON_PLAYER_SET_BALANCE, id, newBalance);
            //TODO chưa xử lý exp
        });
    }

    changeBoardPhaseDuration(duration) {
        this.stopTimeLine();
        this.startTimeLine(duration);
    }

    _handleBoardError(errMsg) {
        app.system.showToast(errMsg);
    }

    _handlePlayerToSpectator(data) {
        if (data.hasOwnProperty(app.keywords.ERROR)) {
            this._handleBoardError(app.res.getErrorMessage(data[app.keywords.ERROR]));
        } else {
            //TODO
            this.gamePlayers.onPlayerToSpectator();
        }
    }

    _handleSpectatorToPlayer(data) {
        if (data.hasOwnProperty(app.keywords.ERROR)) {
            this.board._handleBoardError(app.res.getErrorMessage(data[app.keywords.ERROR]));
        } else {
            //TODO
        }
    }

    /**
     * @param data
     * @abstract
     */
    _initPlayingData(data) {

    }

    /**
     * @param data
     * @abstract
     */
    _loadGamePlayData(data) {
        this.scene.gamePlayers.updateBoardMaster(data);
    }
}