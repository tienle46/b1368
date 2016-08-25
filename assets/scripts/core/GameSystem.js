/**
 * Created by Thanh on 8/23/2016.
 */

var game;


var GameSystem = cc.Class({

    ctor() {

    },

    /**
     * @param {string} sceneName - Scene Name want to load. The name of scene have been configured in {source} game.const.scene.*
     * @param {function} onLaunch - On launch custom function
     */
    loadScene(sceneName, onLaunch){
        cc.director.loadScene(sceneName, onLaunch)
    }

});

GameSystem.newInstance = function () {
    game = require("game");
    return new GameSystem();
};

module.exports = GameSystem;