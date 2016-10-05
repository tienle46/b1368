/**
 * Created by Thanh on 8/23/2016.
 */

import utils from 'utils';
import app from 'app';
import game from 'game'
import {Actor} from 'components';
import Events from 'events'
import {Keywords} from 'core';

export default class Board extends Actor {

    constructor() {
        super();

        this.scene = null;

        this.room = null;

        this.owner = null;

        this.ownerId = 0;

        this.master = null;

        this.minBet = null;

        this.state = null;

        this.serverState = app.const.game.board.state.INITED;

        this.readyPhaseDuration = app.const.DEFAULT_READY_PHASE_DURATION;

        this.gameCode = "";

    }

    _init(scene) {

        this.scene = scene;
        this.room = scene.room;
        this.gameCode = scene.gameCode;
        this.state = app.const.game.board.state.INITED;
        this.gameData = scene.gameData;

        if (this.room.containsVariable(app.keywords.VARIABLE_MIN_BET)) {
            this.minbet = this.room.getVariable(app.keywords.VARIABLE_MIN_BET);
        }

        if (this.gameData.hasOwnProperty(app.keywords.BOARD_STATE_KEYWORD)) {
            this.serverState = this.gameData[app.keywords.BOARD_STATE_KEYWORD];
            this.state = app.const.game.board.state.BEGIN;
        }

        this.scene.on(Events.ON_GAME_STATE_CHANGE, this.handleGameStateChange, this);
        this.scene.on(Events.ON_GAME_STATE_BEGIN, this.onBoardBegin, this);
        this.scene.on(Events.ON_GAME_STATE_STARTING, this.onBoardStarting, this);
        this.scene.on(Events.ON_GAME_STATE_STARTED, this.onBoardStarted, this);
        this.scene.on(Events.ON_GAME_STATE_PLAYING, this.onBoardPlaying, this);
        this.scene.on(Events.ON_GAME_STATE_ENDING, this.onBoardEnding, this);
        this.scene.on(Events.ON_GAME_LOAD_PLAY_DATA, this._loadGamePlayData, this);
    }

    onLoad() {
        super.onLoad();

        console.debug("_init Board");
    }

    update(dt) {

    }

    start() {
        // this.onBoardStateChanged(app.const.game.board.state.INITED);
    }

    onDestroy() {

    }

    /**
     * @abstract
     */
    get gameType() {
    }

    setState(state) {
        this.state = state;
    }

    isPlaying() {
        return this.state === app.const.game.board.state.PLAYING;
    }

    isStarting() {
        return this.state === app.const.game.board.state.STARTING;
    }

    isReady() {
        return this.state === app.const.game.board.state.READY;
    }

    isBegin() {
        return this.state === app.const.game.board.state.BEGIN;
    }

    isNewBoard() {
        return this.state === app.const.game.board.state.INITED;
    }

    isEnding() {
        return this.state === app.const.game.board.state.ENDING;
    }

    getRoomNumber() {
        return this.room.name.substring(5);
    }

    getGroupNumber() {
        return app.context.groupId.length >= 3 && app.context.groupId.substring(3);
    }

