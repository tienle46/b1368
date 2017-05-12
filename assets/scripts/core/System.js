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
import Marker from 'Marker';
import Linking from 'Linking'

class GameSystem {

    constructor() {
        this.eventEmitter = new Emitter;
        this.pendingGameEvents = [];
        this.__pendingEventOnSceneChanging = {};
        this.gameEventEmitter = new Emitter;
        this.marker = new Marker();
        this.audioManager = null;
        this.enablePendingGameEvent = false;
        this.toast = null;
        // high light message
        (!this.hlm) && (this.hlm = new HighLightMessageRub());
        this.sceneChanging = false;
        this._currentScene = null;
        this.isInactive = false;
        this._sceneName = null;
        this._delayChangeAppStateTimeoutId = 0;

        this._actionComponents = []
        this._lackOfMoneyMessage = null
        
        this.initEventListener();
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
        log("sceneName: ", sceneName);
        this.setSceneChanging(true)
        cc.director.loadScene(sceneName, () => {
            log("load scene result", sceneName, cc.director.getScene());
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
        
        this.addListener(app.commands.GET_TOTAL_TOPUP, this._onTotalTopupFetched, this);
    }

    removeEventListener() {
        this.removeListener(SFS2X.SFSEvent.ROOM_JOIN, this._onJoinRoomSuccess, this);
        this.removeListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomError, this);
        this.removeListener(app.commands.HIGH_LIGHT_MESSAGE, this._onHighLightMessage, this);
        this.removeListener(app.commands.UPDATE_PHONE_NUMBER, this._onUpdatePhoneNumber, this);
        this.removeListener(SFS2X.SFSEvent.ADMIN_MESSAGE, this._onAdminMessage, this);
        app.env.isIOS() && this.removeListener(app.commands.IOS_IN_APP_PURCHASE, this._onSubmitPurchaseIOS, this);
        app.env.isAndroid() && this.removeListener(app.commands.ANDROID_IN_APP_PURCHASE, this._onSubmitPurchaseAndroid, this);
        
        this.removeListener(app.commands.GET_TOTAL_TOPUP, this._onTotalTopupFetched, this);
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

    error(message, closeCb, acceptCb) {
        MessagePopup.show(this.getCurrentSceneNode(), message, closeCb, acceptCb);
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
            //if (!app._.includes(this.__pendingEventOnSceneChanging[name], args)) {
                this.__pendingEventOnSceneChanging[name].push([...args]);
            //}
        } else {
            this.eventEmitter.emit(name, ...args);
            this._emitGameEvent(name, ...args);
        }
    }

    setSceneChanging(changing) {

        this.sceneChanging = changing;

        if (!changing) {
            this.__pendingEventOnSceneChanging && Object.getOwnPropertyNames(this.__pendingEventOnSceneChanging).forEach(name => {

                let argArr = this.__pendingEventOnSceneChanging[name];
                if (argArr) {
                    argArr.forEach(args => {
                        this.emit(name, ...args);
                    });
                    window.release(this.__pendingEventOnSceneChanging[name], true);
                    //window.release(this.__pendingEventOnSceneChanging[name], true);
                    this.__pendingEventOnSceneChanging[name] = null;
                }
            });
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

    initOnFirstSceneLoaded(){
        if (app.env.isBrowser()) {
            cc.game.pause = () => {};
            cc.game.setFrameRate(48);
        }

        cc.game.on(cc.game.EVENT_SHOW, () => app.system.changeAppState('active'))
        cc.game.on(cc.game.EVENT_HIDE, () => app.system.changeAppState('inactive'))
    }

    _clearDelayUpdateHideState(){
        if(this._delayChangeAppStateTimeoutId > 0){
            clearTimeout(this._delayChangeAppStateTimeoutId)
            this._delayChangeAppStateTimeoutId = 0;
        }
    }

    changeAppState(state= 'active'){

        if(app.env.isBrowser()){
            this.isInactive = state == 'inactive'
            this._actionComponents.forEach(cmp => cmp.onAppStateChange(state))
        }else{
            this._clearDelayUpdateHideState()

            if(state == 'inactive'){
                this.isInactive = true;
                this._actionComponents.forEach(cmp => cmp.onAppStateChange(state));
            }else{
                this._delayChangeAppStateTimeoutId = setTimeout(() => {
                    this.isInactive = false;
                    this._actionComponents.forEach(cmp => cmp.onAppStateChange(state));
                     if(state == 'active'){
                        app.service._checkConnection();
                    }
                }, 3000)
            }
        }

       
    }

    addAppStateListener(component){
        if(component && component.onAppStateChange && this._actionComponents.indexOf(component) < 0){
            this._actionComponents.push(component)
        }
    }

    removeAppStateListener(component) {
        let index = component &&  this._actionComponents.indexOf(component)
        index >= 0 &&  this._actionComponents.splice(index, 1)
    }

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
        log('IAP: adata', JSON.stringify(data));

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
        log('IAP: savedItems > 0', savedItems.length);

        if (savedItems.length == 0) {
            log('IAP: savedItems1 === 0', savedItems.length);
            return;
        }

        let index = app._.findIndex(savedItems, ['receipt', token]);
        log('IAP: savedItems1 > length:', savedItems.length);

        log('iap: _onSubmitPurchase receipts >', index);
        if (index > -1) {
            let string = cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE);
            let item = savedItems[index];
            cc.sys.localStorage.setItem(app.const.IAP_LOCAL_STORAGE, string.replace(`${JSON.stringify(item)};`, ""));

            savedItems.splice(index, 1); // also affected to app.context.purchasesItem
        }

        if (savedItems.length == 0) {
            log('IAP: savedItems2 reset purchase === 0', savedItems.length);

            app.context.setPurchases([]);
            cc.sys.localStorage.setItem(app.const.IAP_LOCAL_STORAGE, "");
        }
        log('IAP localStorage2 ITEM :', cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE).split(';').length - 1);

    }
    
