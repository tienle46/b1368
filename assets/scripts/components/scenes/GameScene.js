import app from 'app'
import utils from 'utils'
import Board from 'Board'
import CreateGameException from 'CreateGameException'
// import TLMNDLBoard from 'TLMNDLBoard'
// import TLMNDLPlayer from 'TLMNDLPlayer'

import { TLMNDLBoard, TLMNDLPlayer } from 'TLMNDLBoard'

import GameMenuPrefab from 'GameMenuPrefab'
import BaseScene from 'BaseScene'

class GameScene extends BaseScene {

    constructor() {
        super();

        this.boardLayer = {
            default: null,
            type: cc.Node
        }

        this.playerLayer = {
            default: null,
            type: cc.Node
        }

        this.gameControlLayer = {
            default: null,
            type: cc.Node
        }

        this.gameMenuLayer = {
            default: null,
            type: cc.Node
        }

        this.board = null;
        this.room = null;
        this.gameMenu = null;
        this.playerManager = null;
        this.gameControls = null;
        this.gameData = null;
        this.gameEventHandler = null
    }

    onLoad() {
        try {
            this.room = app.context.currentRoom

            if (!this.room || !this.room.isGame) {
                throw new CreateGameException('Bàn chơi không tồn tại!')
            }

            this.gameCode = utils.getGameCode(this.room)
            this.gameData = this.room.getVariable(app.keywords.VARIABLE_GAME_INFO).value;
            if (!this.gameData) {
                throw new CreateGameException('Không thể tải thông tin bàn chơi!')
            }

            this._initBoardLayer()
            this._initPlayerLayer()
            this._initGameControlLayer()
            this._initGameMenuLayer()
            this._initEvent()
            this._loadGameData()

        } catch (e) {
            console.error(e)

            if (e instanceof CreateGameException)
                this._onLoadSceneFail()
        }
    }


    start() {
        this.gameEventHandler && this.gameEventHandler.setHandleEventImmediate(true)
    }

    onDestroy() {
        console.debug("GameScene onDestroy")
        this.gameEventHandler && this.gameEventHandler.removeGameEventListener()
    }

    _initEvent() {
        this.gameEventHandler = new GameEventHandler(this.board, this);
        this.gameEventHandler.setHandleEventImmediate(false);
        this.gameEventHandler.addGameEventListener()
    }

    _loadGameData() {
        this.board._init(this.gameData);
        this.playerManager._init(this.board, this)
    }

    _initBoardLayer() {

        if (game.config.test) {
            this.gameCode = this.gameCode || "tnd"
        }


        let boardClass = app.game.getBoardClass(this.gameCode)
        let boardComponent = app.createComponent(boardClass, this.room, this);
        this.board = this.boardLayer.addComponent(boardComponent)

        if (!this.board) {
            throw new CreateGameException("Không thể khởi tạo bàn chơi");
        }
    }

    _initPlayerLayer() {
        this.playerManager = this.playerLayer.getComponent('PlayerManager');
    }

    _initGameControlLayer() {
        cc.loader.loadRes('game/controls/BaseControls', (error, prefab) => {

            let prefabObj = cc.instantiate(prefab);
            prefabObj.setAnchorPoint(0, 0)
            prefabObj.parent = this.gameControlLayer

            this.gameControls = prefabObj.getComponent('BaseControls');
            this.gameControls._init(this.board, this);
        });
    }

    _initGameMenuLayer() {

        cc.loader.loadRes('game/GameMenuPrefab', (error, prefab) => {
            let prefabObj = cc.instantiate(prefab);
            this.gameMenu = prefabObj.getComponent('GameMenuPrefab');
            this.gameMenu._init(this.board, this);
            prefabObj.parent = this.gameMenuLayer
        });
    }

    _onLoadSceneFail() {
        if (game.config.debug) {
            return;
        }

        if (game.service.client.isConnected()) {
            game.system.error('Không thể khởi tạo bàn chơi. Quay lại màn hình chọn bàn chơi!', () => {
                game.system.loadScene(game.const.scene.LIST_TABLE_SCENE);
            })
        } else {
            game.system.error('Không thể kết nối với máy chủ. Bạn vui lòng đăng nhập lại để tiếp tục chơi!', () => {
                game.system.loadScene(game.const.scene.LOGIN_SCENE);
            })
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

app.createComponent(GameScene)