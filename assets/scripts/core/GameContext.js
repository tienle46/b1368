/**
 * Created by Thanh on 8/23/2016.
 */

var game = require("game")

class GameContext {

    constructor() {
        this.currentRoom = null
        this.groupId = null
    }

    /**
     *
     * @returns {SFS2X.Entities.SFSUser}
     */
    getMySelf() {
        return game.service.client.me;
    }

    isJoinedGame(){
        return this.currentRoom && this.currentRoom.isGame
    }
}

module.exports = new GameContext();