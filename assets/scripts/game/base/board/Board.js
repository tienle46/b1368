/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';
import Component from 'Component';

export default class Board extends Component{

    constructor(room, scene) {
        super();

        this.parentScene = scene;

        this.room = room;

        this.owner = null;

        this.ownerId = 0;

        this.master = null;

        this.minBet = null;

        this.state = app.const.game.board.state.INITED;

        this.serverState = app.const.game.board.state.INITED;

        this.readyPhaseDuration =  app.const.DEFAULT_READY_PHASE_DURATION;

        this.gameCode = "";

    }

    _init(gameData){
        this.gameCode = this.room.name.substring(0, 3);

        if (this.room.containsVariable(app.keywords.VARIABLE_MIN_BET)) {
            this.minbet = this.room.getVariable(app.keywords.VARIABLE_MIN_BET);
        }


        if (gameData.hasOwnProperty(app.keywords.BOARD_STATE_KEYWORD)) {
            this.serverState = gameData[app.keywords.BOARD_STATE_KEYWORD];
            this.state = app.const.game.board.state.BEGIN;
        }
    }

    onLoad() {
        super.onLoad();
    }

    update(dt) {

    }

    start(){

    }

    onDestroy(){

    }

    setState (state) {
        this.state = state;
    }

    isPlaying () {
        return this.state === app.const.game.board.state.PLAYING;
    }

    isStarting () {
        return this.state === app.const.game.board.state.STARTING;
    }

    isReady () {
        return this.state === app.const.game.board.state.READY;
    }

    isBegin () {
        return this.state === app.const.game.board.state.BEGIN;
    }

    isNewBoard () {
        return this.state === app.const.game.board.state.INITED;
    }

    isEnding () {
        return this.state === app.const.game.board.state.ENDING;
    }

    getRoomNumber () {
        return this.room.name.substring(5);
    }

    getGroupNumber () {
        return app.context.groupId.length >= 3 && app.context.groupId.substring(3);
    }

    setMaster (master) {
        this.master = master;
    }

    getSeatType () {
        //TODO
        // return xg.GameConstant.gameTableSeatType[xg.GameContext.getInstance().getGameID()];
    }

    isSpectator () {
        return this.playerManager.isSpectator();
    }

    getPlayerSeatID (playerId) {
        //TODO
        // return this.positionManager.getPlayerSeatID(playerId);
    }

    onResetBoard(){
        this.state = app.const.game.board.state.INITED;
    }

    onStartingBoard(){
        return this.state === app.const.game.board.state.STARTING;
    }

    onStartedBoard(){
    }

    onEndingBoard(){

    }

    onDestroyBoard(){
        app.system.setGameEventHandler(undefined);
        //TODO
    }

    stopBoardTimeLine(){
        //TODO
    }

    _updatePlayerState (boardInfoObj) {
        let playerIds = boardInfoObj[xg.Keywords.GAME_LIST_PLAYER];
        if (playerIds) {
            this.playerManager.changePlayerState(playerIds, app.const.playerState.READY);
        }
    }

    _updateBoardMaster (boardInfoObj) {
        let masterPlayerId = boardInfoObj.hasOwnProperty(xg.Keywords.MASTER_PLAYER_ID);
        if (masterPlayerId) {
            this.setMaster(this.playerManager.findPlayer(masterPlayerId));
        }
    }


    /**
     * Start board timeline trong cac truong hop: Cho sansang, ket thuc van chuan bi sang van moi (tiep tuc)
     * Hoac cac state khac luc chua playing nhu Bao Xam, Chia bai...
     *
     * @overrideable
     */
    _shouldUpdateBoardTimeLineOnRejoin () {
        return (this.isReady() && this.playerManager.shouldMeReady()) || this.isEnding();
    }

    /**
     * @overrideable
     */
    _shouldUpdatePlayerTimeLineOnRejoin () {
        return false;
    }


    /**
     * @overrideable
     */
    _shouldStartReadyTimeLine () {
        return !this.isSpectator() && this.isReady() && this.playerManager.shouldMeReady();
    }

    /**
     * @overrideable
     */
    _shouldStartPhaseTimeline () {
        return this._shouldStartReadyTimeline() || this.isEnding();
    }

    _isInstanceOfPlayingState (state) {
        return state === app.const.game.board.state.PLAYING;
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
    convertToLocalBoardState (state) {
        let localState = state;
        if (this._isInstanceOfPlayingState(state)) {
            localState = xg.Board.PLAYING;
        } else {
            localState = state;
        }

        return localState;
    }

    changeBoardState(boardState, data){
        this.serverState = boardState;

        //TODO Process board state changed here
    }

    _handleChangePlayerBalance(data){

    }

    _handleChangeBoardState(data){

    }

    _handlePlayerReEnterGame(data){

    }

    _handleChangeBoardMaster(data){
    }

    _handlePlayerRejoinGame(data){

    }

    _handleBoardError(errMsg){

    }

    _handlePlayerToSpectator(data){
        if (data.hasOwnProperty(app.keywords.ERROR)) {
            this._handleBoardError(app.res.getErrorMessage(data[app.keywords.ERROR]));
        }else{
            //TODO
            this.playerManager.onPlayerToSpectator();
        }
    }

    _handleSpectatorToPlayer(data){
        if (data.hasOwnProperty(app.keywords.ERROR)) {
            this.board._handleBoardError(app.res.getErrorMessage(data[app.keywords.ERROR]));
        }else{
            //TODO
        }
    }
}