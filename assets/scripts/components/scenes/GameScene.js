import game from 'game'
import utils from 'utils'
import Board from 'Board'
import CreateGameException from 'CreateGameException'
import TLMNDLBoard from 'TLMNDLBoard'
import TLMNDLPlayer from 'TLMNDLPlayer'

const gameCodeToBoardClassMap = {
    [game.const.gameCode.TLMNDL]: TLMNDLBoard
}

const gameCodeToPlayerClassMap = {
    [game.const.gameCode.TLMNDL]: TLMNDLPlayer
}


class GameScene {

    constructor() {
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
        this.room = game.context.currentRoom;
    }

    onLoad() {

        try {
            this.gameCode = utils.getGameCode(this.room)

            if(!this.room || !this.room.isGame || !this.gameCode){
                if(!game.config.test){
                    throw new CreateGameException('Bàn chơi không tồn tại!')
                }
            }

            this._initBoardLayer()
            this._initPlayerLayer()
            this._initGameControlLayer()
            this._initGameMenuLayer()

        }catch (e){
            console.error(e)

            if(e instanceof CreateGameException)
                this._onLoadSceneFail()
        }
    }

    _initBoardLayer(){

        if(game.config.test){
            this.gameCode = this.gameCode || "tnd"
        }

        let boardClass = gameCodeToBoardClassMap[this.gameCode]
        let boardComponent = game.createComponent(boardClass, this.room, this);
        this.board = this.boardLayer.addComponent(boardComponent)

        if(!this.board){
            throw new CreateGameException("Không thể khởi tạo bàn chơi");
        }
    }

    _initPlayerLayer(){

        this.playerManager = this.playerLayer.getComponent('PlayerManager');
        this.playerManager.init(this.board, this);

    }

    _initGameControlLayer(){

    }

    _initGameMenuLayer() {
        cc.loader.loadRes('game/GameMenuPrefab', (error, prefab) => {
            let prefabObj = cc.instantiate(prefab);
            prefabObj.parent = this.gameMenuLayer
        });
    }

    _onLoadSceneFail(){
        if(game.config.debug){
            return;
        }

        if(game.service.client.isConnected()){
            game.system.error('Không thể khởi tạo bàn chơi. Quay lại màn hình chọn bàn chơi!', () => {
                game.system.loadScene(game.const.scene.LIST_TABLE_SCENE);
            })
        }else{
            game.system.error('Không thể kết nối với máy chủ. Bạn vui lòng đăng nhập lại để tiếp tục chơi!', () => {
                game.system.loadScene(game.const.scene.LOGIN_SCENE);
            })
        }
    }

    _createBoard(gameCode, room){
        const boardClass = gameCodeToBoardClassMap[gameCode]
        return boardClass && new boardClass(room)
    }

    _createPlayer(gameCode, user){
        const playerClass = gameCodeToPlayerClassMap[gameCode]
        return playerClass && new playerClass(user)
    }
}

game.createComponent(GameScene)
