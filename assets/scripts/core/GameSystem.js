/**
 * Created by Thanh on 8/23/2016.
 */

var game;
var BaseScene = require("BaseScene");
var SystemEventHandler = require("SystemEventHandler");

var GameSystem = cc.Class({

    properties: {
        _currentScene: {
            default: null
        },

        _systemEventHandler: {
            default: null
        },

        _eventListeners: {
            default: {}
        }
    },

    ctor() {
        this._systemEventHandler = new SystemEventHandler();
    },

    start(){
        this._systemEventHandler._registerAllSystemEventHandler();
    },

    stop(){
        "use strict";
        this._systemEventHandler._removeAllSystemEventHandler();
    },

    /**
     * @param {string} sceneName - Scene Name want to load. The name of scene have been configured in {source} game.const.scene.*
     * @param {function} onLaunch - On launch custom function
     */
    loadScene(sceneName, onLaunch){
        cc.director.loadScene(sceneName, onLaunch)
    },


    /**
     *
     * @returns {BaseScene}
     */
    currentScene(){
        return this._currentScene;
    },


    /**
     *
     * @param {BaseScene} scene - Current scene
     */
    setCurrentScene(scene){
        this.currentScene = scene;
    },

    /**
     *
     * @param {string} cmd - Command or request name sent from server
     * @param {object} data - Data sent according to request
     */
    handleData(cmd, data){
       this._systemEventHandler.handleData(cmd, data);
    }

});

GameSystem.newInstance = function () {
    game = require("game");
    return new GameSystem();
};

module.exports = GameSystem;