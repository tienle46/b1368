/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';
import SFS2X from 'SFS2X';
import BaseScene from 'BaseScene';
import Emitter from 'emitter';
import GameScene from 'GameScene';
import AlertPopupRub from 'AlertPopupRub';
import MessagePopup from 'MessagePopup';
import ConfirmPopup from 'ConfirmPopup';
import Toast from 'Toast';

class GameSystem {

    constructor() {

        this.eventEmitter = new Emitter;

        this.pendingGameEvents = [];
        this.gameEventEmitter = new Emitter;
        this.enablePendingGameEvent = false;
        this.toast = null;
        this._currentSceneNode = cc.Node;
        this._currentScene = cc.Node;
        this.initEventListener();
    }

    showToast(message, duration){
        this.toast && this.toast.info(message, duration);
    }

    showLongToast(message){
        this.toast && this.toast.longInfo(message);
    }

    showErrorToast(error){
        this.toast && this.toast.error(error);
    }

    showLongErrorToast(error){
        this.toast && this.toast.longError(error);
    }

    /**
     * @param {string} sceneName - Scene Name want to load. The name of scene have been configured in {source} app.const.scene.*
     * @param {function} onLaunch - On launch custom function
     */
    loadScene(sceneName, onLaunch, onShown) {
        cc.director.loadScene(sceneName, () => {
            this._currentScene = cc.director.getScene().children[0].getComponent(sceneName);
            this._currentScene && this._addToastToScene() && (this._currentScene.onShown = onShown);
            onLaunch && onLaunch();
        });
    }

    initEventListener() {
        this.addListener(SFS2X.SFSEvent.ROOM_JOIN, this._onJoinRoomSuccess, this);
        this.addListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomError, this);
    }

    removeEventListener() {
        this.removeListener(SFS2X.SFSEvent.ROOM_JOIN, this._onJoinRoomSuccess);
        this.removeListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomError);
    }

    _onJoinRoomError(resultEvent) {
        if (resultEvent.errorCode) {
            this.error(event.errorMessage);
        }
    }

    _onJoinRoomSuccess(resultEvent) {
        if (!resultEvent.room) return;

        app.context.lastJoinRoom = resultEvent.room;
        if (resultEvent.room.isJoined && resultEvent.room.isGame) {
            app.context.currentRoom = resultEvent.room;
            this._currentScene && this._currentScene.hideLoading();
            this.loadScene(GameScene.name);
        }

    }

    get currentScene() {
        return this._currentScene;
    }

    /**
     *
     * @param {BaseScene} scene - Current scene
     */
    setCurrentScene(scene) {
        this._currentScene = scene;
        this._addToastToScene();
    }

    _addToastToScene(){
        let toastNode = cc.instantiate(app.res.prefab.toast);
        this.toast = toastNode.getComponent(Toast.name);
        this._currentScene && this._currentScene.node.addChild(toastNode, app.const.toastZIndex);
    }

    info(title, message) {

        if (arguments.length == 1) {
            message = title;
            title = app.res.string('system');
        }

        MessagePopup.show(this.currentScene.node, message);
    }

    error(message, closeCb) {
        MessagePopup.show(this.currentScene.node, message, closeCb);
    }

    confirm(message, cancelCallback, okCallback) {
        ConfirmPopup.confirm(this.currentScene.node, message, cancelCallback, okCallback);
    }

    /**
     *
     * @param {string array} messages
     */
    showTickerMessage(messages) {
        alert("Ticker: " + messages);
    }

    emit(name, ...args) {
        this.eventEmitter.emit(name, ...args);
        this._emitGameEvent(name, ...args);
    }

    _emitGameEvent(name, ...args) {
        if (this.enablePendingGameEvent) {
            this.pendingGameEvents.push({name, args: args});
        } else {
            this.gameEventEmitter.emit(name, ...args);
        }
    }

    handlePendingEvents() {
        if (this.pendingGameEvents.length > 0) {
            this.pendingGameEvents.forEach(event => this.gameEventEmitter.emit(event.name, ...event.args));
            this.pendingGameEvents = [];
        }
    }

    // /**
    //  *
    //  * This func is in considering because it's conflict with event of cocos node
    //  *
    //  * @deprecated
    //  */
    // _emitToScene(){
    //     this.currentScene && this.currentScene.emit(name, ...args);
    //
    // }

    addGameListener(eventName, listener, context) {
        this.gameEventEmitter.addListener(eventName, listener, context);
    }

    removeGameListener(eventName, listener, context) {
        this.gameEventEmitter.removeListener(eventName, listener, context);
    }

    addListener(eventName, listener, context) {
        this.eventEmitter.addListener(eventName, listener, context);
    }

    removeListener(eventName, listener) {
        this.eventEmitter.removeListener(eventName, listener);
    }

    removeAllListener(eventName) {
        this.eventEmitter.removeListener(eventName);
    }
}

const gameSystem = new GameSystem();
module.exports = gameSystem;