    setMaster(master) {
        this.master = master;
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

    stopTimeLine() {
        //TODO
    }

    _updatePlayerState(boardInfoObj) {
        let playerIds = boardInfoObj[xg.Keywords.GAME_LIST_PLAYER];
        if (playerIds) {
            this.gamePlayers.changePlayerState(playerIds, app.const.playerState.READY);
        }
    }

    _updateBoardMaster(boardInfoObj) {
        let masterPlayerId = boardInfoObj.hasOwnProperty(xg.Keywords.MASTER_PLAYER_ID);
        if (masterPlayerId) {
            this.setMaster(this.gamePlayers.findPlayer(masterPlayerId));
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

    startTimeLine() {
        //TODO
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
            return state === app.const.game.board.state.PLAYING;
        };

        let localState = state;
        if (_isInstanceOfPlayingState(state)) {
            localState = xg.Board.PLAYING;
        } else {
            localState = state;
        }

        return localState;
    }

    handleGameStateChange(boardState, data) {
        this.serverState = boardState;

        if (data.hasOwnProperty(app.keywords.BOARD_PHASE_DURATION)) {
            this.changeBoardPhaseDuration(data);
        }

        //TODO Process board state changed here
    }

    _resetBoard() {
        this.scene.hideGameResult();
        this.renderer && this.renderer._resetBoard();
    }

    onBoardBegin(data = {}) {
        this._resetBoard();

        let boardTimeLine = utils.getValue(data, Keywords.BOARD_PHASE_DURATION);
        if (boardTimeLine) {
            if (this.scene.gamePlayers.meIsOwner) {
                boardTimeLine *= 2;
            }

            this.startTimeLine();
        }

        this.state = app.const.game.board.state.BEGIN;
    }

    onBoardStarting(data = {}, isJustJoined) {
        if (isJustJoined) {
            this.onBoardStarting({}, isJustJoined);
        }

        this.state = app.const.game.board.state.STARTING;
        this.scene.gameControls.hideAllControlsBeforeGameStart();
    }

    onBoardStarted(data = {}, isJustJoined) {
        if (isJustJoined) {
            this.onBoardStarting({}, isJustJoined);
        }

        this.state = app.const.game.board.state.STARTED;
        //TODO
    }

    onBoardPlaying(data = {}, isJustJoined) {
        if (isJustJoined) {
            this.onBoardStarting({}, isJustJoined);
        }

        this.state = app.const.game.board.state.PLAYING;
        //TODO
    }

    onBoardEnding(data = {}, isJustJoined) {
        if (isJustJoined) {
            this.onBoardStarting({}, isJustJoined);
        }

        this.state = app.const.game.board.state.ENDING;

        // TODO Khi cần show hiệu ứng thì dùng thông tin này để hiển thị các trường hợp đặc biệt
        // Byte tbBoardWinType = resObj.getByte(SmartfoxKeyword.KEYWORD_WIN_TYPE);
        // if (tbBoardWinType != null) {
        //     setWinType(tbBoardWinType.byteValue());
        // }

        this._handleSetPlayerBalance();
    }

    _getPlayerBalanceChangeAmounts(playerIds, data){

        let balanceChanges = {};
        let currentPlayerBalances = this.scene.gamePlayers.getCurrentPlayerBalances();
        let playersBalance = utils.getValue(data, Keywords.USER_BALANCE, []);

        playersBalance && playerIds && playerIds.forEach((id, i) => {
            let newBalance = playersBalance[i];
            let currentBalance = currentPlayerBalances[id] || 0;
            balanceChanges[id] = newBalance - currentBalance;
        });

        return balanceChanges;
    }

    _handleSetPlayerBalance(playerIds, data) {

        let playersBalance = utils.getValue(data, Keywords.USER_BALANCE, []);
        let playersExp = utils.getValue(data, Keywords.BOARD_EXP_POINT_LIST, []);

        playersBalance && playersExp && playerIds.forEach((id, i) => {
            let newBalance = playersBalance[i];
            let newExp = playersExp[i];

            this.scene.emit(Events.ON_PLAYER_SET_BALANCE, id, newBalance);
            //TODO chưa xử lý exp
        });
    }

    onBoardDestroy() {
        //TODO
    }

    _dealCards(data) {
        console.debug("Deal card");
    }

    changeBoardPhaseDuration(data) {
        //TODO on board timeline changed
    }

    _handleChangePlayerBalance(data) {

    }

    _handlePlayerReEnterGame(data) {

    }

    _handleChangeBoardMaster(data) {
    }

    _handlePlayerRejoinGame(data) {

    }

    _handleBoardError(errMsg) {

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

    _initPlayingData(data) {

    }

    _loadGamePlayData(data) {
    }
}