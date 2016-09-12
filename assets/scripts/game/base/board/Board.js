/**
 * Created by Thanh on 8/23/2016.
 */

import game from 'game'
import PlayerManager from 'PlayerManager'
import PositionManager from 'PositionManager'
import GameEventHandler from 'GameEventHandler'
import Component from 'Component'

export default class Board extends Component{

    constructor(room, scene) {
        super()

        this.parentScene = scene;

        this.room = room;

        this.gameEventHandler = null

        this.gameData = null

        this.owner = null

        this.ownerId = 0

        this.master = null

        this.minBet = null

        this.state = game.const.boardState.INITED

        this.serverState = game.const.boardState.INITED

        this.readyPhaseDuration =  game.const.DEFAULT_READY_PHASE_DURATION

        this.gameCode = ""

    }

    _loadGameData(){

        if (this.room && this.room.containsVariable(game.keywords.VARIABLE_GAME_INFO)) {

            this.gameCode = this.room.name.substring(0, 3);
            this.gameData = this.room.getVariable(game.keywords.VARIABLE_GAME_INFO).value;

            if (this.room.containsVariable(game.keywords.VARIABLE_MIN_BET)) {
                this.minbet = this.room.getVariable(game.keywords.VARIABLE_MIN_BET)
            }


            if (this.gameData.hasOwnProperty(game.keywords.BOARD_STATE_KEYWORD)) {
                this.serverState = this.gameData[game.keywords.BOARD_STATE_KEYWORD];
                this.state = game.const.boardState.BEGIN;
            }

        } else {
            throw "Không thể tải dữ liệu bàn chơi hiện tại"
        }
    }

    init(){
        this._loadGameData();

        this.gameEventHandler = new GameEventHandler(this, this.parentScene);

    }

    onLoad() {

    }

    update(dt) {

    }

    start(){
        this.gameEventHandler && this.gameEventHandler.setShouldHandleEvent(true);
    }

    setState (state) {
        this.state = state;
    }

    isPlaying () {
        return this.state === game.const.boardState.PLAYING;
    }

    isStarting () {
        return this.state === game.const.boardState.STARTING;
    }

    isReady () {
        return this.state === game.const.boardState.READY;
    }

    isBegin () {
        return this.state === game.const.boardState.BEGIN;
    }

    isNewBoard () {
        return this.state === game.const.boardState.INITED;
    }

    isEnding () {
        return this.state === game.const.boardState.ENDING;
    }

    getRoomNumber () {
        return this.room.name.substring(5);
    }

    getGroupNumber () {
        return game.context.groupId.length >= 3 && game.context.groupId.substring(3);
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
        this.state = game.const.boardState.INITED
    }

    onStartingBoard(){
        return this.state === game.const.boardState.STARTING;
    }

    onStartedBoard(){
    }

    onEndingBoard(){

    }

    onDestroyBoard(){
        game.system.setGameEventHandler(undefined);
        //TODO
    }

    stopBoardTimeLine(){
        //TODO
    }

    _updatePlayerState (boardInfoObj) {
        let playerIds = boardInfoObj[xg.Keywords.GAME_LIST_PLAYER];
        if (playerIds) {
            this.playerManager.changePlayerState(playerIds, game.const.playerState.READY);
        }
    }

    _updateBoardMaster (boardInfoObj) {
        let masterPlayerId = boardInfoObj.hasOwnProperty(xg.Keywords.MASTER_PLAYER_ID);
        if (masterPlayerId) {
            this.setMaster(this.playerManager.findPlayer(masterPlayerId))
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
        return state === game.const.boardState.PLAYING;
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
        if (data.hasOwnProperty(game.keywords.ERROR)) {
            this._handleBoardError(game.resource.getErrorMessage(data[game.keywords.ERROR]));
        }else{
            //TODO
            this.playerManager.onPlayerToSpectator()
        }
    }

    _handleSpectatorToPlayer(data){
        if (data.hasOwnProperty(game.keywords.ERROR)) {
            this.board._handleBoardError(game.resource.getErrorMessage(data[game.keywords.ERROR]));
        }else{
            //TODO
        }
    }
}