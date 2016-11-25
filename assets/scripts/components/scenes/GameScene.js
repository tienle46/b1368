import app from 'app';
import SFS2X from 'SFS2X';
import {utils, GameUtils} from 'utils';
import {Keywords} from 'core';
import {BaseScene} from 'scenes';
import {Events, Emitter} from 'events'
import {CreateGameException} from 'exceptions';
import {gameManager, GameEventHandler, Board, TLMNDLBoard, TLMNDLPlayer} from 'game';
import IngameChatComponent from 'IngameChatComponent';
import GamePlayers from 'GamePlayers';

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
            gameResultPopupNode: cc.Node,
            playerPositionAnchorsNode: cc.Node,
            maxPlayers: 4
        }

        this.chatComponent = null;
        this.room = null;
        this.board = null;
        this.gameCode = null;
        this.gameState = null;
        this.gameMenu = null;
        this.gameData = null;
        this.gamePlayers = null;
        this.gameControls = null;
        this.gameEventHandler = null;
        this.gameResultPopup = null;
        this._penddingEvents = null;
    }

    _addGlobalListener(){
        super._addGlobalListener();

        this.on(Events.ON_GAME_STATE_CHANGE, (...args) => {

            console.log("Events.ON_GAME_STATE_CHANGE: ", args)

            this.initiated ? this._onGameStateChange(...args) : (this._penddingEvents.push({
                fn: this._onGameStateChange,
                args: args
            }))
        }, this, 1);

        this.on(Events.ON_ACTION_EXIT_GAME, this._onActionExitGame, this);
        this.on(Events.ON_ACTION_LOAD_GAME_GUIDE, this._onActionLoadGameGuide, this);
        this.on(Events.VISIBLE_INGAME_CHAT_COMPONENT, this._onVisibleIngameChatComponent, this);
    }

    _onVisibleIngameChatComponent(){
        this.chatComponent.setVisible();
    }

    handleRejoinGame(...args){
        this.initiated ? this._onGameRejoin(...args) : (this._penddingEvents.push({
            fn: this._onGameRejoin,
            args: args
        }));
    }

    onLoad() {
        super.onLoad();
        this._penddingEvents = [];

        this.node.children.forEach(child => { child.opacity = 255})
    }

    _setTableNameLabel(room){
        let roomName = room.name.substring(3, 5);
        let tableName = room.name.substring(5, room.name.length);
        let minBet = utils.getVariable(room, app.keywords.VARIABLE_MIN_BET, "");

        this.tableNameLabel.string = app.res.string('game_table_name', {roomName, tableName, minBet});
    }

    onEnable() {
        super.onEnable();

        app.system.setCurrentScene(this);
        this.chatComponent = this.chatComponentNode.getComponent('IngameChatComponent');
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

            this._setTableNameLabel(this.room);
            this._loadGameData();

        } catch (e) {
            error(e);
            app.system.enablePendingGameEvent = false;
            e instanceof CreateGameException && this._onLoadSceneFail();
        }
    }

    start(){
        super.start();

        this._initGameEvents();
        app.system.enablePendingGameEvent = false;
        this._handlePendingEvents();
    }

    onDestroy() {
        super.onDestroy();
        this.removeAllListener();
        this.gameEventHandler && this.gameEventHandler.removeGameEventListener();
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

    _handlePendingEvents(){
        // app.system.handlePendingEvents();
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
        state && this.emit(Events.ON_GAME_STATE_CHANGE, state, this.gameData, true);
        this.emit(Events.ON_GAME_REJOIN, data);
    }

    _onActionExitGame() {
        this.showLoading();
        app.service.sendRequest(new SFS2X.Requests.System.LeaveRoomRequest(this.room));
    }

    _onActionLoadGameGuide(){
        app.system.info(app.res.string('coming_soon'));
    }

    _loadGameData() {
        let currentGameState = utils.getValue(this.gameData, Keywords.BOARD_STATE_KEYWORD);
        let isGamePlaying = GameUtils.isPlayingState(currentGameState);

        /**
         * Current is call board._initPlayingData && board._loadGamePlayData directly. But when player or other component need to get data,
         * below line code will be switch to using emit via scene emitter
         */
        if (isGamePlaying) {
            this.board._initPlayingData(this.gameData);
        }

        this.emit(Events.ON_GAME_LOAD_PLAY_DATA, this.gameData);

        if (isGamePlaying) {
            this._loadPlayerReadyState();
            !app.context.rejoiningGame && this._onGameStateChange(currentGameState, this.gameData, true);
        } else {
            this._onGameStateBegin(this.gameData, app.context.rejoiningGame)
            this._loadPlayerReadyState();
        }

    }

    _loadPlayerReadyState() {
        let readyPlayerIds = this.gameData[Keywords.GAME_LIST_PLAYER];
        readyPlayerIds && readyPlayerIds.forEach(id => {
            this.emit(Events.ON_PLAYER_READY_STATE_CHANGED, id, true, this.gamePlayers.isItMe(id));
        });
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
        if (app.service.client.isConnected()) {
            app.system.loadScene(app.const.scene.LIST_TABLE_SCENE);
        } else {
            app.system.loadScene(app.const.scene.LOGIN_SCENE);
        }
    }

    _onGameStateBegin(data, isJustJoined){
        this.emit(Events.ON_GAME_RESET);
        this.emit(Events.ON_GAME_STATE_BEGIN, data, isJustJoined);
    }

    _onGameStateChange(state, data, isJustJoined) {

        let localState = GameUtils.convertToLocalGameState(state);
        this.gameState = state;
        this.gameLocalState = localState;

        console.log("_onGameState: state=", state, " local State: ", localState, " isJustJoined=", isJustJoined, " data=", data);

        switch (localState) {
            case app.const.game.state.BEGIN:
                this._onGameStateBegin(data, isJustJoined);
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
    }

    showGameResult(models, cb) {
        !utils.isEmptyArray(models) && this.gameResultPopup.show(models, cb);
    }

    hideGameResult() {
        this.gameResultPopup && this.gameResultPopup.hide();
    }
}

app.createComponent(GameScene);
