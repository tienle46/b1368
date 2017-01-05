import app from 'app';
import { utils, GameUtils } from 'utils';
import SFS2X from 'SFS2X';
import CreateGameException from 'CreateGameException';
import Actor from 'Actor';
import Events from 'Events'
import { Keywords } from 'core';
import FriendProfilePopupRub from 'FriendProfilePopupRub';

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
        this.ready = undefined;
        this.anchorIndex = -1;
    }

    setAnchorIndex(anchorIndex) {
        this.anchorIndex = anchorIndex;
        this.renderer && this.renderer.updatePlayerAnchor(anchorIndex);
    }

    _init(board, user) {

        this.scene = board.scene;
        this.board = board;
        this.user = user;

        if (!this.board || !this.user) {
            throw new CreateGameException("Dữ liệu khởi tạo bàn chơi không đúng");
        }

    }

    _addGlobalListener() {
        super._addGlobalListener();

        this.scene.on(Events.ON_GAME_RESET, this.onGameReset, this);
        this.scene.on(Events.ON_GAME_STATE_BEGIN, this.onGameBegin, this);
        this.scene.on(Events.ON_GAME_STATE_STARTING, this.onGameStarting, this);
        this.scene.on(Events.ON_GAME_STATE_STARTED, this.onGameStarted, this);
        this.scene.on(Events.ON_GAME_STATE_PLAYING, this.onGamePlaying, this);
        this.scene.on(Events.ON_GAME_STATE_ENDING, this.onGameEnding, this);
        this.scene.on(Events.ON_USER_EXIT_ROOM, this._onUserExitRoom, this);
        this.scene.on(Events.ON_PLAYER_READY_STATE_CHANGED, this._onSetReadyState, this);
        this.scene.on(Events.ON_PLAYER_CHANGE_BALANCE, this._onPlayerChangeBalance, this);
        this.scene.on(Events.ON_USER_UPDATE_BALANCE, this._onUserUpdateBalance, this);
        this.scene.on(Events.ON_USER_UPDATE_NEW_PLAYER, this._onUserUpdateNewPlayer, this);
        this.scene.on(Events.ON_PLAYER_SET_BALANCE, this._onPlayerSetBalance, this);
        this.scene.on(Events.ON_PLAYER_CHAT_MESSAGE, this._onPlayerChatMessage, this);
        this.scene.on(Events.ON_ROOM_CHANGE_MIN_BET, this._onRoomMinBetChanged, this);
        this.scene.on(Events.ON_CLICK_START_GAME_BUTTON, this._onClickStartGameButton, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();

        this.scene.off(Events.ON_GAME_RESET, this.onGameReset, this);
        this.scene.off(Events.ON_GAME_STATE_BEGIN, this.onGameBegin, this);
        this.scene.off(Events.ON_GAME_STATE_STARTING, this.onGameStarting, this);
        this.scene.off(Events.ON_GAME_STATE_STARTED, this.onGameStarted, this);
        this.scene.off(Events.ON_GAME_STATE_PLAYING, this.onGamePlaying, this);
        this.scene.off(Events.ON_GAME_STATE_ENDING, this.onGameEnding, this);
        this.scene.off(Events.ON_USER_EXIT_ROOM, this._onUserExitRoom, this);
        this.scene.off(Events.ON_PLAYER_READY_STATE_CHANGED, this._onSetReadyState, this);
        this.scene.off(Events.ON_PLAYER_CHANGE_BALANCE, this._onPlayerChangeBalance, this);
        this.scene.off(Events.ON_USER_UPDATE_BALANCE, this._onUserUpdateBalance, this);
        this.scene.off(Events.ON_PLAYER_SET_BALANCE, this._onPlayerSetBalance, this);
        this.scene.off(Events.ON_PLAYER_CHAT_MESSAGE, this._onPlayerChatMessage, this);
        this.scene.off(Events.ON_ROOM_CHANGE_MIN_BET, this._onRoomMinBetChanged, this);
        this.scene.off(Events.ON_CLICK_START_GAME_BUTTON, this._onClickStartGameButton, this);
        this.scene.off(Events.ON_USER_UPDATE_NEW_PLAYER, this._onUserUpdateNewPlayer, this);
    }

    _onUserUpdateNewPlayer(user) {
        if (user.id == this.user.id) {
            if(this.scene.gameState == app.const.game.state.WAIT || this.scene.gameState == app.const.game.state.READY){
                this._sendReadyImmediately();
            }

            //TODO show new player state
        }
    }

    _onClickStartGameButton(){
        if(this.isOwner){
            app.service.send({
                cmd: app.commands.START_GAME,
                room: this.scene.room
            })
        }
    }

    _onRoomMinBetChanged() {
        if (!this.isOwner) {
            this.scene.emit(Events.ON_PLAYER_READY_STATE_CHANGED, this.id, false);
        }
    }

    _onPlayerChatMessage(sender, message) {
        if (sender.name == this.user.name) {
            this.say(message);
        }
    }

    _onPlayerSetBalance(id, newBalance) {
        if (this.id == id) {
            let balanceVariable = this.user.variables[Keywords.USER_VARIABLE_BALANCE];
            var newBalanceVariable = new SFS2X.Entities.Variables.SFSUserVariable(balanceVariable.name, newBalance, balanceVariable.type);
            this.user._setVariable(newBalanceVariable);

            this._setBalance(newBalance);
        }
    }

    _onPlayerChangeBalance(id, newBalance) {

        if (this.id == id) {
            let balanceVariable = this.user.variables[Keywords.USER_VARIABLE_BALANCE];
            let currentBalance = balanceVariable.value;

            let newBalanceVariable = new SFS2X.Entities.Variables.SFSUserVariable(balanceVariable.name, newBalance, balanceVariable.type);
            this.user._setVariable(newBalanceVariable);

            this._setBalance(newBalance);

            let changeAmount = newBalance - currentBalance;
            this.renderer.startPlusBalanceAnimation(changeAmount);
        }
    }

    _onUserUpdateBalance(user) {
        if (this.user.name == user.name) {
            let newBalance = GameUtils.getUserBalance(user);
            this._setBalance(newBalance);
        }
    }

    _onSetReadyState(playerId, ready = true) {

        if (playerId == this.id) {
            this.setReady(ready);
        }
    }

    _onUserExitRoom(user, room) {
        if (user.id == this.user.id) {
            this.stopTimeLine();
        }
    }

    onEnable(renderer, renderData = {}) {
        super.onEnable(renderer, {...renderData, isItMe: this.user.isItMe, scene: this.scene, owner: this.isOwner });

        this.username = this.user.name;
        this.id = this.user.getPlayerId(this.board.room);
        this.balance = GameUtils.getUserBalance(this.user);

        this.renderer.setName(this.username);
        this.renderer.setBalance(this.balance);

        this._updatePlayerAnchor();

        // if(this.scene.checkReadyPlayer(this)){
            this.setReady(this.scene.checkReadyPlayer(this));
        // }
    }

    avatarCLicked() {
        // console.log(`Avatar clicked`);
        const startNode = this.scene.gamePlayers.playerPositions.getPlayerAnchorByPlayerId(this.scene.gamePlayers.me.id, this.isItMe());
        FriendProfilePopupRub.show(this.scene.node, this.user.userName, startNode, this.node);
    }

    _updatePlayerAnchor() {
        let anchorIndex = this.scene.playerPositions.getPlayerAnchorIndex(this.id, this.isItMe())
        let anchor = this.scene.playerPositions.getPlayerAnchor(anchorIndex);
        anchor && this.node.setPosition(anchor.getPosition());
        this.setAnchorIndex(anchorIndex)
    }

    _setBalance(balance) {
        this.balance = balance;
        this.renderer.setBalance(balance);
    }

    setOwner(isOwner) {
        this.isOwner = isOwner;
        this.renderer.setVisibleOwner(isOwner);
    }

    setMaster(isMaster) {
        this.isMaster = isMaster;
        this.renderer.setVisibleMaster(isMaster);
    }

    isReady() {
        return this.ready;
    }

    setReady(ready) {
        this.ready = ready;
        this.renderer.setVisibleReady(this.ready, this.id);
    }

    resetReadyState() {
        this.setReady(false);
    }

    isItMe() {
        return this.user && this.user.isItMe;
    }

    isPlaying() {
        return this.isReady();
    }

    /**
     * Show message player want to say
     * @param message
     */
    say(message) {
        this.renderer.showMessage(message);
    }

    notify(message) {
        this.renderer.showMessage(message);
    }

    stopTimeLine() {
        this.renderer._stopCountdown();
    }

    startTimeLine(timeInSeconds = this.board.getTurnDuration()) {
        this.renderer._startCountdown(timeInSeconds);
    }

    onSpectatorToPlayer(user) {

    }

    onPlayerToSpectator(user) {

    }

    onRejoin(remainCardCount, data) {

    }

    changeGameState(gameState) {

    }

    start(){
        super.start();

        this._sendReadyImmediately();
    }

    onGameBegin(data, isJustJoined) {
        if (!isJustJoined) {
            this.onGameReset();
        }

        this._sendReadyImmediately();

        // this.renderer.setVisibleReady(this.ready, this.id);
    }

    onGameStarting(data, isJustJoined) {

    }

    // changeReadyState(ready){
    //     // this.setReady(ready);
    //
    //     this.emit(Events.ON_PLAYER_READY_STATE_CHANGED, this.id, ready, this.isItMe());
    // }

    onGameStarted(data, isJustJoined) {
        if (isJustJoined) {

        }
    }

    onGamePlaying(data, isJustJoined) {
        if (isJustJoined) {

        }
    }

    onGameEnding(data, isJustJoined) {
        if (isJustJoined) {

        }

        this.stopTimeLine();
    }

    onGameReset() {
        // if(this.scene.gameState != app.const.game.state.READY){
        //     this.ready = false;
        // }

        this.renderer._reset();
    }

    equals(otherPlayer) {
        return otherPlayer && otherPlayer.id == this.id;
    }

    _sendReadyImmediately() {
        if(!this.isItMe()) return;

        let newPlayer = utils.getVariable(this.user, "newPlayer");
        if (!newPlayer) {
            this.scene.showShortLoading('ready');
            app.service.send({ cmd: app.commands.PLAYER_READY, room: this.scene.room });
        }
    }
}

app.createComponent(Player);