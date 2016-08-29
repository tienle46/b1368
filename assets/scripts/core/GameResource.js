/**
 * Created by Thanh on 8/23/2016.
 */

var game;

var GameResource = cc.Class({

    ctor() {
        
    }
});

GameResource.newInstance = function () {
    game = require("GameResource")
    return new GameResource();
};

GameResource.getErrorMessage = function(key) {

}

module.exports = GameResource;