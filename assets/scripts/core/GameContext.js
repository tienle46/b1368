/**
 * Created by Thanh on 8/23/2016.
 */

var game = require("game")

var GameContext = {

    properties: {
        currentRoom: {
            default: null
        },

        groupId: {
            default: ""
        }
    },

    ctor() {
        
    },

    /**
     *
     * @returns {SFS2X.Entities.SFSUser}
     */
    getMySelf() {
        return game.service.client.me;
    },

    isJoinedGame(){
        return this.currentRoom && this.currentRoom.isGame
    }
}

module.exports = GameContext;