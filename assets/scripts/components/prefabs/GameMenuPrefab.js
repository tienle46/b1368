
import game from 'game'

export default class GameMenuPrefab {
    constructor() {
        this.menuBtn = {
            default: null,
            type: cc.Node
        }

        this.chatBtn = {
            default: null,
            type: cc.Node
        }

        this.topupBtn = {
            default: null,
            type: cc.Node
        }
    }
}

game.createComponent(GameMenuPrefab)
