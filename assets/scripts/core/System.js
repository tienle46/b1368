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
import VisibilityManager from 'VisibilityManager';
import BuddyManager from 'BuddyManager';


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
        this.kickMessage = null;
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
        if(!app.visibilityManager) 
            app.visibilityManager = new VisibilityManager(app.config.features);
        
        this._sentQuickAuthen = false;
    }

    showLoader(message = "", duration) {
        this._currentScene && this._currentScene.showLoading(message, duration);
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
    loadScene(sceneName, onLaunch, initData) {
        log("sceneName: ", sceneName);
        this.setSceneChanging(true)
        cc.director.loadScene(sceneName, () => {
            log("load scene result", sceneName, cc.director.getScene());
            // highPriority && isFunction(onLaunch) && onLaunch();

            if (cc.director.getScene().children[0]) {
                app.service && app.service.removeAllCallback(this.getCurrentSceneName());

                this._currentScene = cc.director.getScene().children[0].getComponent(sceneName);
                
                if (this._currentScene) {
                    this._sceneName = sceneName;
                    // this._currentScene.testData(initData);
                    
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
            // !highPriority && isFunction(onLaunch) && onLaunch();
        });
    }

    initEventListener() {
        this.addListener(SFS2X.SFSEvent.ROOM_JOIN, this._onJoinRoomSuccess, this);
        this.addListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomError, this);
        this.addListener(app.commands.HIGH_LIGHT_MESSAGE, this._onHighLightMessage, this);
        this.addListener(app.commands.UPDATE_PHONE_NUMBER, this._onUpdatePhoneNumber, this);
        this.addListener(SFS2X.SFSEvent.ADMIN_MESSAGE, this._onAdminMessage, this);
        
        this.addListener(app.commands.GET_TOTAL_TOPUP, this._onTotalTopupFetched, this);
        
        this.addListener(app.commands.CANCEL_REJOIN, this._onCancelRejoin, this);
    }

    // removeEventListener() {
    //     this.removeListener(SFS2X.SFSEvent.ROOM_JOIN, this._onJoinRoomSuccess, this);
    //     this.removeListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomError, this);
    //     this.removeListener(app.commands.HIGH_LIGHT_MESSAGE, this._onHighLightMessage, this);
    //     this.removeListener(app.commands.UPDATE_PHONE_NUMBER, this._onUpdatePhoneNumber, this);
    //     this.removeListener(SFS2X.SFSEvent.ADMIN_MESSAGE, this._onAdminMessage, this);
    //
    //     this.removeListener(app.commands.GET_TOTAL_TOPUP, this._onTotalTopupFetched, this);
    // }

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

    info(title, message, multi = true) {

        if (arguments.length == 1) {
            message = title;
            title = app.res.string('system');
        }

        MessagePopup.show(this.getCurrentSceneNode(), message, null, null, undefined, multi, title);
    }

    error(message, closeCb, acceptCb) {
        MessagePopup.show(this.getCurrentSceneNode(), message, closeCb, acceptCb);
    }

    confirm(message, cancelCallback, okCallback, multi) {
        ConfirmPopup.confirm(this.getCurrentSceneNode(), message, cancelCallback, okCallback, multi);
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
            this._actionComponents.push(component);
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
    
    _onCancelRejoin(data) {
        this.loadScene(app.const.scene.DASHBOARD_SCENE);
    }
    
    _onJoinRoomError(resultEvent) {
        if (resultEvent.errorCode) {
            this.hideLoader();
            this.error(event.errorMessage);
        }
    }

    _onAdminMessage(message, data) {
        !data && (data = { t: app.const.adminMessage.ALERT});
        
        let duration = data.duration * 1000,
            title = data.title,
            showToast = true,
            messageType = data.t,
            sceneName = this.getCurrentSceneName();
                    
        switch (messageType){
            case app.const.adminMessage.MANUAL_DISMISS: {
                duration = Toast.FOREVER;
                break;
            }
            case app.const.adminMessage.DAILY_LOGIN_MISSION: {
                if (this.currentScene && sceneName == app.const.scene.DASHBOARD_SCENE) {
                    this.currentScene.showDailyLoginPopup(message, false, title);
                    showToast = false;
                    return;
                }
                break;
            }
            case app.const.adminMessage.KICK_MESSAGE: {
                this.kickMessage  = message;
                showToast = false;
                break;
            }
            case app.const.adminMessage.REGISTER_BONUS: {
                if (this.currentScene && sceneName == app.const.scene.DASHBOARD_SCENE) {
                    // console.debug('title, message)', title, message);
                    this.currentScene.showDailyLoginPopup(message, true, title);
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
                showToast = false;
                this.info(message);
                break;
            }
            case app.const.adminMessage.ALERT: {
                showToast = false;
                
                title ? this.info(title, message) : this.info(message);
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
            if (app.buddyManager) {
                app.buddyManager.reset();
            } else {
                app.buddyManager = new BuddyManager();
            }

            app.buddyManager.sendInitBuddy();
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
    
    _quickAuthen() {
        if(app.env.isBrowser() && !this._sentQuickAuthen) {
            let getQueryValue = (key,url) => {
                if (!url) url = location.href;
                key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
                let regexS = "[\\?&]"+key+"=([^&#]*)";
                let regex = new RegExp( regexS );
                let results = regex.exec( url );
                return results == null ? null : results[1].trim();
            };
            let tempRegister = true;
            let values = {};
            ['username', 'password', 'isRegister', 'isQuickLogin', 'facebookToken', 'facebookId' ].forEach(key => {
                values[key] = getQueryValue(key);
            });
            
            let {username, password, facebookToken, facebookId} = values;
            let CryptoJS = require("crypto-js");
            
            // Decrypt
            if(password) {
                var bytes  = password && CryptoJS.AES.decrypt(password, app.config.CRYPTO_AES_KEY);
                password = bytes.toString(CryptoJS.enc.Utf8);
            }

            if(this.currentScene && ((username && password) || (facebookId && facebookToken))) {
                this.currentScene.loginToDashboard && this.currentScene.loginToDashboard(username, password, false, false, facebookToken, facebookId, null, tempRegister)
            }
            this._sentQuickAuthen = true;
        }
    }
}

module.exports = new GameSystem();