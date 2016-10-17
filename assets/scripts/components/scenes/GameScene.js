import app from 'app';
import SFS2X from 'SFS2X';
import {utils, GameUtils} from 'utils';
import {Keywords} from 'core';
import {BaseScene} from 'scenes';
import {Events, Emitter} from 'events'
import {CreateGameException} from 'exceptions';
import {GameMenuPrefab} from 'game-components';
import {gameManager, GameEventHandler, Board, TLMNDLBoard, TLMNDLPlayer} from 'game';
import GameResultPopup from 'GameResultPopup';

export default class GameScene extends BaseScene {

    constructor() {
        super();

        this.boardLayer = cc.Node;
        this.playerLayer = cc.Node;
        this.gameMenuLayer = cc.Node;
        this.gameControlLayer = cc.Node;


        this.boardPrefab = cc.Prefab;
        this.gameResultPopupPrefab = cc.Prefab;

        this.room = null;
        this.board = null;
        this.gameCode = null;
        this.gameMenu = null;
        this.gameData = null;
        this.initiated = false;
        this.gamePlayers = null;
        this.gameControls = null;
        this.gameEventHandler = null;
        this.gameResultPopup = null;
        this._penddingEvents = [];
    }

    _addGlobalListener(){
        this.on(Events.ON_GAME_STATE_CHANGE, (...args) => {
            this.initiated ? this._onGameStateChange(...args) : (this._penddingEvents.push({
                fn: this._onGameStateChange,
                args: args
            }))
        }, this, 1);

        // this.on(Events.ON_GAME_REJOIN, (...args) => {
        //     debug("ON_GAME_REJOIN: ", args)
        //     this.initiated ? this._onGameRejoin(...args) : (this._penddingEvents.push({
        //         fn: this._onGameRejoin,
        //         args: args
        //     }))
        // }, this, 1);
        this.on(Events.ON_ACTION_EXIT_GAME, this._onActionExitGame, this);
        this.on(Events.ON_ACTION_LOAD_GAME_GUIDE, this._onActionLoadGameGuide, this);
    }

    handleRejoinGame(...args){
        this.initiated ? this._onGameRejoin(...args) : (this._penddingEvents.push({
            fn: this._onGameRejoin,
            args: args
        }))
    }

    onLoad() {

        super.onLoad();
        this._addGlobalListener();

        try {
            this.room = app.context.currentRoom;

            if (this.room && this.room.isGame) {
                this.gameCode = utils.getGameCode(this.room);
                this.gameData = this.room.getVariable(app.keywords.VARIABLE_GAME_INFO).value;
            }

            if (!this.gameData) {
                throw new CreateGameException(app.res.string('error.fail_to_load_game_data'));
            }

            this.showLongLoading("GameScene");

            gameManager.loadRes(this.gameCode, (error) => {
                if (error) {
                    this.hideLoading("GameScene");
                    throw new CreateGameException(error);
                } else {
                    this._initGameScene();
                }
            });

            this._initGameMenuLayer();

        } catch (e) {
            error(e);
            app.system.enablePendingGameEvent = false;

            if (e instanceof CreateGameException)
                this._onLoadSceneFail();

        }

        log("onLoad GameScene");
    }

    start() {
    }

    onDestroy() {
        super.onDestroy();
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

    _initGameScene() {
        let {board, boardNode} = gameManager.createBoard(this.gameCode);

        if (board && boardNode) {
            boardNode.parent = this.boardLayer;

            this.board = board;
            this.board._init(this);

            this._initPlayerLayer();
            this._initGameControlLayer();
            this._loadGameData();
            this._initGameEvents();
            this._onDoneInitGameScene();
        } else {
            throw new CreateGameException(app.res.string('error.fail_to_create_game'));
        }
    }

    _onDoneInitGameScene() {
        this.initiated = true;

        app.system.enablePendingGameEvent = false;
        app.system.handlePendingEvents();

        this._handlePendingEvents();
        this.hideLoading("GameScene");
    }

    _handlePendingEvents(){
        this._penddingEvents.forEach(event => event.fn(...event.args));
        this._penddingEvents = [];
    }

    _initGameEvents() {
        this._penddingEvents = [];
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

    _onActionShowMenu() {

    }

    _onActionHideMenu() {

    }

    _onActionLoadGameGuide(){
        app.system.info(app.res.string('coming_soon'));
    }

    _loadGameData() {
        this.gamePlayers._init(this.board, this);

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

        debug("isGamePlaying: ", isGamePlaying);
        if (isGamePlaying) {
            this._loadPlayerReadyState();
            !app.context.rejoiningGame && this._onGameStateChange(currentGameState, this.gameData, true);
        } else {
            this.emit(Events.ON_GAME_STATE_BEGIN, this.gameData, app.context.rejoiningGame);
            this._loadPlayerReadyState();
        }

    }

    _loadPlayerReadyState() {
        debug("_loadPlayerReadyState")
        let readyPlayerIds = this.gameData[Keywords.GAME_LIST_PLAYER];
        readyPlayerIds && readyPlayerIds.forEach(id => {
            this.emit(Events.ON_PLAYER_READY_STATE_CHANGED, id, true, this.gamePlayers.isItMe(id));
        });
    }

    _initPlayerLayer() {
        this.gamePlayers = this.playerLayer.getComponent('GamePlayers');
    }

    _initGameControlLayer() {
        let {gameControls, gameControlsNode} = gameManager.createGameControls(this.gameCode);

        gameControlsNode.setAnchorPoint(0, 0);
        gameControlsNode.parent = this.gameControlLayer;

        this.gameControls = gameControls;
        this.gameControls._init(this);

    }

    _initGameMenuLayer() {
        cc.loader.loadRes('game/GameMenuPrefab', (error, prefab) => {
            let prefabObj = cc.instantiate(prefab);
            prefabObj.parent = this.gameMenuLayer;

            this.gameMenu = prefabObj.getComponent('GameMenuPrefab');
            this.gameMenu._init(this);
        });
    }

    _onLoadSceneFail() {
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

    _onGameStateChange(state, data, isJustJoined) {

        console.log("_onGameStateChange: state=", state, " isJustJoined=", isJustJoined, " data=", data);

        let localState = GameUtils.convertToLocalGameState(state);
        this.gameState = state;
        this.gameLocalState = localState;

        log("Game state: ", state, localState);

        switch (localState) {
            case app.const.game.state.BEGIN:
                this.emit(Events.ON_GAME_STATE_BEGIN, data, isJustJoined);
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
        }
    }

    showGameResult(models) {
        if (!utils.isEmptyArray(models)) {
            !this.gameResultPopup && (this.gameResultPopup = cc.instantiate(this.gameResultPopupPrefab).getComponent(GameResultPopup.name));
            this.gameResultPopup.show(models);
        }
    }

    hideGameResult() {
        this.gameResultPopup && this.gameResultPopup.hide();
    }
}

app.createComponent(GameScene);
