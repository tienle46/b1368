/**
 * Created by Thanh on 8/23/2016.
 */

import game from 'game'
import Player from 'Player'
import SFS2X from 'SFS2X'
import Component from 'Component'
import CreateGameException from 'CreateGameException'

export default class PlayerManager extends Component {
    constructor() {
        super();
        this.playerPositions = {
            default: null,
            type: cc.Node
        }

        this._playerPrefab = null

        this.board = null
        this.me = null
        this.players = null
        this._idToPlayerMap = null
        this._nameToPlayerMap = null
        this.maxPlayerId = 1

    }

    init(board, scene) {
        this.board = board;
        this.parentScene = scene;
        this.gameCode = (this.board && this.board.gameCode) || (game.config.test ? "tnd" : "")
        this._reset();

        this._initPlayerLayer();
    }

    _onInitedPlayerLayer(){
        cc.loader.loadRes('game/players/Player', (error, prefab) => {
            if(error){
                throw new CreateGameException("Không thể khởi tạo người chơi")
                return;
            }

            this._playerPrefab = prefab;
            this.initPlayers()
        });
    }

    _initPlayerLayer() {
        let maxPlayer = game.manager.getMaxPlayer(this.gameCode);
        let positionAnchorResPath = maxPlayer && game.resource.playerAnchorPath[maxPlayer];
        let positionAnchorName = maxPlayer && game.resource.playerAnchorName[maxPlayer];

        console.debug(`max player : ${maxPlayer}`);
        console.debug(`positionAnchorResPath : ${positionAnchorResPath}`);

        if (positionAnchorResPath && positionAnchorName) {
            cc.loader.loadRes(positionAnchorResPath, (error, prefab) => {

                if(!error){
                    let prefabObj = cc.instantiate(prefab);
                    prefabObj.parent = this.parentScene.playerLayer
                    this.playerPositions = prefabObj.getComponent(positionAnchorName);
                }

                if(!this.playerPositions){
                    error = {}
                }

                if(error){
                    throw new CreateGameException("Không thể cài đặt vị trí người chơi")
                }else{
                    this._onInitedPlayerLayer();
                }
            })
        } else {
            throw new CreateGameException("Không tìm thấy cài đặt số người chơi tương ứng với game")
        }
    }

    _reset() {
        this.me = undefined;
        this.players = [];
        this._idToPlayerMap = {};
        this._nameToPlayerMap = {};
        this.maxPlayerId = 1
    }

    initPlayers() {
        let users = this.board.room.getPlayerList()
        users && users.forEach(user => {
            if (user.isPlayer()) {
                this._createSinglePlayer(user);
            }
        });

        if(game.config.test && !users || users.length == 0){
            cc.loader.loadRes('game/players/Player', (error, prefab) => {
                let prefabObj = cc.instantiate(prefab);
                this._setPlayerPosition(prefabObj, 1)
                prefabObj.parent = this.parentScene.playerLayer

                prefabObj = cc.instantiate(prefab);
                this._setPlayerPosition(prefabObj, 2)
                prefabObj.parent = this.parentScene.playerLayer

                prefabObj = cc.instantiate(prefab);
                this._setPlayerPosition(prefabObj, 3)
                prefabObj.parent = this.parentScene.playerLayer

                prefabObj = cc.instantiate(prefab);
                this._setPlayerPosition(prefabObj, 4)
                prefabObj.parent = this.parentScene.playerLayer
            });
        }

        this._update();
    }

    _createSinglePlayer(user){

        let playerNode = cc.instantiate(this._playerPrefab);
        let playerClass = game.manager.getPlayerClass(this.gameCode);
        if(playerClass){
            let playerComponent = game.createComponent(playerClass, this.board, user);
            let player = playerNode.addComponent(playerComponent)

            if(player){
                this._setPlayerPosition(playerNode, player)
                this._addToPlayerLayer(playerNode)
                this._addPlayerList(player)
            }
        }
    }

    _addToPlayerLayer(playerNode){
        playerNode.parent = this.parentScene.playerLayer
    }

    _setPlayerPosition(playerNode, player){
        let anchor = this.playerPositions.getPlayerAnchorByPlayerId(player.id, player.isItMe())
        playerNode && anchor && playerNode.setPosition(anchor.getPosition())
    }

    /**
     * This function will be update all feature of player when data change
     *
     * @private
     */
    _update() {

        if(!game.context.getMe()){
            return;
        }

        this.me = this.findPlayer(game.context.getMe().getPlayerId(this.board.room));

        //TODO set board owner & master

        let maxPlayerId = 1;

        this.players.forEach(player => {

            maxPlayerId = Math.max(maxPlayerId, player.id);

            //TODO more action want to apply to player

        })

        this.playerPositions.hideInviteButton(1)

        this.maxPlayerId = maxPlayerId;

    }

    _updateMaxPlayerId() {
        let maxPlayerId = 1;

        this.players.forEach(player => {
            maxPlayerId = Math.max(maxPlayerId, player.id);
        })

        this.maxPlayerId = maxPlayerId;
    }

    _addPlayerList(player) {
        if(!player){
            return;
        }

        let playerIndex = this._findPlayerIndex(player.id)
        if (playerIndex < 0) {
            this.players.push(player);
        }else{
            this.players[playerIndex] = player;
        }
    }

    isSpectator() {
        return (!this.me || (!this.me.isPlaying() && this.board.isPlaying()));
    }

    isMePlaying() {
        return !this.isSpectator() && this.me.isPlaying();
    }

    isShouldMeReady() {
        return this.Me && !this.me.isOwner() && !this.me.isReady();
    }

