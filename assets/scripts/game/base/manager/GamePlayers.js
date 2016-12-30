/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';
import {utils, GameUtils} from 'utils';
import SFS2X from 'SFS2X';
import Component from 'components';
import {gameManager, Player, PlayerRenderer} from 'game';
import {CreateGameException} from 'exceptions';
import {Events} from 'events'

export default class GamePlayers extends Component {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            playerPrefab: cc.Prefab,
            playerClassName: ""
        }

        this.me = null;
        this.owner = null;
        this.ownerId = null;
        this.master = null;
        this.board = null;
        this.scene = null;
        this.players = null;
        this.maxPlayerId = 1;
        this._idToPlayerMap = null;
        this._nameToPlayerMap = null;
        this.initLayerDoneCb = null;
        this.exittedPlayers = null;
        this.playerPositions = null;
        this.notifyWhenMasterChanged = false;
    }

    onEnable() {
        super.onEnable();

        this.scene = app.system.currentScene;
        this.board = this.scene.board;
        this.gameCode = (this.board && this.board.gameCode) || (app.config.test ? "tnd" : "");
        this.playerPositions = this.scene.playerPositions;
        this._initGamePlayerProperties();
        this.initPlayers();

        this.scene.on(Events.ON_USER_EXIT_ROOM, this._onUserExitGame, this);
        this.scene.on(Events.ON_ROOM_CHANGE_OWNER, this._onChangeRoomOwner, this);
        this.scene.on(Events.ON_GAME_STATE_ENDING, this._onGameEnding, this);
    }

    onLoad() {
    }

    isMeReady(){
        return this.me && this.me.isReady();
    }

    isItMe(id) {
        return this.me && this.me.id == id;
    }

    _init(board, scene, cb) {
        this.board = board;
        this.scene = scene;
        this.initLayerDoneCb = cb;
    }

    _onGameEnding(data){
        let masterPlayerId = utils.getValue(data, app.keywords.MASTER_PLAYER_ID);
        if(masterPlayerId){
            let masterPlayer = this.findPlayer(masterPlayerId);
            this.setMaster(masterPlayer);
            this.scene.gameData[app.keywords.MASTER_PLAYER_ID] = masterPlayerId;
            this.scene.emit(Events.ON_GAME_MASTER_CHANGED, masterPlayerId, masterPlayer);
        }
    }

    setMaster(masterPlayer){
        if(!masterPlayer || (this.master && this.master.id == masterPlayer.id)) return;

        this.notifyWhenMasterChanged && app.system.showToast(app.res.string('game_change_master_to_player', {playerName: masterPlayer.user.name}))

        this.master && this.master.setMaster(false);
        this.master = masterPlayer;
        this.master.setMaster(true);
    }

    _onPlayerReEnterGame(playerId, userId) {
        let player = this.findPlayer(playerId);
        player && this._replaceUser(player, userId);
    }

    _onChangeRoomOwner(room) {

        if (room.id != this.board.room.id) {
            return;
        }

        let newOwner = null;
        let ownerId = utils.getVariable(room, app.keywords.VARIABLE_OWNER);
        if (ownerId && (!this.owner || ownerId == this.owner.id)) {
            this.owner && this.owner.setOwner(false);
            newOwner = this.findPlayer(ownerId);
        }

        this.owner = newOwner;
        this.owner && this.owner.setOwner(true);
        this.ownerId = ownerId;
    }

    _onUserExitGame(user, room) {
        let player = this.findPlayer(user.name);

        if (player) {
            player.isReady() && this.exittedPlayers.push({
                id: player.id,
                name: player.user.name,
                balance: GameUtils.getUserBalance(player.user)
            });

            if (!this.scene.isBegin()) {
                this.playerPositions.hideAnchor(player.anchorIndex);
            }

            this._removePlayer(player);
        }
        //If not found player mean user just spectator
        else {
            if (user.isItMe) {
                this.scene.goBack();
            }
        }
    }

    filterPlayingPlayer(playerIds) {
        let playingPlayerIds = [];

        this.exittedPlayers.forEach(quitPlayerInfo => {
            playingPlayerIds.push(quitPlayerInfo.id)
        });
        this.players.forEach(player => {
            player.isReady() && playingPlayerIds.push(player.id)
        });

        return playingPlayerIds;
    }

    _initGamePlayerProperties() {
        this.me = null;
        this.players = [];
        this.exittedPlayers = [];
        this._idToPlayerMap = {};
        this._nameToPlayerMap = {};
        this.maxPlayerId = 1;
    }

    initPlayers() {
        let users = this.board.room.getPlayerList();
        users && users.forEach(user => {
            user.isPlayer() && this._createSinglePlayer(user);
        });

        this._onPlayerDataChanged();
    }

    _createSinglePlayer(user) {

        let playerNode = cc.instantiate(this.playerPrefab);
        let player = playerNode.getComponent(this.playerClassName) || (playerNode._components && playerNode._components[0]);

        if (player) {
            player._init(this.board, user);
            this._addToPlayerLayer(playerNode, player);
            this._addPlayerToList(player);
        }

        return player;
    }

    _addToPlayerLayer(playerNode, player) {
        playerNode.parent = this.scene.playerLayer;
        this.playerPositions.hideInviteButtonByPlayerId(player.id);
    }

    updateBoardMaster(boardInfoObj = this.scene.gameData) {
        let masterPlayerId = utils.getValue(boardInfoObj, app.keywords.MASTER_PLAYER_ID);
        if (masterPlayerId) {
            this.setMaster(this.findPlayer(masterPlayerId));
        }else if(boardInfoObj.masterIdOwner){
            this.setMaster(this.owner);
        }
    }

    /**
     * This function will be update all feature of player when data change
     *
     * @private
     */
    _onPlayerDataChanged() {

        if (!app.context.getMe()) {
            return;
        }

        this.me = this.findPlayer(app.context.getMe().getPlayerId(this.board.room));

        this._onChangeRoomOwner(this.board.room);

        //TODO change board master
        let maxPlayerId = 1;
        this.players.forEach(player => {
            maxPlayerId = Math.max(maxPlayerId, player.id);

            //TODO more action want to apply to player

        });

        this.maxPlayerId = maxPlayerId;
    }

    isOwner(playerId) {
        return playerId == this.ownerId;
    }

    meIsOwner() {
        return this.me && this.ownerId == this.me.id;
    }

    _updateMaxPlayerId() {
        let maxPlayerId = 1;

        this.players.forEach(player => {
            maxPlayerId = Math.max(maxPlayerId, player.id);
        });

        this.maxPlayerId = maxPlayerId;
    }

    _addPlayerToList(player) {
        if (!player) {
            return;
        }

        let playerIndex = this._findPlayerIndex(player.id);
        if (playerIndex < 0) {
            this.players.push(player);
        } else {
            this.players[playerIndex] = player;
        }

        this._idToPlayerMap[player.id] = player;
        this._nameToPlayerMap[player.user.name] = player;
    }

    isSpectator() {
        return (!this.me || (!this.me.isPlaying() && this.board.isPlaying()));
    }

    isMePlaying() {
        return this.me && this.me.isPlaying();
    }

    isMePlayGame() {
        return this.me;
    }

    isShouldMeReady() {
        return this.me && !this.me.isOwner() && !this.me.isReady();
    }

    findPlayer(idOrName) {
        return idOrName && (utils.isNumber(idOrName) ? this._idToPlayerMap[idOrName] : this._nameToPlayerMap[idOrName]);
    }

    _findPlayerIndex(playerId) {
        let playerIndex = -1;
        this.players.some((value, index) => {
            if (value.id == playerId) {
                playerIndex = index;
                return true;
            }
        });
        return playerIndex;
    }

    _addPlayer(user) {
        let newPlayer = this._createSinglePlayer(user);
        // this._onPlayerDataChanged()
        return newPlayer;
    }

    _removePlayer(player) {
        this.players.some((value, i, arr) => {
            if (value.id == player.id) {

                this.players.splice(i, 1);
                delete this._idToPlayerMap[player.id];
                delete this._idToPlayerMap[player.user.name];

                this.scene.playerLayer.removeChild(player.node);
                this.playerPositions.showInviteButtonByPlayerId(player.id);
                this._onPlayerDataChanged();

                return true;
            }
        });

    }

    _replaceUser(player, newId) {

        let oldUser = player.user;
        if (!oldUser) {
            return;
        }

        let userObj = [];
        userObj.push(newId);
        userObj.push(oldUser.name);
        userObj.push(oldUser.privilegeId);
        userObj.push(player.id);
        userObj.push(this._getUserVariablesData(oldUser));

        let newUser = SFS2X.Entities.SFSUser.fromArray(userObj, this.board.room);
        newUser._setUserManager(app.service.client.userManager);

        this.board.room._removeUser(oldUser);

        app.service.client.userManager._removeUser(oldUser);
        app.service.client.userManager._addUser(newUser);

        this.board.room._addUser(newUser);
        player.user = newUser;
    }

    countPlayingPlayers() {
        var count = 0;
        this.players.forEach(player => {
            if ((this.board.isPlaying() || this.board.isStarting()) && player.isPlaying())
                count++;
        });

        return count;
    }

    onBoardMinBetChanged() {
        this.players.forEach(player => {
            !player.isOwner() && player.resetReadyState();
        });
    }

    onBoardMasterChanged(master) {
        this.players.forEach(player => player.onBoardMasterChanged(master));
    }

    onBoardOwnerChanged(owner) {
        this.players.forEach(player => player.onBoardOwnerChanged());
    }

    onGameBegin(data) {

    }

    onGameStarting(data) {

    }

    onGameStarted(data) {

    }

    onGamePlaying(data) {

    }

    onGameEnding(data) {

    }

    playerOnPlayerRejoin(playerIds, remainCardSizes, data) {
        playerIds && playerIds.forEach((id, i) => {
            var player = this.findPlayer(playerIds[i]);
            player.onRejoin(remainCardSizes[i], data);
        });
    }

    onPlayerToSpectator(user) {
        this.players.forEach(player => {
            player.onPlayerToSpectator(user);
        });
    }

    onSpectatorToPlayer(user) {
        this.players.forEach(player => {
            player.onSpectatorToPlayer(user);
        });
    }

    onPlayerLeaveBoard(playerOrIdOrName) {
        var leaveBoardPlayer = playerOrIdOrName instanceof Player ? playerOrIdOrName : this.findPlayer(playerOrIdOrName);

        if (leaveBoardPlayer) {
            if (leaveBoardPlayer.isItMe()) {
                leaveBoardPlayer.stopTimeLine();
            } else {
                if (leaveBoardPlayer.isMaster) {
                    this.setMaster(null);
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

            if (newPlayer) {
                let boardState = this.board.isPlaying() || this.board.isStarting() ? app.const.game.state.PLAYING
                    : this.board.isBegin() ? app.const.game.state.BEGIN
                    : this.board.isReady() ? app.const.game.state.READY
                    : this.board.isEnding() ? app.const.game.state.ENDING
                    : undefined;

                boardState && newPlayer.changeGameState(boardState);
            }

            return true;
        }
    }

    onPlayerMessage(sender, message) {
        this.players.some(player => {
            if (player.name === sender.name) {
                player.say(message);
            }
        });
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

    // onDealCards(cards) {
    //     //TODO
    //     this.players.forEach(player => player.isReady() && (player.isItMe() ? player.setCards(cards) : player.createFakeCards()));
    // }

    getPlayerHandCardLists() {
        let cardLists = [];
        this.players.forEach(player => {
            !player.isItMe() && cardLists.splice(player.anchorIndex, 0, player.renderer.cardList);
        });

        return cardLists;
    }

    getCurrentPlayerBalances(playerIds) {
        let playerBalances = {};

        this.players.forEach(player => {
            playerBalances[player.id] = GameUtils.getUserBalance(player.user)
        });

        return playerBalances;
    }

    getBasicPlayerInfo(playerIds) {
        let playerInfos = {};

        if (!utils.isEmptyArray(playerIds)) {
            this.exittedPlayers.forEach(info => playerInfos[info.id] = info);
            this.players.forEach(player => playerInfos[player.id] = {
                id: player.id,
                name: player.user.name,
                balance: GameUtils.getUserBalance(player.user)
            });
        }

        return playerInfos;
    }

    getNextNeighbour(lastPlayedId) {
        return this._getNeighbour(lastPlayedId, true);
    }

    getPreviousNeighbour(lastPlayedId) {
        return this._getNeighbour(lastPlayedId, false);
    }

    _getNeighbour(lastPlayedId, isNext) {

        let count = 0;
        let findPlayerId = lastPlayedId;
        let retPlayer = null;
        do {
            findPlayerId = isNext ? this.playerPositions.getNextNeighbourID(findPlayerId) : this.playerPositions.getPreviousNeighbourPlayerID(findPlayerId);
            retPlayer = this.findPlayer(findPlayerId);

            if (retPlayer != null && lastPlayedId == retPlayer.id) return null;

            if(count++ > 4) break;

        } while (retPlayer == null || !retPlayer.isPlaying());

        return retPlayer;
    }
}

app.createComponent(GamePlayers);