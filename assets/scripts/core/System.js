/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';
import SFS2X from 'SFS2X';
import Emitter from 'emitter';
import HighLightMessageRub from 'HighLightMessageRub';
import MessagePopup from 'MessagePopup';
import ConfirmPopup from 'ConfirmPopup';
import utils from 'utils';
import ArrayUtils from "../utils/ArrayUtils";
import Toast from 'Toast';
import { isFunction } from 'Utils';


class GameSystem {

    constructor() {
        this.eventEmitter = new Emitter;
        this.pendingGameEvents = [];
        this.__pendingEventOnSceneChanging = [];
        this.gameEventEmitter = new Emitter;
        this.enablePendingGameEvent = false;
        this.toast = null;
        // high light message
        (!this.hlm) && (this.hlm = new HighLightMessageRub());
        this.sceneChanging = false;
        this._currentSceneNode = cc.Node;
        this._currentScene = cc.Node;
        this.isInactive = false;
        this.initEventListener();
        this._sceneName = null;
    }

    showLoader(message = "", duration) {
        this._currentScene.showLoading(message, duration);
    }

    hideLoader() {
        this._currentScene.hideLoading();
    }

    showToast(message, duration) {
        this.toast && this.toast.info(message, duration);
    }

    showLongToast(message) {
        this.toast && this.toast.longInfo(message);
    }

    showErrorToast(error) {
        this.toast && this.toast.error(error);
    }

    showLongErrorToast(error) {
        this.toast && this.toast.longError(error);
    }

    /**
     * @param {string} sceneName - Scene Name want to load. The name of scene have been configured in {source} app.const.scene.*
     * @param {function} onLaunch - On launch custom function
     */
    loadScene(sceneName, onLaunch) {
        console.log("sceneName: ", sceneName);
        cc.director.loadScene(sceneName, () => {
            console.log("load scene result", sceneName, cc.director.getScene());

            if (cc.director.getScene().children[0]) {
                app.service.removeAllCallback(this.getCurrentSceneName());

                this._currentScene = cc.director.getScene().children[0].getComponent(sceneName);

                if (this._currentScene) {
                    this._sceneName = sceneName;

                    this._addToastToScene();

                    let container = this.getCurrentSceneNode().getChildByName('Container');
                    if (container) {
                        cc.game.addPersistRootNode(this.getCurrentSceneNode());
                        container.setPositionX(1280);

                        let action2 = cc.moveTo(.12, cc.v2(0, 0));
                        container.runAction(cc.spawn(cc.callFunc(() => {
                            cc.game.removePersistRootNode(this.getCurrentSceneNode());
                        }), action2));
                    }
                }
            }

            isFunction(onLaunch) && onLaunch();
        });
    }

