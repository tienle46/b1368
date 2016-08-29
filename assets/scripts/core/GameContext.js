/**
 * Created by Thanh on 8/23/2016.
 */

var game;
var GameService = require("GameService")

var GameContext = cc.Class({

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
});

GameContext.newInstance = function () {
    game = require("game");
    return new GameContext();
};

module.exports = GameContext;