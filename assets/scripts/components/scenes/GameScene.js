import app from 'app';
import { utils, GameUtils } from 'utils';
import { Keywords } from 'core';
import { BaseScene } from 'scenes';
import { Events, Emitter } from 'events'
import { CreateGameException } from 'exceptions';
import { gameManager, GameEventHandler, Board, TLMNDLBoard, TLMNDLPlayer } from 'game';
import GamePlayers from 'GamePlayers';
import GameChatComponent from "GameChatComponent";
import Props from "../Props";
import ArrayUtils from 'ArrayUtils';
import CCUtils from 'CCUtils';

export default class GameScene extends BaseScene {

    constructor() {
        super();

        this.properties = {
            ...this.properties,
            boardNode: cc.Node,
            gameMenuNode: cc.Node,
            gameControlsNode: cc.Node,
            playerLayer: cc.Node,
            chatComponentNode: cc.Node,
            tableNameLabel: cc.Label,
            tableMinBetLabel: cc.Label,
            playerPositionAnchorsNode: cc.Node,
            maxPlayers: 4
        }

        /**
         * @type {IngameChatComponent}
         */
        this.chatComponent = null;
        /**
         * @type {SFSRoom}
         */
        this.room = null;
        /**
         * @type {Board}
         */
        this.board = null;
        /**
         * @type {GameMenu}
         */
        this.gameMenu = null;
        /**
         * @type {GamePlayers}
         */
        this.gamePlayers = null;
        /**
         * @type {GameControls}
         */
        this.gameControls = null;
        /**
         * @type {GameEventHandler}
         */
        this.gameEventHandler = null;
        this.gameCode = null;
        this.gameState = null;
        this.gameData = null;
        this._penddingEvents = null;
        this.gameContext = null;
        this.isSoloGame = false;
        this.firstTimePlay = undefined;
    }

    setFirstTimePlay(firstTimePlay){
        this.firstTimePlay = firstTimePlay
    }

    _addGlobalListener() {
        super._addGlobalListener();

        this.on(Events.ON_GAME_STATE_CHANGE, (...args) => {
            this.initiated ? this._onGameStateChange(...args) : (this._penddingEvents.push({
                fn: this._onGameStateChange,
                args: args
            }))
        }, this, 1);

        this.on(Events.ON_USER_EXIT_ROOM, this._onUserExitGame, this, 0);
        this.on(Events.ON_ACTION_EXIT_GAME, this._onActionExitGame, this);
        this.on(Events.ON_PLAYER_CHAT_MESSAGE, this._onPlayerChatMessage, this, 0);
        this.on(Events.ON_ACTION_LOAD_GAME_GUIDE, this._onActionLoadGameGuide, this);
        this.on(Events.VISIBLE_INGAME_CHAT_COMPONENT, this._onVisibleIngameChatComponent, this);
        this.on(Events.ON_GAME_LOAD_DATA_AFTER_SCENE_START, this._loadGameDataAfterSceneStart, this);
        this.on(Events.ON_ROOM_CHANGE_MIN_BET, this._onRoomMinBetChanged, this);
        this.on(Events.ON_PLAYER_READY_STATE_CHANGED, this._onPlayerReadyStateChanged, this);
        this.on(Events.ON_PLAYER_REGISTER_QUIT_ROOM, this._handleRegisterQuitRoom, this);
        this.on(Events.ON_GAME_STATE_STARTING, this._onGameStarting, this);
    }

    _onGameStarting(){
        this.firstTimePlay = false
    }
    
    _handleRegisterQuitRoom(data){
        if (data && data[app.keywords.SUCCESSFULL]) {
            app.system.showToast(data[app.keywords.MESSAGE] || app.res.string("game_registered_quit_room"));

            let register = data[app.keywords.REGISTER];
            if(register){
                CCUtils.setVisible(this.gameMenu.menuLock, true);
            }else{
                CCUtils.setVisible(this.gameMenu.menuLock, false);
            }
        }
    }

    setSoloGame(solo = false){
        this.isSoloGame = solo
    }

    clearReadyPlayer(){
        this._assertReadyPlayersInited()
        this.gameData[app.keywords.ROOM_READY_PLAYERS].length = 0
    }

    _onUserExitGame(user, room) {
        if(!user || !room) return;
        
        if (this.room.id == room.id) {
            let playerId = user.getPlayerId(this.board.room);
            playerId > 0 && this._onPlayerReadyStateChanged(playerId, false);
        }
    }

    _onPlayerReadyStateChanged(playerId, ready) {

        /**
         * Make sure that ROOM_READY_PLAYERS is inited by call this method
         */
        this._assertReadyPlayersInited()
        let readyPlayerIds = utils.getValue(this.gameData, app.keywords.ROOM_READY_PLAYERS);

        if (ready) {
            this._addToReadyPlayers(playerId)
        } else {
            ArrayUtils.remove(readyPlayerIds, playerId);
        }
    }

