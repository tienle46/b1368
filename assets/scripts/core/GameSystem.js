/**
 * Created by Thanh on 8/23/2016.
 */

import game from 'game'
import BaseScene from 'BaseScene'
import Emitter from 'emitter'

class GameSystem {

    constructor() {
        this._currentScene = null

        this.eventEmitter = new Emitter

        this._initEmitter();
    }

    _initEmitter(){
        //TODO
    }

    /**
     * @param {string} sceneName - Scene Name want to load. The name of scene have been configured in {source} game.const.scene.*
     * @param {function} onLaunch - On launch custom function
     */
    loadScene(sceneName, onLaunch, onShown){
        cc.director.loadScene(sceneName, onLaunch)
        let currentScene = cc.director.getScene();
        if (currentScene)  currentScene.onShown = onShown
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

    emit(name, ...args){
        this.eventEmitter.emit(name, ...args)
        this._emitToScene(name, ...args);
    }

    /**
     *
     * This func is in considering because it's conflict with event of cocos node
     *
     * @deprecated
     */
    _emitToScene(){
        this._currentScene && this._currentScene.node.emit(name, ...args)

    }


    addListener(eventName, listener, context){
        this.eventEmitter.addListener(eventName, listener, context);
    }

    removeListener(eventName, listener) {
        this.eventEmitter.removeListener(eventName, listener)
    }

    removeAllListener(eventName) {
        this.eventEmitter.removeListener(eventName)
    }
}

const gameSystem = new GameSystem();
module.exports = gameSystem;