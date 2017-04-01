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
import Toast from 'Toast';
import { isFunction } from 'Utils';


class GameSystem {

    constructor() {
        this.eventEmitter = new Emitter;
        this.pendingGameEvents = [];
        this.__pendingEventOnSceneChanging = {};
        this.gameEventEmitter = new Emitter;
        this.enablePendingGameEvent = false;
        this.toast = null;
        // high light message
        (!this.hlm) && (this.hlm = new HighLightMessageRub());
        this.sceneChanging = false;
        this._currentScene = null;
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
    loadScene(sceneName, onLaunch, highPriority) {
        console.log("sceneName: ", sceneName);
        cc.director.loadScene(sceneName, () => {
            console.log("load scene result", sceneName, cc.director.getScene());
            highPriority && isFunction(onLaunch) && onLaunch();

            if (cc.director.getScene().children[0]) {
                app.service && app.service.removeAllCallback(this.getCurrentSceneName());

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

            !highPriority && isFunction(onLaunch) && onLaunch();
        });
    }

    initEventListener() {
        this.addListener(SFS2X.SFSEvent.ROOM_JOIN, this._onJoinRoomSuccess, this);
        this.addListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomError, this);
        this.addListener(app.commands.HIGH_LIGHT_MESSAGE, this._onHighLightMessage, this);
        this.addListener(app.commands.UPDATE_PHONE_NUMBER, this._onUpdatePhoneNumber, this);
        this.addListener(SFS2X.SFSEvent.ADMIN_MESSAGE, this._onAdminMessage, this);
        app.env.isIOS() && this.addListener(app.commands.IOS_IN_APP_PURCHASE, this._onSubmitPurchaseIOS, this);
        app.env.isAndroid() && this.addListener(app.commands.ANDROID_IN_APP_PURCHASE, this._onSubmitPurchaseAndroid, this);
    }

    removeEventListener() {
        this.removeListener(SFS2X.SFSEvent.ROOM_JOIN, this._onJoinRoomSuccess, this);
        this.removeListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomError, this);
        this.removeListener(app.commands.HIGH_LIGHT_MESSAGE, this._onHighLightMessage, this);
        this.removeListener(app.commands.UPDATE_PHONE_NUMBER, this._onUpdatePhoneNumber, this);
        this.removeListener(SFS2X.SFSEvent.ADMIN_MESSAGE, this._onAdminMessage, this);
        app.env.isIOS() && this.removeListener(app.commands.IOS_IN_APP_PURCHASE, this._onSubmitPurchaseIOS, this);
        app.env.isAndroid() && this.removeListener(app.commands.ANDROID_IN_APP_PURCHASE, this._onSubmitPurchaseAndroid, this);
    }

