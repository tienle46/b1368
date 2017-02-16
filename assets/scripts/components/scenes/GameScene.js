import app from 'app';
import SFS2X from 'SFS2X';
import { utils, GameUtils } from 'utils';
import { Keywords } from 'core';
import { BaseScene } from 'scenes';
import { Events, Emitter } from 'events'
import { CreateGameException } from 'exceptions';
import { gameManager, GameEventHandler, Board, TLMNDLBoard, TLMNDLPlayer } from 'game';
import GamePlayers from 'GamePlayers';
import GameChatComponent from "GameChatComponent";
import Props from "../Props";

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
            gameResultPopupNode: cc.Node,
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
        /**
         * @type {GameResultPopup}
         */
        this.gameResultPopup = null;

        this.gameCode = null;
        this.gameState = null;
        this.gameData = null;
        this._penddingEvents = null;
        this.gameContext = null;
    }

    _addGlobalListener() {
        super._addGlobalListener();

        this.on(Events.ON_GAME_STATE_CHANGE, (...args) => {
            this.initiated ? this._onGameStateChange(...args) : (this._penddingEvents.push({
                fn: this._onGameStateChange,
                args: args
            }))
        }, this, 1);

        this.on(Events.ON_ACTION_EXIT_GAME, this._onActionExitGame, this);
        this.on(Events.ON_PLAYER_CHAT_MESSAGE, this._onPlayerChatMessage, this, 0);
        this.on(Events.ON_ACTION_LOAD_GAME_GUIDE, this._onActionLoadGameGuide, this);
        this.on(Events.VISIBLE_INGAME_CHAT_COMPONENT, this._onVisibleIngameChatComponent, this);
        this.on(Events.ON_GAME_LOAD_DATA_AFTER_SCENE_START, this._loadGameDataAfterSceneStart, this);
        this.on(Events.ON_ROOM_CHANGE_MIN_BET, this._onRoomMinBetChanged, this);
        this.on(Events.ON_PLAYER_READY_STATE_CHANGED, (playerId, ready) => {

            let readyPlayerIds = utils.getValue(this.gameData, app.keywords.ROOM_READY_PLAYERS, []);
            if (ready) {
                readyPlayerIds.push(playerId);
            } else {
                let index = readyPlayerIds.indexOf(playerId);
                index >= 0 && readyPlayerIds.splice(index, 1);
            }

            this.gameData[app.keywords.ROOM_READY_PLAYERS] = readyPlayerIds;

        }, this);
    }

    _onPlayerChatMessage(sender, message) {
        if(!this.gameContext.messages){
            this.gameContext.messages = [];
        }
        this.gameContext.messages.push({sender: sender.name, message});
        if(this.gameContext.messages.length > app.const.NUMBER_MESSAGES_KEEP_INGAME){
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
        this.gameContext = {};
        this._penddingEvents = [];

        this.node.children.forEach(child => { child.opacity = 255 });

        Object.values(app.res.asset_tools).length < 1 && this._loadAssetTools();
    }

    _loadAssetTools() {
        cc.loader.loadResDir('props/thumbs', cc.SpriteFrame, (err, assets) => {
            if (err) {
                cc.error(err);
                return;
            }

            assets.forEach((asset, index) => {
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
        this.tableMinBetLabel && (this.tableMinBetLabel.string = GameUtils.formatBalance(minBet));
    }

    _setTableNameLabel() {
        let roomName = this.room.name.substring(3, 5);
        let tableName = this.room.name.substring(5, this.room.name.length) || "";

        this.tableNameLabel.string = app.res.string('game_table_name', { tableName });
    }

    onEnable() {
        super.onEnable();

        // utils.deactive(this.chatComponentNode);
        // utils.deactive(this.gameResultPopupNode);

        app.system.setCurrentScene(this);
        this.chatComponent = this.chatComponentNode.getComponent('GameChatComponent');
        this.gamePlayers = this.playerLayer.getComponent('GamePlayers');


        try {
            this.room = app.context.currentRoom;

            if (this.room && this.room.isGame) {
                this.gameCode = utils.getGameCode(this.room);
                this.gameData = this.room.getVariable(app.keywords.VARIABLE_GAME_INFO).value;
            }

            if (!this.gameData) {
                throw new CreateGameException(app.res.string('error_fail_to_load_game_data'));
            }

            this._setGameInfo(this.room);
            this._loadGameData();

        } catch (e) {
            error(e);
            app.system.enablePendingGameEvent = false;
            e instanceof CreateGameException && this._onLoadSceneFail();
        }
    }

    _onGameData(isJustJoined = true) {

        if (this.room && this.room.isGame) {
            this.gameData = this.room.getVariable(app.keywords.VARIABLE_GAME_INFO).value;
        }

        if (this.gameData) {
            this._loadGameData(isJustJoined);
        }

    }

    start() {
        super.start();

        this._initGameEvents();
        app.system.enablePendingGameEvent = false;
        this._handlePendingEvents();

        GameChatComponent.loadEmotions();
        Props.loadAllPropAsset();
    }

    onDestroy() {
        super.onDestroy();
        this.removeAllListener();
        this.gameEventHandler && this.gameEventHandler.removeGameEventListener();
        this.gameContext = {};
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

    _onGameRejoin(data) {
        let state = utils.getValue(this.gameData, app.keywords.BOARD_STATE_KEYWORD);
        state && this.emit(Events.ON_GAME_STATE_CHANGE, state, this.gameData, true, true);
        this.emit(Events.ON_GAME_REJOIN, data);
    }

    _onActionExitGame() {
        // this.showLoading();
        app.service.sendRequest(new SFS2X.Requests.System.LeaveRoomRequest(this.room));

        app.service.send({ cmd: app.commands.REGISTER_QUIT_ROOM, room: this.room }, (data) => {
            if (data && data[app.keywords.SUCCESSFULL]) {
                app.system.showToast(app.res.string("game_registered_quit_room"));
            }
        });
    }

    _onActionLoadGameGuide() {
        app.system.info(app.res.string('coming_soon'));
    }

    _loadGameData(isJustJoined) {

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

        let readyPlayerIds = utils.getValue(this.gameData, app.keywords.GAME_LIST_PLAYER, []);
        this.gameData[app.keywords.ROOM_READY_PLAYERS] = [...readyPlayerIds];

        this._updatePlayerReadyState(this.gameData)

        // console.warn("_loadPlayerReadyState", readyPlayerIds, );
        //
        // readyPlayerIds && readyPlayerIds.forEach(id => {
        //     this.emit(Events.ON_PLAYER_READY_STATE_CHANGED, id, true, this.gamePlayers.isItMe(id));
        //     console.warn("_loadPlayerReadyState single: ", id, this.gamePlayers.isItMe(id));
        // });
    }

    _onLoadSceneFail() {
        this.hideLoading()
        if (app.config.debug) {
            return;
        }

        if (app.service.client.isConnected()) {
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

        if (app.service.client.isConnected()) {
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

        if (this.gameState == app.const.game.state.WAIT) {
            this.gameState = app.const.game.state.READY;
            this.gameData[Keywords.BOARD_STATE_KEYWORD] = app.const.game.state.READY;
            this._onGameData();
        }

        let localState = GameUtils.convertToLocalGameState(state);
        this.gameState = state;
        this.gameLocalState = localState;

        if (this.gameState == app.const.game.state.WAIT) {
            this.emit(Events.ON_GAME_RESET);
            return;
        }

        this.emit(Events.ON_GAME_STATE_PRE_CHANGE, state, data, isJustJoined);


        switch (localState) {
            case app.const.game.state.BEGIN:
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
                break;
            default:
                this.emit(Events.ON_GAME_STATE, this.gameState, data, isJustJoined);
        }

        this._updatePlayerReadyState(data, true);

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

            persistToGameData && (this.gameData[app.keywords.ROOM_READY_PLAYERS] = readyPlayerIds);
        }
    }

    checkReadyPlayer(player) {


        if (this.gameData.hasOwnProperty(app.keywords.ROOM_READY_PLAYERS)) {

            let readyPlayerIds = utils.getValue(this.gameData, app.keywords.ROOM_READY_PLAYERS, []);

            return readyPlayerIds.indexOf(player.id) >= 0;
        }
    }

    showGameResult(models, cb) {
        !utils.isEmptyArray(models) && this.gameResultPopup && this.gameResultPopup.show(models, cb);
    }

    hideGameResult() {
        this.gameResultPopup && this.gameResultPopup.hide();
    }

    enoughPlayerToStartGame() {
        return this.gamePlayers.players.length > 1;
    }

    emit(name, ...args) {
        !this.sceneChanging && super.emit(name, ...args);
    }
}

app.createComponent(GameScene);