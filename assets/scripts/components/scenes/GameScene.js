import game from 'game'

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
    }

    onLoad() {
        // cc.loader.loadRes('resourceUri', (error, prefab) => {
        //     let prefabObj = cc.instantiate(prefab);
        //     prefabObj.parent = this //Asign parent to prefab
        //     prefabObj.setPosition(0, 0) //Set position of prefab
        // })


    }

    _onLoadSceneFail(){
        game.system.error('Không thể khởi tạo bàn chơi. Quay lại màn hình chọn bàn chơi!', () => {
            game.system.loadScene(game.const.scene.LIST_TABLE_SCENE);
        })
    }
}

game.createComponent(GameScene)
