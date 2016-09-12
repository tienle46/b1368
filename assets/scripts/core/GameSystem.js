/**
 * Created by Thanh on 8/23/2016.
 */

var game = require('game')

var BaseScene = require("BaseScene");
var SystemEventHandler = require("SystemEventHandler");

class GameSystem {

    constructor() {
        this._currentScene = null

        this._systemEventHandler = null

        this.gameEventHandler = null

        this._eventListeners = null
    }

    ctor() {
        this._systemEventHandler = new SystemEventHandler();
    }

    start(){
        this._systemEventHandler._registerAllSystemEventHandler();
    }

    stop(){
        "use strict";
        this._systemEventHandler._removeAllSystemEventHandler();
    }

    /**
     * @param {string} sceneName - Scene Name want to load. The name of scene have been configured in {source} game.const.scene.*
     * @param {function} onLaunch - On launch custom function
     */
    loadScene(sceneName, onLaunch){
        cc.director.loadScene(sceneName, onLaunch)
    }


    /**
     *
     * @returns {BaseScene}
     */
    currentScene(){
        return this._currentScene;
    }


    /**
     *
     * @param {BaseScene} scene - Current scene
     */
    setCurrentScene(scene){
        this.currentScene = scene;
    }

    setGameEventHandler(gameEventHandler){
        if(this.gameEventHandler){
            this.gameEventHandler._removeGameEventListener();
        }
        this.gameEventHandler = gameEventHandler;
        this.gameEventHandler._addGameEventListener()
    }

    /**
     *
     * @param {string} cmd - Command or request name sent from server
     * @param {object} data - Data sent according to request
     */
    handleData(cmd, data, event){
        if(game.context.isJoinedGame()){
            this.gameEventHandler && this.gameEventHandler.handleGameEvent(event)
        }else{
            this._systemEventHandler && this._systemEventHandler.handleData(cmd, data);
        }
    }

    info(title, message){

        if(arguments.length == 1){
            message = title;
            title = game.resource.string.SYSTEM;
        }

        alert(message);
        //TODO
    }

    error(message, closeCb){

        alert(message);

        closeCb && closeCb();
        //TODO
    }

    confirm(message, okCallback, cancelCallback){
        var r = confirm(message);
        if (r == true) {
            okCallback && okCallback();
        } else {
            cancelCallback && cancelCallback();
        }
    }

    /**
     *
     * @param {string array} messages
     */
    showTickerMessage(messages){
        alert("Ticker: " + messages)
    }

}

module.exports = new GameSystem();