/**
 * Created by Thanh on 8/23/2016.
 */

var game;
var GameService = require("GameService")

var GameContext = cc.Class({

    ctor() {
        
    },

    /**
     *
     * @returns {SFS2X.Entities.SFSUser}
     */
    getUser() {
        return game.service.getClient().mySelf;
    }
});

GameContext.newInstance = function () {
    game = require("game");
    return new GameContext();
};

module.exports = GameContext;