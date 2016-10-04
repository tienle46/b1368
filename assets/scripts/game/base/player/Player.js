
import app from 'app';
import {utils, GameUtils} from 'utils';
import SFS2X from 'SFS2X';
import CreateGameException from 'CreateGameException';
import Actor from 'Actor';
import Events from 'Events'
import {Keywords} from 'core';

export default class Player extends Actor {

    constructor(board, user) {
        super();

        this._inited;

        this.id = 0;
        this.user = user;
        this.board = board;
        this.inited = false;
        this.isOwner = false;
        this.isMaster = false;
        this.ready = false;
    }

    _init(board, user){

        this.scene = board.scene;
        this.board = board;
        this.user = user;

        if(!this.board || !this.user){
            throw new CreateGameException("Dữ liệu khởi tạo bàn chơi không đúng");
        }

        this.username = this.user.name;
        this.id = this.user.getPlayerId(this.board.room);
        this.balance = GameUtils.getUserBalance(user); //utils.getVariable(this.user, app.keywords.USER_VARIABLE_BALANCE, 0);

        this.scene.on(Events.ON_GAME_STATE_BEGIN, this.onGameBegin, this);
        this.scene.on(Events.ON_GAME_STATE_STARTING, this.onGameStarting, this);
        this.scene.on(Events.ON_GAME_STATE_STARTED, this.onGameStarted, this);
        this.scene.on(Events.ON_GAME_STATE_PLAYING, this.onGamePlaying, this);
        this.scene.on(Events.ON_GAME_STATE_ENDING, this.onGameEnding, this);
        this.scene.on(Events.GAME_USER_EXIT_ROOM, this._onUserExitRoom, this);
        this.scene.on(Events.ON_PLAYER_SET_READY_STATE, this._onSetReadyState, this);
        this.scene.on(Events.ON_PLAYER_CHANGE_BALANCE, this._onPlayerChangeBalance, this);
        this.scene.on(Events.ON_USER_UPDATE_BALANCE, this._onUserUpdateBalance, this);
    }

    _onPlayerChangeBalance(id, newBalance) {
        if(this.player.id == id){
            var balanceVariable = this.player.user.variables[Keywords.USER_VARIABLE_BALANCE];
            var newBalanceVariable = new SFS2X.Entities.Variables.SFSUserVariable(balanceVariable.name, newBalance, balanceVariable.type);
            this.user._setVariable(newBalanceVariable);

            this._setBalance(balance, true);
        }
    }

    _onUserUpdateBalance (user) {
        if(this.user.name == user.name){
            let newBalance = GameUtils.getUserBalance(user);
            this.renderer.setBalance(newBalance)
        }
    }

    _onSetReadyState(playerId, ready = true){
        if(playerId == this.id) {
            this.setReady(ready);
        }
    }

    _onUserExitRoom(user, room){
        if(user.id = this.user.id){
            this.stopTimeLine();
        }
    }

    onLoad(){
        super.onLoad();

        this.renderer.setName(this.username);
        this.renderer.setBalance(this.balance);
        this.renderer.setVisibleOwner(this.isOwner);
        
        console.log("on load: ", this.username, this.id, this.board, this.board.room);
    }

    _setBalance(balance, showPlusAnimation){
        this.balance = balance;
        this.renderer.setBalance(balance, showPlusAnimation);
    }

    setOwner(isOwner){
        this.isOwner = isOwner;
        this.renderer.setVisibleOwner(isOwner);
    }

    setMaster(isMaster){
        this.isMaster = isMaster;
        this.renderer.setVisibleMaster(isMaster);
    }

    setReady(ready){
        this.ready = ready;
        this.renderer.setVisibleReady(this.ready);
    }

    resetReadyState() {
        this.setReady(false);
    }

    isItMe() {
        return this.user && this.user.isItMe;
    }

    /**
     * Show message player want to say
     * @param message
     */
    say(message) {
        alert(`${this.name}: ${message}`);
    }

    notify(message){
        alert(`${this.name}: ${message}`);
    }

    stopTimeLine() {
        //TODO
    }

    startTimeLine(timeInSeconds = this.board.getTurnDuration()) {
        //TODO
    }

    onSpectatorToPlayer(user) {

    }

    onPlayerToSpectator(user) {

    }

    onRejoin(remainCardCount, data) {

    }

    changeGameState(gameState){

    }

    onGameBegin(data, isJustJoined) {

    }

    onGameStarting(data, isJustJoined) {
        if(isJustJoined){
            this.onGameBegin({}, isJustJoined);
        }
    }

    onGameStarted(data, isJustJoined) {
        if(isJustJoined){
            this.onGameStarting({}, isJustJoined);
        }
    }

    onGamePlaying(data, isJustJoined) {
        if(isJustJoined){
            this.onGameStarted({}, isJustJoined);
        }
    }

    onGameEnding(data, isJustJoined) {
        if(isJustJoined){
            this.onGamePlaying({}, isJustJoined);
        }
    }

}

app.createComponent(Player);