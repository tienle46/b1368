/**
 * Created by Thanh on 8/23/2016.
 */

import game from 'game'
import Player from 'Player'
import SFS2X from 'SFS2X'

export default class PlayerManager {
    constructor() {
        this.board = null
            this.me = null
            this.players = null
            this._idToPlayerMap = null
            this._nameToPlayerMap = null
            this.maxPlayerId = 1
    }

    _init(board){
        this.board = board;
        this._reset();
    }

    _reset(){
        this.me = undefined;
        this.players = [];
        this._idToPlayerMap = {};
        this._nameToPlayerMap = {};
        this.maxPlayerId = 1
    }

    initPlayers(users){
        users.forEach(user => {
            this._insertPlayerFromUser(user);
        });

        this._update();
    }

    /**
     * This function will be update all feature of player when data change
     *
     * @private
     */
    _update(){

        this.me = this.findPlayer(game.context.getMySelf().getPlayerId(this.board.room));

        //TODO set board owner & master


        let maxPlayerId = 1;

        this.players.forEach(player => {

            maxPlayerId = Math.max(maxPlayerId, player.id);

            //TODO more action want to apply to player

        })

        this.maxPlayerId = maxPlayerId;

    }

    _updateMaxPlayerId(){
        let maxPlayerId = 1;

        this.players.forEach(player => {
            maxPlayerId = Math.max(maxPlayerId, player.id);
        })

        this.maxPlayerId = maxPlayerId;
    }


    _insertPlayerFromUser (user) {
        if (user.isPlayer()) {
            let player = Player.create(this.board, user);
            this._addPlayerToBoard(player);
        }

    }

    _addPlayerToBoard(player){
        if (this.players.indexOf(player) < 0) {

            //TODO add player ui to board

            this.players.push(player);
        }
    }

    isSpectator () {
        return (!game.me || (!this.me.isPlaying() && this.board.isPlaying()));
    }

    isMySelfPlaying () {
        return !this.isSpectator() && this.me.isPlaying();
    }

    isShouldMySelfReady () {
        return this.me && !this.me.isOwner() && !this.me.isReady();
    }

    findPlayer (idOrName) {
        if (idOrName instanceof Number) {
            return this._idToPlayerMap[idOrName];
        } else {
            return this._nameToPlayerMap[idOrName];
        }
    }

    _findPlayerIndex(playerId){
        let playerIndex = -1;
        this.players.some((value, index) => {
            if (value.id == playerId) {
                playerIndex = index;
                return true;
            }
        })
        return playerIndex;
    }

    _addPlayer(player){
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

    _removePlayer (player) {
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

    _replaceUser (player, newId) {

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
        newUser._setUserManager( game.service.client.userManager);

        this.board.room._removeUser(oldUser);

        game.service.client.userManager._removeUser(oldUser);
        game.service.client.userManager._addUser(newUser);

        this.board.room._addUser(newUser);
        player.setUser(newUser);
    }

    countPlayingPlayers () {
        var count = 0;
        this.players.forEach(player => {
            if ((this.board.isPlaying() || this.board.isStarting()) && player.isPlaying())
                count++;
        })

        return count;
    }

    getPlayerSeatId (playerId) {
        return this.board.positionManager.getPlayerSeatId(playerId);
    }

    getPlayerPosition (playerId) {
        return this.board.positionManager.getPlayerSeatPosition(playerId);
    }

    onBoardMinBetChanged () {
        this.players.forEach(player => {
            !player.isOwner() && player.resetReadyState()
        })
    }

    onBoardMasterChanged (master) {
        this.players.forEach(player => player.onBoardMasterChanged())
    }

    onBoardOwnerChanged (owner) {
        this.players.forEach(player => player.onBoardOwnerChanged())
    }

    playerOnBoardBegin (data) {
        this.players.forEach(player => player.onBoardBegin(data));
    }

    playerOnBoardStarting (data) {
        this.players.forEach(player => player.onBoardStarting(data));
    }

    playerOnBoardStarted (data) {
        this.players.forEach(player => player.onBoardStarted(data));
    }

    playerOnBoardPlaying (data) {
        this.players.forEach(player => player.onBoardPlaying(data));
    }

    playerOnBoardEnd (data) {
        this.players.forEach(player => player.onBoardEnd(data));
    }

    playerOnPlayerRejoin (playerIds, remainCardSizes, data) {
        playerIds && playerIds.forEach((id, i) => {
            var player = this.findPlayer(playerIds[i]);
            player.onRejoin(remainCardSizes[i], data);
        })
    }

    onPlayerToSpectator (user) {
        this.players.forEach(player => {
            player.onPlayerToSpectator(user);
        })
    }

    onSpectatorToPlayer (user) {
        this.players.forEach(player => {
            player.onSpectatorToPlayer(user);
        })
    }

    onPlayerLeaveBoard (playerOrIdOrName) {
        var leaveBoardPlayer = playerOrIdOrName instanceof Player ? playerOrIdOrName : this.findPlayer(playerOrIdOrName);

        if (leaveBoardPlayer) {
            if (leaveBoardPlayer.isMe()) {
                leaveBoardPlayer.stopTimeLine();
            } else {
                if (leaveBoardPlayer.isMaster()) {
                    this.board.setMaster(null);
                }

                this._removePlayer(leaveBoardPlayer);
            }
        }
    }

    _shouldLeaveBoardImmediately (player) {
        if (player && player.hasOwnProperty('isTurn') && typeof(player.isTurn) == "function") {
            return !(this.board.isPlaying() && player.isTurn());
        } else {
            return !(this.board.isPlaying());
        }

    }

    onUserEnterRoom (user, room) {
        if (user && user.isPlayer() && !this.findPlayer(user.getPlayerId(room))) {

            let newPlayer = this._addPlayer(user);

            let boardState = this.board.isPlaying() || this.board.isStarting() ? game.const.boardState.PLAYING
                : this.board.isBegin() ? game.const.boardState.BEGIN
                : this.board.isReady() ? game.const.boardState.READY
                : this.board.isEnding() ? game.const.boardState.ENDING
                : undefined;

            if(boardState){
                newPlayer.applyBoardState(boardState);
            }

            return true;
        }
    }

    onPlayerMessage (sender, message) {
        this.players.some(player => {
            if (player.name === sender.name) {
                player.say(message);
            }
        })
    }

    onMyselfRejoinGame (resObj) {
        if (this.isMySelfPlaying()) {
            //TODO
        }
    }

    onPlayerReEnterGame (playerId, newUserId) {
        let player = this.findPlayer(playerId);
        if (player) {
            this._replaceUser(player, newUserId);
        }
    }


    handlePlayer(playerId, cmd, data){

    }
}

// var PlayerManager = cc.Class({
//
//     properties: {
//         board: null,
//         me: null,
//         players: null,
//         _idToPlayerMap: null,
//         _nameToPlayerMap: null,
//         maxPlayerId: 1,
//     }
//
//
//
// });

PlayerManager.newInstance = function (board) {
    let instance = new PlayerManager();
    instance._init(board);
    return instance;
};

module.exports = PlayerManager;