    _onUserExitRoom(user, room, playerId) {
        this._assertReadyPlayersInited();
        let readyPlayerIds = utils.getValue(this.gameData, app.keywords.ROOM_READY_PLAYERS, [])
        readyPlayerIds && ArrayUtils.remove(readyPlayerIds, playerId)
    }

    _onPlayerChatMessage(sender, message) {
        if (!this.gameContext.messages) {
            this.gameContext.messages = [];
        }
        this.gameContext.messages.push({ sender: sender.name, message });
        if (this.gameContext.messages.length > app.const.NUMBER_MESSAGES_KEEP_INGAME) {
            this.gameContext.messages.shift();
        }
    }

    _onVisibleIngameChatComponent() {
        this.chatComponent.setVisible();
    }

    handleRejoinGame(...args) {
        this.initiated ? this._onGameRejoin(...args) : (this._penddingEvents.push({
            fn: this._onGameRejoin,
            args: args
        }));
    }

    onLoad() {
        super.onLoad();

        this.firstPlayTime = true;
        this.gameContext = {};
        this.gameData = {};
        this._penddingEvents = [];
        this.gameMenu = this.gameMenuNode.getComponent('GameMenuPrefab')

        this.isSoloGame = GameUtils.isSoloGame(app.context.currentRoom)
        
        this.node.children.forEach(child => { child.opacity = 255 });
        Object.values(app.res.asset_tools).length < 1 && this._loadAssetTools();
    }