    findPlayer(idOrName) {
        if (idOrName instanceof Number) {
            return this._idToPlayerMap[idOrName];
        } else {
            return this._nameToPlayerMap[idOrName];
        }
    }

    _findPlayerIndex(playerId) {
        let playerIndex = -1;
        this.players.some((value, index) => {
            if (value.id == playerId) {
                playerIndex = index;
                return true;
            }
        })
        return playerIndex;
    }

    _addPlayer(player) {
        let playerInMap = this._idToPlayerMap[player.id];
        let index = playerInMap && _findPlayerIndex(playerInMap.id);

        if (index && index >= 0) {
            this.players[index] = player
        } else {
            this.players.push(player);
        }

        this._idToPlayerMap[player.id] = player;
        this._nameToPlayerMap[player.user.name] = player;
        this._update()
    }

    _removePlayer(player) {
        this.players.some((value, i, arr) => {
            if (value.id == player.id) {

                this.players.splice(i, 1)
                delete this._idToPlayerMap[player.id]
                delete this._idToPlayerMap[player.user.name]

                this._update()

                return true;
            }
        })
    }

    _replaceUser(player, newId) {

        let oldUser = player.user;
        if (oldUser == null) {
            return;
        }

        let userObj = [];
        userObj.push(newId);
        userObj.push(oldUser.name);
        userObj.push(oldUser.privilegeId);
        userObj.push(player.id);
        userObj.push(this.__getUserVariablesData(oldUser));

        let newUser = SFS2X.Entities.SFSUser.fromArray(userObj, this.board.room);
        newUser._setUserManager(game.service.client.userManager);

        this.board.room._removeUser(oldUser);

        game.service.client.userManager._removeUser(oldUser);
        game.service.client.userManager._addUser(newUser);

        this.board.room._addUser(newUser);
        player.setUser(newUser);
    }

    countPlayingPlayers() {
        var count = 0;
        this.players.forEach(player => {
            if ((this.board.isPlaying() || this.board.isStarting()) && player.isPlaying())
                count++;
        })

        return count;
    }

    getPlayerSeatId(playerId) {
        return this.board.positionManager.getPlayerSeatId(playerId);
    }

    getPlayerPosition(playerId) {
        return this.board.positionManager.getPlayerSeatPosition(playerId);
    }

    onBoardMinBetChanged() {
        this.players.forEach(player => {
            !player.isOwner() && player.resetReadyState()
        })
    }

    onBoardMasterChanged(master) {
        this.players.forEach(player => player.onBoardMasterChanged())
    }

    onBoardOwnerChanged(owner) {
        this.players.forEach(player => player.onBoardOwnerChanged())
    }

    playerOnBoardBegin(data) {
        this.players.forEach(player => player.onBoardBegin(data));
    }

    playerOnBoardStarting(data) {
        this.players.forEach(player => player.onBoardStarting(data));
    }

    playerOnBoardStarted(data) {
        this.players.forEach(player => player.onBoardStarted(data));
    }

    playerOnBoardPlaying(data) {
        this.players.forEach(player => player.onBoardPlaying(data));
    }

    playerOnBoardEnd(data) {
        this.players.forEach(player => player.onBoardEnd(data));
    }

    playerOnPlayerRejoin(playerIds, remainCardSizes, data) {
        playerIds && playerIds.forEach((id, i) => {
            var player = this.findPlayer(playerIds[i]);
            player.onRejoin(remainCardSizes[i], data);
        })
    }

    onPlayerToSpectator(user) {
        this.players.forEach(player => {
            player.onPlayerToSpectator(user);
        })
    }

    onSpectatorToPlayer(user) {
        this.players.forEach(player => {
            player.onSpectatorToPlayer(user);
        })
    }

    onPlayerLeaveBoard(playerOrIdOrName) {
        var leaveBoardPlayer = playerOrIdOrName instanceof Player ? playerOrIdOrName : this.findPlayer(playerOrIdOrName);

        if (leaveBoardPlayer) {
            if (leaveBoardPlayer.isItMe()) {
                leaveBoardPlayer.stopTimeLine();
            } else {
                if (leaveBoardPlayer.isMaster()) {
                    this.board.setMaster(null);
                }

                this._removePlayer(leaveBoardPlayer);
            }
        }
    }

    _shouldLeaveBoardImmediately(player) {
        if (player && player.hasOwnProperty('isTurn') && typeof(player.isTurn) == "function") {
            return !(this.board.isPlaying() && player.isTurn());
        } else {
            return !(this.board.isPlaying());
        }

    }

    onUserEnterRoom(user, room) {
        if (user && user.isPlayer() && !this.findPlayer(user.getPlayerId(room))) {

            let newPlayer = this._addPlayer(user);

            let boardState = this.board.isPlaying() || this.board.isStarting() ? game.const.boardState.PLAYING
                : this.board.isBegin() ? game.const.boardState.BEGIN
                : this.board.isReady() ? game.const.boardState.READY
                : this.board.isEnding() ? game.const.boardState.ENDING
                : undefined;

            if (boardState) {
                newPlayer.applyBoardState(boardState);
            }

            return true;
        }
    }

    onPlayerMessage(sender, message) {
        this.players.some(player => {
            if (player.name === sender.name) {
                player.say(message);
            }
        })
    }

    onMeRejoinGame(resObj) {
        if (this.isMePlaying()) {
            //TODO
        }
    }

    onPlayerReEnterGame(playerId, newUserId) {
        let player = this.findPlayer(playerId);
        if (player) {
            this._replaceUser(player, newUserId);
        }
    }

    handlePlayer(playerId, cmd, data) {

    }
}

game.createComponent(PlayerManager)