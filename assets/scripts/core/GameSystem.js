/**
 * Created by Thanh on 8/23/2016.
 */

var game;
var BaseSceneController = require("BaseSceneController");
var SystemEventHandler = require("SystemEventHandler");

var GameSystem = cc.Class({

    properties: {
        _currentScene: {
            default: null
        },

        _systemEventHandler: {
            default: null
        }
    },

    ctor() {
        this._systemEventHandler = new SystemEventHandler();
    },

    init(){
        this._systemEventHandler._registerSystemEventHandler();
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
     * @returns {BaseSceneController}
     */
    currentScene(){
        return this._currentScene;
    },


    /**
     *
     * @param {BaseSceneController} scene - Current scene
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
        SystemEventHandler.handleData(cmd, data);
        this._currentScene &&this._currentScene.handleData(cmd, data)
    }

});

GameSystem.newInstance = function () {
    game = require("game");
    return new GameSystem();
};

module.exports = GameSystem;