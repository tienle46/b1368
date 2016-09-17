import game from 'game'
import utils from 'utils'
import Board from 'Board'
import CreateGameException from 'CreateGameException'
import TLMNDLBoard from 'TLMNDLBoard'
import TLMNDLPlayer from 'TLMNDLPlayer'
import GameMenuPrefab from 'GameMenuPrefab'
import BaseScene from 'BaseScene'

/**
 + 1 properties trong gameSence
 + de thuc hien logic cua 2 component  -> 1 component 
 */
/**
 + gamescene 
 + faker -> !this.properties ctor()

var a, b, c (ccclass)

b = a.b (b la properties a)

a.b.b1111 (func)

a.b1111 {
    b.b1111
}

a[b1111] => function b1111() { b[b1111]}


 */
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
    }

    onLoad() {
        try {
            this.room = game.context.currentRoom

            if (!this.room || !this.room.isGame) {
                throw new CreateGameException('Bàn chơi không tồn tại!')
            }

            this.gameCode = utils.getGameCode(this.room)
            this.gameData = this.room.getVariable(game.keywords.VARIABLE_GAME_INFO).value;
            if (!this.gameData) {
                throw new CreateGameException('Không thể tải thông tin bàn chơi!')
            }

            this._initBoardLayer()
            this._initPlayerLayer()
            this._initGameControlLayer()
            this._initGameMenuLayer()
            this._loadGameData();

        } catch (e) {
            console.error(e)

            if (e instanceof CreateGameException)
                this._onLoadSceneFail()
        }
    }

    _loadGameData() {
        this.board._init(this.gameData);
        this.playerManager._init(this.board, this)
    }

    _initBoardLayer() {

        if (game.config.test) {
            this.gameCode = this.gameCode || "tnd"
        }

        let boardClass = game.manager.getBoardClass(this.gameCode)
        let boardComponent = game.createComponent(boardClass, this.room, this);
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
        if (game.service.client.isConnected()) {
            game.system.loadScene(game.const.scene.LIST_TABLE_SCENE);
        } else {
            game.system.loadScene(game.const.scene.LOGIN_SCENE);
        }
    }
}

game.createComponent(GameScene)