    initEventListener() {
        this.addListener(SFS2X.SFSEvent.ROOM_JOIN, this._onJoinRoomSuccess, this);
        this.addListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomError, this);
        this.addListener(app.commands.HIGH_LIGHT_MESSAGE, this._onHighLightMessage, this);
        this.addListener(SFS2X.SFSEvent.ADMIN_MESSAGE, this._onAdminMessage, this);
        this.addListener("submitPurchase", this._onSubmitPurchase, this);
    }

    removeEventListener() {
        this.removeListener(SFS2X.SFSEvent.ROOM_JOIN, this._onJoinRoomSuccess, this);
        this.removeListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomError, this);
        this.removeListener(app.commands.HIGH_LIGHT_MESSAGE, this._onHighLightMessage, this);
        this.removeListener(SFS2X.SFSEvent.ADMIN_MESSAGE, this._onAdminMessage, this);
        this.removeListener("submitPurchase", this._onSubmitPurchase, this);
    }

    getCurrentSceneNode() {
        return this._currentScene.node;
    }

    getCurrentSceneName() {
        return this._currentScene ? this._sceneName : 'anonymousScene';
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

    info(title, message) {

        if (arguments.length == 1) {
            message = title;
            title = app.res.string('system');
        }

        MessagePopup.show(this.getCurrentSceneNode(), message);
    }

    error(message, closeCb) {
        MessagePopup.show(this.getCurrentSceneNode(), message, closeCb);
    }

    confirm(message, cancelCallback, okCallback) {
        ConfirmPopup.confirm(this.getCurrentSceneNode(), message, cancelCallback, okCallback);
    }

    /**
     *
     * @param {string array} messages
     */
    showTickerMessage(messages) {
        alert("Ticker: " + messages);
    }

    emit(name, ...args) {
        if (this.sceneChanging) {
            !this.__pendingEventOnSceneChanging.hasOwnProperty(name) && (this.__pendingEventOnSceneChanging[name] = []);
            this.__pendingEventOnSceneChanging[name].push(args);
        } else {
            this.eventEmitter.emit(name, ...args);
            this._emitGameEvent(name, ...args);
        }
    }

    setSceneChanging(changing) {

        if (!changing) {
            this.__pendingEventOnSceneChanging && Object.getOwnPropertyNames(this.__pendingEventOnSceneChanging).forEach(name => {

                let argArr = this.__pendingEventOnSceneChanging[name];
                argArr && argArr.forEach(args => {
                    this.emit(name, ...args);
                });
            });

            ArrayUtils.clear(this.__pendingEventOnSceneChanging);
        }

        this.sceneChanging = changing;
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

    addGameListener(eventName, listener, context, priority) {
        this.gameEventEmitter.addListener(eventName, listener, context, priority);
    }

    removeGameListener(eventName, listener, context) {
        this.gameEventEmitter.removeListener(eventName, listener, context);
    }

    addListener(eventName, listener, context, priority) {
        this.eventEmitter.addListener(eventName, listener, context, priority);
    }

    removeListener(eventName, listener, context) {
        this.eventEmitter.removeListener(eventName, listener, context);
    }

    removeAllListener(eventName) {
        this.eventEmitter.removeListener(eventName);
    }

    _onSubmitPurchase(data) {
        let messages = data['messages'] || [];
        let receipts = data['purchasedProducts'] || [];
        let savedItems = app.context.getPurchases();

        receipts.forEach(receipt => {
            let index = app._.findIndex(savedItems, ['receipt', receipt]);
            cc.log('iap: _onSubmitPurchase receipts >', index);
            if (index > -1) {
                savedItems.splice(index, 1); // also affected to app.context.purchasesItem
                cc.log('IAP: getPurchases > length:', app.context.getPurchases().length);
            }
        });

        if (savedItems.length > 0) {
            cc.log('IAP: savedItems > 0', savedItems.length);
            let string = cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE);
            savedItems.forEach(item => {
                string += `${JSON.stringify(item)};`;
            });
            cc.sys.localStorage.setItem(app.const.IAP_LOCAL_STORAGE, string);
        } else {
            app.context.setPurchases([]);
            cc.sys.localStorage.setItem(app.const.IAP_LOCAL_STORAGE, "");
        }

        this.hideLoader();
        for (let i = 0; i < messages.length; i++) {
            if (data[app.keywords.RESPONSE_RESULT]) {
                app.system.showToast(messages[i]);
            } else {
                app.system.error(messages[i] || '+ tien that bai');
                break;
            }
        }
    }

    _onJoinRoomError(resultEvent) {
        if (resultEvent.errorCode) {
            this.error(event.errorMessage);
        }
    }

    _onAdminMessage(message, data) {
        let duration = data && data.t == app.const.adminMessage.MANUAL_DISMISS ? Toast.FOREVER : undefined;
        let sceneName = this.getCurrentSceneName();
        if (this.currentScene && sceneName == 'DashboardScene' && message.match(/(\"Đăng nhập hằng ngày\")/).length > 0) {
            this.currentScene.showDailyLoginPopup(message);
            return;
        }
        this.showToast(message, duration);
    }


    _onJoinRoomSuccess(resultEvent) {
        debug(resultEvent);

        if (!resultEvent.room) return;

        app.context.lastJoinedRoom = resultEvent.room;
        if (resultEvent.room && resultEvent.room.isJoined && resultEvent.room.isGame) {

            app.context.currentRoom = resultEvent.room;
            this._currentScene && this._currentScene.hideLoading();

            let gameSceneName = null;
            let gameCode = utils.getGameCode(resultEvent.room);

            // check whether app.context.selectedGame is exists. if not re-set it
            (!app.context.getSelectedGame()) && app.context.setSelectedGame(gameCode);

            switch (gameCode) {
                case app.const.gameCode.TLMNDL:
                    gameSceneName = 'TLMNDLScene';
                    break;
                case app.const.gameCode.PHOM:
                    gameSceneName = 'PhomScene';
                    break;
                case app.const.gameCode.XAM:
                    gameSceneName = 'SamScene';
                    break;
                case app.const.gameCode.BA_CAY:
                    gameSceneName = 'BaCayScene';
                    break;
                case app.const.gameCode.XOC_DIA:
                    gameSceneName = 'XocDiaScene';
                    break;
            }
            gameSceneName && this.loadScene(gameSceneName);
        }
    }

    _onHighLightMessage(resultEvent) {
        resultEvent && this.hlm.pushMessage(resultEvent);
    }

    _addToastToScene() {
        let toastNode = cc.instantiate(app.res.prefab.toast);
        this.toast = toastNode.getComponent('Toast');
        this._currentScene && this._currentScene.node.addChild(toastNode, app.const.toastZIndex);
    }

    _emitGameEvent(name, ...args) {
        if (this.enablePendingGameEvent) {
            this.pendingGameEvents.push({ name, args: args });
        } else {
            this.gameEventEmitter.emit(name, ...args);
        }
    }

    _handlePendingGameEvents() {
        if (this.pendingGameEvents.length > 0) {
            this.pendingGameEvents.forEach(event => this.gameEventEmitter.emit(event.name, ...event.args));
            this.pendingGameEvents = [];
        }
    }
}

const gameSystem = new GameSystem();
module.exports = gameSystem;