    _loadAssetTools() {
        cc.loader.loadResDir('props/thumbs', cc.SpriteFrame, (err, assets) => {
            if (err) {
                cc.error(err);
                return;
            }

            assets = assets.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0);
            let vips = [];
            Object.keys(app.res.vip_tools).forEach(name => {
                let index = assets.findIndex(asset => asset.name === name);
                if(index > -1){
                    vips.push(assets[index]);
                    assets.splice(index, 1);
                }
            });
            assets = [...assets, ...vips].forEach((asset, index) => {
                app.res.asset_tools[asset.name] = {
                    id: index,
                    name: asset.name,
                    spriteFrame: asset
                };
            });
        });
    }

    _onRoomMinBetChanged() {
        this._setGameMinBetInfo();
    }

    _setGameInfo(room) {
        this._setTableNameLabel();
        this._setGameMinBetInfo();
    }

    _setGameMinBetInfo() {
        let minBet = utils.getVariable(this.room, app.keywords.VARIABLE_MIN_BET, "");
        this.tableMinBetLabel && (this.tableMinBetLabel.string = 'Cược ' + GameUtils.formatBalanceShort(minBet));
    }

    _setTableNameLabel() {
        let gameName = app.const.gameLabels[this.gameCode] || "";
        let roomName = this.room.name.substring(3, 5);
        let tableName = this.room.name.substring(5, this.room.name.length) || "";

        this.tableNameLabel.string = this.gameCode != app.const.gameCode.XOC_DIA ? app.res.string('game_table_name', { tableName, gameName }) : `Bàn ${tableName}`;
    }

    onEnable() {
        super.onEnable();

        app.system.setCurrentScene(this);
        this.chatComponent = this.chatComponentNode.getComponent('GameChatComponent');
        this.gamePlayers = this.playerLayer.getComponent('GamePlayers');


        try {
            this.room = app.context.currentRoom;

            if (this.room && this.room.isGame) {
                this.gameCode = utils.getGameCode(this.room);
                this.gameData = this.room.getVariable(app.keywords.VARIABLE_GAME_INFO).value
            }

            if (!this.gameData) {
                throw new CreateGameException(app.res.string('error_fail_to_load_game_data'));
            }

            if(!app.context.rejoiningGame){
                let me = app.context.getMe();
                let ownerId = utils.getVariable(this.room, app.keywords.VARIABLE_OWNER);


                if(me && ownerId && me.getPlayerId(this.room) == ownerId){
                    this.firstTimePlay = true
                }
            }

            this._setGameInfo(this.room);
            this._loadGameData();

        } catch (e) {
            app.system.enablePendingGameEvent = false;
            e instanceof CreateGameException && this._onLoadSceneFail();
        }

        this._initGameEvents();
    }

    _onGameData(isJustJoined = true) {

        if (this.room && this.room.isGame) {
            this.gameData = this.room.getVariable(app.keywords.VARIABLE_GAME_INFO).value
        }

        if (this.gameData) {
            this._loadGameData(isJustJoined);
        }
    }

    start() {
        super.start();

        app.system.enablePendingGameEvent = false;
        this._handlePendingEvents();

        GameChatComponent.loadEmotions();
        Props.loadAllPropAsset();

        /**
         * set requestRandomInvite = false to make sure player only receive random invite on first time join game group
         */
        app.context.requestRandomInvite = false;
        
        // user sees greeting
        this.gamePlayers && this.gamePlayers.greetingVip(app.context.getMe());
    }

    onDestroy() {
        super.onDestroy();
        this.removeAllListener();
        this.gameEventHandler && this.gameEventHandler.removeGameEventListener();
        this.gameContext = {};
        this.gameData = {};
        app.context.rejoiningGame = false;
        window.release(this._penddingEvents);
        Props.releaseAllPropAsset();
    }

    isPlaying() {
        return this.board.state === app.const.game.state.PLAYING;
    }

    isStarting() {
        return this.board.state === app.const.game.state.STARTING;
    }

    isReady() {
        return this.board.state === app.const.game.state.READY;
    }

    isBegin() {
        return this.board.state === app.const.game.state.BEGIN;
    }

    isNewBoard() {
        return this.board.state === app.const.game.state.INITED;
    }

    isEnding() {
        return this.board.state === app.const.game.state.ENDING;
    }

    _handlePendingEvents() {
        app.system._handlePendingGameEvents();

        this._penddingEvents.forEach(event => event.fn(...event.args));
        this._penddingEvents = [];
    }

    _initGameEvents() {
        this.gameEventHandler = new GameEventHandler(this);
        this.gameEventHandler.addGameEventListener();
    }

    _mergeGameData(newGameData){
        let readyPlayerIds = this.gameData[app.keywords.ROOM_READY_PLAYERS];

        this.gameData = {...this.gameData, ...newGameData}

        readyPlayerIds && this._addToReadyPlayers(...readyPlayerIds)
    }

    _onGameRejoin(data) {
        this._mergeGameData(data);
        let registeredQuitRoom = data["registeredQuitRoom"];
        
        CCUtils.setVisible(this.gameMenu.menuLock, registeredQuitRoom);
        
        let state = utils.getValue(this.gameData, app.keywords.BOARD_STATE_KEYWORD);
        state && this.emit(Events.ON_GAME_STATE_CHANGE, state, this.gameData, true, true);
        this.emit(Events.ON_GAME_REJOIN, data);
    }
    
    handleGameRefresh(data) {
        this.gameData = {...data.gameData, ...data.gamePhaseData};
        this._mergeGameData(data.playerData);
        // this._onGameRejoin(data.playerData);
        this.emit(Events.ON_GAME_REFRESH, data);    
    }
    
    _onActionExitGame() {
        // this.showLoading();
        // app.service.sendRequest(new SFS2X.Requests.System.LeaveRoomRequest(this.room));

        app.service.send({ cmd: app.commands.REGISTER_QUIT_ROOM, room: this.room });
    }

    _onActionLoadGameGuide() {
        app.system.info(app.res.string('coming_soon'));
    }

    _loadGameData(isJustJoined = true) {

        let currentGameState = utils.getValue(this.gameData, Keywords.BOARD_STATE_KEYWORD);
        let isStateAfterReady = GameUtils.isStateAfterReady(currentGameState);
        /**
         * Current is call board._initPlayingData && board._loadGamePlayData directly. But when player or other component need to get data,
         * below line code will be switch to using emit via scene emitter
         */
        if (isStateAfterReady) {
            this.board._initPlayingData(this.gameData);
        }

        this.emit(Events.ON_GAME_LOAD_PLAY_DATA, this.gameData);
        this.emit(Events.ON_GAME_LOAD_DATA_AFTER_SCENE_START, this.gameData, isJustJoined);
    }

    _loadGameDataAfterSceneStart(data, isJustJoined) {

        let currentGameState = utils.getValue(data, Keywords.BOARD_STATE_KEYWORD);
        let isStateAfterReady = GameUtils.isStateAfterReady(currentGameState);

        if (isStateAfterReady) {
            this._loadPlayerReadyState();
            !app.context.rejoiningGame && this._onGameStateChange(currentGameState, data, isJustJoined, true);
        } else {
            this._onGameStateBegin(data, app.context.rejoiningGame)
            this._loadPlayerReadyState();
        }
    }

    _loadPlayerReadyState() {
        this._assertReadyPlayersInited();
        this._updatePlayerReadyState(this.gameData)
    }

    _onLoadSceneFail() {
        this.hideLoading()
        if (app.config.debug) {
            return;
        }

        if (app.service.getClient().isConnected()) {
            app.system.error('Không thể khởi tạo bàn chơi. Quay lại màn hình chọn bàn chơi!', () => {
                app.system.loadScene(app.const.scene.LIST_TABLE_SCENE);
            });
        } else {
            app.system.error('Không thể kết nối với máy chủ. Bạn vui lòng đăng nhập lại để tiếp tục chơi!', () => {
                app.system.loadScene(app.const.scene.LOGIN_SCENE);
            });
        }
    }

    goBack() {

        app.system.setSceneChanging(true);
        app.context.currentRoom && (app.context.currentRoom.isGame = false);
        
        if (app.service.getClient().isConnected()) {
            app.system.loadScene(app.const.scene.LIST_TABLE_SCENE);
        } else {
            app.system.loadScene(app.const.scene.LOGIN_SCENE);
        }
    }

    _onGameStateBegin(data, isJustJoined, isRejoining) {
        if (!isRejoining && this.gameState != app.const.game.state.READY) {
            this.emit(Events.ON_GAME_RESET);
        }
        this.emit(Events.ON_GAME_STATE_BEGIN, data, isJustJoined);
    }

    _onGameStateChange(state, data, isJustJoined, rejoining) {

        state == app.const.game.state.WAIT && this.emit(Events.ON_GAME_WAIT)

        if (this.gameState == app.const.game.state.WAIT) {
            this.gameState = app.const.game.state.READY;
            this.gameData[Keywords.BOARD_STATE_KEYWORD] = app.const.game.state.READY;
            this._onGameData();
        }

        this.gameState = state;
        this.gameLocalState = GameUtils.convertToLocalGameState(state);

        if (this.gameState == app.const.game.state.WAIT) {
            this.emit(Events.ON_GAME_RESET);
            return;
        }

        this.emit(Events.ON_GAME_STATE_PRE_CHANGE, state, data, isJustJoined);

        switch (this.gameLocalState) {
            case app.const.game.state.BEGIN:
                app.jarManager.closeJarExplosive();
                this._onGameStateBegin(data, isJustJoined, rejoining);
                break;
            case app.const.game.state.STARTING:
                this.emit(Events.ON_GAME_STATE_STARTING, data, isJustJoined);
                break;
            case app.const.game.state.STARTED:
                this.emit(Events.ON_GAME_STATE_STARTED, data, isJustJoined);
                break;
            case app.const.game.state.PLAYING:
                this.emit(Events.ON_GAME_STATE_PLAYING, data, isJustJoined);
                break;
            case app.const.game.state.ENDING:
                this.emit(Events.ON_GAME_STATE_ENDING, data, isJustJoined);
            
                let jarExplosiveData = utils.getVariable(this.room, app.keywords.JAR_EXPLOSIVE);
                if(jarExplosiveData) {
                    let usernames = jarExplosiveData[app.keywords.USERNAME_LIST] || [],
                    moneyList = jarExplosiveData[app.keywords.MONEY_LIST] || [],
                    messages = jarExplosiveData['msl'] || [];
                    usernames.forEach((username, index) => {
                        this.emit(Events.ON_USER_MAKES_JAR_EXPLOSION, username, messages[index] || null, moneyList[index]);
                    });
                }
                break;
            default:
                this.emit(Events.ON_GAME_STATE, this.gameState, data, isJustJoined);
        }

        this._updatePlayerReadyState(data);
        this.emit(Events.ON_GAME_STATE_CHANGED, state, data, isJustJoined);
    }

    updatePlayerReadyFromGameData() {
        this._updatePlayerReadyState(this.gameData);
    }

    _updatePlayerReadyState(data, persistToGameData = false) {
        if (data.hasOwnProperty(app.keywords.ROOM_READY_PLAYERS)) {

            let readyPlayerIds = utils.getValue(data, app.keywords.ROOM_READY_PLAYERS, []);
            if (readyPlayerIds.length > 0) {
                readyPlayerIds.forEach(playerId => {
                    let player = this.gamePlayers.findPlayer(playerId);
                    player && this.emit(Events.ON_PLAYER_READY_STATE_CHANGED, player.id, true, player.isItMe());
                });

            }

            this._addToReadyPlayers(...readyPlayerIds);
        }
    }
    
    _assertReadyPlayersInited(){
        if(!this.gameData[app.keywords.ROOM_READY_PLAYERS]){
            this.gameData[app.keywords.ROOM_READY_PLAYERS] = []
        }
    }

    _addToReadyPlayers(...playerIds){
        this._assertReadyPlayersInited();
        let readyPlayerIds = this.gameData[app.keywords.ROOM_READY_PLAYERS];
        playerIds.forEach(id => {
            readyPlayerIds.indexOf(id) < 0 && readyPlayerIds.push(id)
        })
    }

    checkReadyPlayer(player) {
        this._assertReadyPlayersInited()
        let readyPlayerIds = utils.getValue(this.gameData, app.keywords.ROOM_READY_PLAYERS);
        return readyPlayerIds.indexOf(player.id) >= 0;
    }

    enoughPlayerToStartGame() {
        return this.gamePlayers.players.length > 1;
    }

    emit(name, ...args) {
        !this.sceneChanging && super.emit(name, ...args);
    }
}

app.createComponent(GameScene);