    getCurrentSceneNode() {
        return this._currentScene && this._currentScene.node;
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
            (!this.__pendingEventOnSceneChanging.hasOwnProperty(name) || !this.__pendingEventOnSceneChanging[name]) && (this.__pendingEventOnSceneChanging[name] = []);
            if (!app._.includes(this.__pendingEventOnSceneChanging[name], args)) {
                this.__pendingEventOnSceneChanging[name].push(args);
            }
        } else {
            this.eventEmitter.emit(name, ...args);
            this._emitGameEvent(name, ...args);
        }
    }

    setSceneChanging(changing) {
        if (!changing) {
            this.__pendingEventOnSceneChanging && Object.getOwnPropertyNames(this.__pendingEventOnSceneChanging).forEach(name => {

                let argArr = this.__pendingEventOnSceneChanging[name];
                if (argArr) {
                    argArr.forEach(args => {
                        this.emit(name, ...args);
                    });
                    window.release(this.__pendingEventOnSceneChanging[name], true);
                    this.__pendingEventOnSceneChanging[name] = null;
                }
            });
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

    _onSubmitPurchaseIOS(data) {
        let messages = data['messages'] || [];
        let receipts = data['purchasedProducts'] || [];

        receipts.forEach(receipt => {
            this.__removeSuccessItemInIAPLocalStorage(receipt);
        });

        this.hideLoader();
        for (let i = 0; i < messages.length; i++) {
            if (data[app.keywords.RESPONSE_RESULT]) {
                app.system.showToast(messages[i]);
            } else {
                app.system.error(messages[i] || app.res.string('trading_is_denied'));
                break;
            }
        }
    }

    _onSubmitPurchaseAndroid(data) {
        cc.log('IAP: adata', JSON.stringify(data));

        if (!data[app.keywords.RESPONSE_RESULT]) {
            app.system.error(data.message || "");
            this.hideLoader();
            return;
        }
        let receipts = data['purchasedProducts'] || [];
        let unverifiedPurchases = data['unverifiedPurchases'] || [];
        let consumedProducts = data['consumedProducts'] || [];

        for (let i = 0; i < receipts.length; i++) {
            let receipt = receipts[i];
            if (receipt.su) {
                this.__removeSuccessItemInIAPLocalStorage(receipt.token);
                app.system.showToast(receipt.msg);
            } else {
                app.system.error(receipt.msg);
            }
        }

        unverifiedPurchases.forEach(purchase => {
            this.__removeSuccessItemInIAPLocalStorage(purchase.token);
        });

        consumedProducts.forEach(purchase => {
            this.__removeSuccessItemInIAPLocalStorage(purchase.token);
        });

        this.hideLoader();
    }

    __removeSuccessItemInIAPLocalStorage(token) {
        let savedItems = app.context.getPurchases();
        cc.log('IAP: savedItems > 0', savedItems.length);

        if (savedItems.length == 0) {
            cc.log('IAP: savedItems1 === 0', savedItems.length);
            return;
        }

        let index = app._.findIndex(savedItems, ['receipt', token]);
        cc.log('IAP: savedItems1 > length:', savedItems.length);

        cc.log('iap: _onSubmitPurchase receipts >', index);
        if (index > -1) {
            let string = cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE);
            let item = savedItems[index];
            cc.sys.localStorage.setItem(app.const.IAP_LOCAL_STORAGE, string.replace(`${JSON.stringify(item)};`, ""));

            savedItems.splice(index, 1); // also affected to app.context.purchasesItem
        }

        if (savedItems.length == 0) {
            cc.log('IAP: savedItems2 reset purchase === 0', savedItems.length);

            app.context.setPurchases([]);
            cc.sys.localStorage.setItem(app.const.IAP_LOCAL_STORAGE, "");
        }
        cc.log('IAP localStorage2 ITEM :', cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE).split(';').length - 1);

    }

    _onJoinRoomError(resultEvent) {
        if (resultEvent.errorCode) {
            this.hideLoader();
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
            if (gameSceneName) {
                this.loadScene(gameSceneName);
            } else {
                this.hideLoader();
            }
        }
    }

    _onHighLightMessage(resultEvent) {
        resultEvent && this.hlm.pushMessage(resultEvent);
    }
    
    _onUpdatePhoneNumber(data) {
        if (data[app.keywords.RESPONSE_RESULT]) {
            //update needUpdatePhone -> false
            app.context.getMe()[app.keywords.UPDATE_PHONE_NUMBER] = false;
            
            app.system.showToast(app.res.string('phone_number_confirmation'));
        } else {
            app.system.error(
                app.res.string('error_system')
            );
        }
    }
    
    _addToastToScene() {
        if(app.res.prefab.toast){
            let toastNode = cc.instantiate(app.res.prefab.toast);
            if(toastNode) {

                this.toast = toastNode.getComponent('Toast');
                this._currentScene && this._currentScene.node.addChild(toastNode, app.const.toastZIndex);
            }
        }
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

    onParseClientConfigError() {

    }
}

module.exports = new GameSystem();