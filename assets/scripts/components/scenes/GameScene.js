import app from 'app';
import utils from 'utils';
import {BaseScene} from 'scenes';
import {Events, Emitter} from 'events'
import {CreateGameException} from 'exceptions';
import {GameMenuPrefab} from 'game-components';
import {gameManager, GameEventHandler, Board, TLMNDLBoard, TLMNDLPlayer} from 'game';

class GameScene extends BaseScene {

    constructor() {
        super();

        this.boardLayer = {
            default: null,
            type: cc.Node
        };

        this.playerLayer = {
            default: null,
            type: cc.Node
        };

        this.gameControlLayer = {
            default: null,
            type: cc.Node
        };

        this.gameMenuLayer = {
            default: null,
            type: cc.Node
        };

        this.boardPrefab = {
            default: null,
            type: cc.Prefab
        };

        this.board = null;
        this.room = null;
        this.gameMenu = null;
        this.gamePlayers = null;
        this.gameControls = null;
        this.gameData = null;
        this.gameEventHandler = null;
        this.gameCode = null;
    }

    onLoad() {

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
            console.error(e);

            if (e instanceof CreateGameException)
                this._onLoadSceneFail();
        }

        console.debug("onLoad GameScene");
    }

    start() {
        this.gameEventHandler && this.gameEventHandler.setHandleEventImmediate(true);
    }

    onDestroy() {
        console.debug("GameScene onDestroy");
        this.gameEventHandler && this.gameEventHandler.removeGameEventListener();
    }

    _initGameScene() {
        let {board, boardNode} = gameManager.createBoard(this.gameCode);

        if (board && boardNode) {
            boardNode.parent = this.boardLayer;

            this.board = board;
            this.board._init(this)

            this._initPlayerLayer();
            this._initGameControlLayer();;
            this._loadGameData();
            this._initGameEvent();

            this.hideLoading("GameScene");

        } else {
            throw new CreateGameException(app.res.string('error.fail_to_create_game'));
        }
    }

    _initGameEvent() {
        this.gameEventHandler = new GameEventHandler(this);
        this.gameEventHandler.setHandleEventImmediate(false);
        this.gameEventHandler.addGameEventListener();
    }

    _loadGameData() {
        this.gamePlayers._init(this.board, this, () => {
            this.emit(Events.ON_GAME_STATE_BEGIN)
        });
    }

    // _initBoardLayer() {
    //
    //     console.log("gameManager: ", gameManager);
    //
    //     gameManager.createBoard(this, (error, boardNode, board) => {
    //         if(board){
    //             boardNode.parent = this.boardLayer;
    //
    //             this._onBoardFinishInit(board);
    //         }else{
    //             throw new CreateGameException((error && error.error) || app.res.string('error.fail_to_create_game'));
    //         }
    //     });
    //
    //     // let boardClass = app.game.getBoardClass(this.gameCode);
    //     // let boardComponent = app.createComponent(boardClass, this.room, this);
    //     // this.board = this.boardLayer.addComponent(boardComponent);
    //     //
    //     // if (!this.board) {
    //     //     throw new CreateGameException("Không thể khởi tạo bàn chơi");
    //     // }
    // }

    _initPlayerLayer() {
        this.gamePlayers = this.playerLayer.getComponent('PlayerManagerComponent');
    }

    _initGameControlLayer() {
        gameManager.createGameControls(this, (error, controlsNode, gameControls) => {
            controlsNode.setAnchorPoint(0, 0);
            controlsNode.parent = this.gameControlLayer;

            this.gameControls = gameControls;
            this.gameControls._init(this);
        });
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
}

app.createComponent(GameScene);