    _onJoinRoomError(resultEvent) {
        if (resultEvent.errorCode) {
            this.hideLoader();
            this.error(event.errorMessage);
        }
    }

    _onAdminMessage(message, data) {
        let duration, showToast = true
        let messageType = data && data.t
        let sceneName = this.getCurrentSceneName();
        
        switch (messageType){
            case app.const.adminMessage.MANUAL_DISMISS: {
                duration = Toast.FOREVER;
                break;
            }
            case app.const.adminMessage.DAILY_LOGIN_MISSION: {
                if (this.currentScene && sceneName == app.const.scene.DASHBOARD_SCENE) {
                    var title = "Quà tặng đăng nhập hàng ngày";
                    this.currentScene.showDailyLoginPopup(title, message);
                    showToast = false;
                    return;
                }
                break;
            }
            case app.const.adminMessage.REGISTER_BONUS: {
                if (this.currentScene && sceneName == app.const.scene.DASHBOARD_SCENE) {
                    var title = "Chào mừng bạn đến với game bài 1368";
                    // console.debug('title, message)', title, message);
                    this.currentScene.showDailyLoginPopup(title, message);
                    showToast = false;
                    return;
                }
                break;
            }
            case app.const.adminMessage.LACK_OF_MONEY: {
                showToast = false;
                this._lackOfMoneyMessage = message;
                !this.sceneChanging && (sceneName == app.const.scene.LIST_TABLE_SCENE || sceneName == app.const.scene.DASHBOARD_SCENE) && this.showLackOfMoneyMessagePopup();
                break;
            }
            case app.const.adminMessage.TOPUP_SUCCESSFULLY: {
                app.service.send({
                    cmd: app.commands.GET_TOTAL_TOPUP,
                    data: {
                    }
                });
                break;
            }
        }

        showToast && this.showToast(message, duration);
    }
    _onTotalTopupFetched(data){
        // window.sdkbox.PluginOneSignal.sendTag("paid_user", data["total"]);
    }

    showLackOfMoneyMessagePopup(){
        this.currentScene && this._lackOfMoneyMessage && ConfirmPopup.showCustomConfirm(this.currentScene.node, this._lackOfMoneyMessage, {
            acceptLabel: app.res.string('label_topup_money'),
            acceptCb: () => {
                app.visibilityManager.goTo(Linking.ACTION_TOPUP_CARD)
            }
        })

        this._lackOfMoneyMessage = null;
    }

    _onJoinRoomSuccess(resultEvent) {
        debug(resultEvent);

        if (!resultEvent.room) return;

        app.context.lastJoinedRoom = resultEvent.room;
        if (resultEvent.room && resultEvent.room.isJoined && resultEvent.room.isGame) {

            this.setSceneChanging(true)

            app.context.currentRoom = resultEvent.room;
            let gameSceneName = null;
            let onLoadFunc = null;
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
                case app.const.gameCode.TLMNDL_SOLO:
                    gameSceneName = 'TLMNDLScene';
                    onLoadFunc = () => {this.currentScene && this.currentScene.setSoloGame(true)}
                    break;
                case app.const.gameCode.XAM_SOLO:
                    gameSceneName = 'SamScene';
                    onLoadFunc = () => {this.currentScene && this.currentScene.setSoloGame(true)}
                    break;
            }
            if (gameSceneName) {
                this.loadScene(gameSceneName, onLoadFunc);
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