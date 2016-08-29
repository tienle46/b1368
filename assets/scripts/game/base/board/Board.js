/**
 * Created by Thanh on 8/23/2016.
 */

var game = require("game")
var PlayerManager = require("PlayerManager")
var PositionManager = require("PositionManager")

var Board = cc.Class({
    extends: cc.Component,

    properties: {
        playerManager: {
            default: null
        },

        positionManager: {
            default: null
        },

        gameData: {
            default: {}
        },

        owner: {
            default: null
        },

        master: {
            default: null
        },

        minBet: {
            default: 0
        },

        state: {
            default: game.const.boardState.INITED
        },

        serverState: {
            default: game.const.boardState.INITED
        },

        readyPhaseDuration: {
            default: game.const.DEFAULT_READY_PHASE_DURATION
        },

        gameCode: ""
    },

    _loadGameData(){
        this.room = game.context.currentRoom;

        if (this.room && this.containsVariable(game.keywords.VARIABLE_GAME_INFO)) {

            this.gameCode = room.name.substring(0, 3);

            if (this.room.containsVariable(game.keywords.VARIABLE_MIN_BET)) {
                this.minbet = this.room.getVariable(game.keywords.VARIABLE_MIN_BET)
            }

            this.gameData = this.room.getVariable(game.keywords.VARIABLE_GAME_INFO).value;

            if (this.gameData.hasOwnProperty(game.keywords.BOARD_STATE_KEYWORD)) {
                this.serverState = this.gameData[game.keywords.BOARD_STATE_KEYWORD];
                this.state = game.const.boardState.BEGIN;
            }

        } else {
            throw "Không thể tải dữ liệu bàn chơi hiện tại"
        }
    },

    onLoad() {
        this._loadGameData();

        this.playerManager = new PlayerManager(this);
        this.positionManager = new PositionManager(this);
        this.playerManager.initPlayers(this.room.getPlayerList());
    },

    update(dt) {

    },

    setState: function (state) {
        this.state = state;
    },

    isPlaying: function () {
        return this.state === game.const.boardState.PLAYING;
    },

    isStarting: function () {
        return this.state === game.const.boardState.STARTING;
    },

    isReady: function () {
        return this.state === game.const.boardState.READY;
    },

    isBegin: function () {
        return this.state === game.const.boardState.BEGIN;
    },

    isNewBoard: function () {
        return this.state === game.const.boardState.INITED;
    },

    isEnding: function () {
        return this.state === game.const.boardState.ENDING;
    },

    getRoomNumber: function () {
        return this.room.name.substring(5);
    },

    getGroupNumber: function () {
        return game.context.groupId.length >= 3 && game.context.groupId.substring(3);
    },

    setMaster: function (master) {
        this.master = master;
    },

    getSeatType: function () {
        //TODO
        // return xg.GameConstant.gameTableSeatType[xg.GameContext.getInstance().getGameID()];
    },

    isSpectator: function () {
        return this.playerManager.isSpectator();
    },

    getPlayerSeatID: function (playerId) {
        //TODO
        // return this.positionManager.getPlayerSeatID(playerId);
    },

    onResetBoard(){
        this.state = game.const.boardState.INITED
    },

    onStartingBoard(){
        return this.state === game.const.boardState.STARTING;
    },

    onStartedBoard(){
    },

    onEndingBoard(){

    },

    onDestroyBoard(){
        game.system.setGameEventHandler(undefined);
        //TODO
    },

    stopBoardTimeLine(){
        //TODO
    },

    _updatePlayerState: function (boardInfoObj) {
        let playerIds = boardInfoObj[xg.Keywords.GAME_LIST_PLAYER];
        if (playerIds) {
            this.playerManager.changePlayerState(playerIds, game.const.playerState.READY);
        }
    },

    _updateBoardMaster: function (boardInfoObj) {
        let masterPlayerId = boardInfoObj.hasOwnProperty(xg.Keywords.MASTER_PLAYER_ID);
        if (masterPlayerId) {
            this.setMaster(this.playerManager.findPlayer(masterPlayerId))
        }
    },


    /**
     * Start board timeline trong cac truong hop: Cho sansang, ket thuc van chuan bi sang van moi (tiep tuc)
     * Hoac cac state khac luc chua playing nhu Bao Xam, Chia bai...
     *
     * @overrideable
     */
    _shouldUpdateBoardTimeLineOnRejoin: function () {
        return (this.isReady() && this.playerManager.shouldMySelfReady()) || this.isEnding();
    },

    /**
     * @overrideable
     */
    _shouldUpdatePlayerTimeLineOnRejoin: function () {
        return false;
    },


    /**
     * @overrideable
     */
    _shouldStartReadyTimeLine: function () {
        return !this.isSpectator() && this.isReady() && this.playerManager.shouldMySelfReady();
    },

    /**
     * @overrideable
     */
    _shouldStartPhaseTimeline: function () {
        return this._shouldStartReadyTimeline() || this.isEnding();
    },

    _isInstanceOfPlayingState: function (state) {
        return state === game.const.boardState.PLAYING;
    },

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
    convertToLocalBoardState: function (state) {
        let localState = state;
        if (this._isInstanceOfPlayingState(state)) {
            localState = xg.Board.PLAYING;
        } else {
            localState = state;
        }

        return localState;
    },

    changeBoardState(boardState, data){
        this.serverState = boardState;

        //TODO Process board state changed here
    },

    _handleChangePlayerBalance(data){

    },

    _handleChangeBoardState(data){

    },

    _handlePlayerReEnterGame(data){

    },

    _handleChangeBoardMaster(data){
    },

    _handlePlayerRejoinGame(data){

    },

    _handleBoardError(errMsg){

    },

    _handlePlayerToSpectator(data){
        if (data.hasOwnProperty(game.keywords.ERROR)) {
            this._handleBoardError(game.resource.getErrorMessage(data[game.keywords.ERROR]));
        }else{
            //TODO
            this.playerManager.onPlayerToSpectator()
        }
    },

    _handleSpectatorToPlayer(data){
        if (data.hasOwnProperty(game.keywords.ERROR)) {
            this._board._handleBoardError(game.resource.getErrorMessage(data[game.keywords.ERROR]));
        }else{
            //TODO
        }
    }
});

module.exports = Board;