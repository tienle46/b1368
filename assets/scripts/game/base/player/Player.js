import app from 'app';
import {utils, GameUtils} from 'utils';
import SFS2X from 'SFS2X';
import CreateGameException from 'CreateGameException';
import Actor from 'Actor';
import Events from 'Events'
import {Keywords} from 'core';
import Props from 'Props';
import {getEmotionName} from 'GameChatComponent';

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

    getUniqueName(){
        return `${super.getUniqueName()}_${this.user && this.user.name}`
    }

    _addGlobalListener() {
        super._addGlobalListener();

        if(this.scene){
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
            this.scene.on(Events.ON_USER_USES_ASSET, this._onUserUsesAsset, this);
            this.scene.on(Events.ON_PLAYER_REENTER_GAME, this._onUserReenterGame, this);
            this.scene.on(Events.ON_USER_MAKES_JAR_EXPLOSION, this._onUserGetJarExplosion, this);
        }
    }

    _removeGlobalListener() {
        super._removeGlobalListener();

        if(this.scene){
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
            this.scene.off(Events.ON_USER_USES_ASSET, this._onUserUsesAsset, this);
            this.scene.off(Events.ON_PLAYER_REENTER_GAME, this._onUserReenterGame, this);
            this.scene.off(Events.ON_USER_MAKES_JAR_EXPLOSION, this._onUserGetJarExplosion, this);
        }
    }

    _onUserReenterGame(playerId, userId){
        if(this.id != playerId) return;

        let userObj = [];
        userObj.push(userId);
        userObj.push(this.user.name);
        userObj.push(this.user.privilegeId);
        userObj.push(this.id);
        userObj.push([...this.user.getVariables()]);

        let newUser = SFS2X.Entities.SFSUser.fromArray(userObj, this.board.room);
        newUser._setUserManager(app.service.client.userManager);

        this.board.room._removeUser(this.user);
        app.service.client.userManager._removeUser(this.user);
        app.service.client.userManager._addUser(newUser);
        this.board.room._addUser(newUser);

        this.user = newUser;
    }

    _onUserUpdateNewPlayer(user) {
        if (user.id == this.user.id) {
            if (this.scene.gameState == app.const.game.state.WAIT || this.scene.gameState == app.const.game.state.READY) {
                this._sendReadyImmediately();
            }

            //TODO show new player state
        }
    }

    _onClickStartGameButton() {
        if (this.isOwner) {
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
            let emotionName = getEmotionName(message);
            if (emotionName && emotionName.length >= 0) {
                Props.playEmotion(emotionName, this.node);
            } else {
                this.say(message);
            }
        }
    }

    _onPlayerSetBalance(id, newBalance) {
        if (this.id == id) {
            let balanceVariable = this.user.variables[Keywords.USER_VARIABLE_BALANCE];
            let newBalanceVariable = balanceVariable ? new SFS2X.Entities.Variables.SFSUserVariable(balanceVariable.name, newBalance, balanceVariable.type)
                : new SFS2X.Entities.Variables.SFSUserVariable(Keywords.USER_VARIABLE_BALANCE, newBalance)

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
        if (user && this.user && user.id == this.user.id) {
            this.stopTimeLine();
        }
    }

    _getPosBasedOnWorldSpace(playerId) {
        let isItMe = this.scene.gamePlayers.isItMe(playerId);
        let myPos = this.scene.gamePlayers.playerPositions.getPlayerAnchorByPlayerId(playerId, isItMe);
        let node = this.node.parent ? this.node.parent : this.node;
        myPos = node.convertToWorldSpaceAR(myPos);

        return {myPos, isItMe};
    }
    
    _onUserGetJarExplosion(username, message, money) {
        if(!this.isItMe())
            return;
        debug('_onUserGetJarExplosion');
        if(this.username == username) {
            app.jarManager.jarExplosive({username, money, message});
        }
        let winUser = this.scene.gamePlayers.findPlayer(username);
        if(winUser) {
            let pos = this.scene.gamePlayers.playerPositions.getPlayerAnchor(winUser.anchorIndex);
            pos = this.node.parent ? this.node.parent.convertToWorldSpaceAR (pos) : this.node.convertToWorldSpaceAR (pos);
            app.jarManager.runCoinFliesFromJarToUserAnim(pos);
        }
        app.system.audioManager.play(app.system.audioManager.NO_HU);
    }
    
    onEnable(renderer, renderData = {}) {
        super.onEnable(renderer, {...renderData, isItMe: this.user && this.user.isItMe, scene: this.scene, owner: this.isOwner});

        this.username = this.user.name;
        this.id = this.user.getPlayerId(this.board.room);
        this.balance = GameUtils.getUserBalance(this.user);

        let displayName = GameUtils.getDisplayName(this.user);
        this.renderer.setName(displayName);
        this.renderer.setBalance(this.balance);
        
        this._initPlayerAvatar();
        
        this._updatePlayerAnchor();

        // if(this.scene.checkReadyPlayer(this)){
        this.setReady(this.scene.checkReadyPlayer(this));
        // }
    }

    avatarClicked() {
        if (!this.isItMe()) {
            let startNode = this.scene.gamePlayers.playerPositions.getPlayerAnchorByPlayerId(this.scene.gamePlayers.me.id, this.isItMe());
            this.renderer.showUserProfilePopup(this.scene.node, this.user.name, this.user.id, this.scene.gamePlayers.isOwner(this.scene.gamePlayers.me.id), startNode, this.node);
        }
    }

    _onUserUsesAsset(sender, receiver, assetId) {
        let playerIdSender = this.scene.gamePlayers.findPlayer(sender).id;
        if (playerIdSender != this.id)
            return;

        let playerIdReceiver = this.scene.gamePlayers.findPlayer(receiver).id,
            senderPos = this._getPosBasedOnWorldSpace(playerIdSender).myPos,
            receiverPos = this._getPosBasedOnWorldSpace(playerIdReceiver).myPos,
            prosName = Object.values(app.res.asset_tools).find(asset => asset.id == assetId).name;

        Props.playProp(prosName, {target: this.scene.gameMenuNode, startPos: senderPos, endPos: receiverPos});
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
    
    _initPlayerAvatar() {
        let avatarURL = (this.user.variables && this.user.variables.avatarUrl && this.user.variables.avatarUrl.value) || app.config.defaultAvatarUrl;
        avatarURL && this.renderer.initPlayerAvatar(avatarURL);
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

    start() {
        super.start();

        //this._sendReadyImmediately();
    }

    onGameBegin(data, isJustJoined) {
        if (!isJustJoined) {
            this.onGameReset();
        }
        
        this._sendReadyImmediately();
    }

    onGameStarting(data, isJustJoined) {
        
    }

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
        if (app.system.isInactive || !this.isItMe()) return;

        let newPlayer = utils.getVariable(this.user, "newPlayer");
        if (!newPlayer) {
            app.service.send({cmd: app.commands.PLAYER_READY, room: this.scene.room});
        }
    }

    getPlayerPositions(){
        return this.scene.gamePlayer.playerPositions;
    }

    /**
     * @private
     */

    _assetIsReady(){
        if(!this.isReady()){
            this.setReady(true)
            this.scene.emit(Events.ON_PLAYER_READY_STATE_CHANGED, this.id, true)
        }
    }
}

app.createComponent(Player);