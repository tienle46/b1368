/**
 * Created by Thanh on 8/25/2016.
 */

import app from 'app';
import utils from 'PackageUtils';
import Actor from 'Actor';
import CCUtils from 'CCUtils';
import Base64 from 'Base64';

export default class BaseScene extends Actor {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            emptyNode: cc.Node,
            bodyNode: cc.Node,
        });

        this.loading = true;
        this.progress = null;
        this.onShown = null;
        this.isLoaded = false;
        this._showFBLoginPopup = false;
        this._errorMessageTimeout = null;
        
        this.updateTimer = 0
        this.updateInterval = .2
    }

    _addToPendingAddPopup(message) {
        !this._pendingAddPopup && (this._pendingAddPopup = []);
        message && this._pendingAddPopup.push(message);
    }

    _addGlobalListener() {
        super._addGlobalListener();
    }

    /**
     * Use this func to remove listener from game system
     *
     * Example:
     *      app.system.removeListener('adminMessage', () => {
     *          //Show admin message
     *      })
     *
     * @private
     */
    _removeGlobalListener() {
        super._removeGlobalListener();
    }

    onLoad() {
        super.onLoad();

        this._initProgress();
        this._pendingAddPopup && this._pendingAddPopup.forEach(msg => app.service.info(msg));
        this.isLoaded = true;
    }

    onEnable() {
        super.onEnable();

        this.progress && this.progress.hide();
        if (this.onShown && this.onShown instanceof Function) {
            this.onShown();
        }
    }

    start() {
        super.start();
        app.system.setSceneChanging(false);
        
        let name = app.system.getCurrentSceneName()
        if(name == app.const.scene.ENTRANCE_SCENE && app.taiXiuTreoManager) {
            app.taiXiuTreoManager.onDestroy()
            return
        }
        let isInOutgameScene = app._.includes([
            app.const.scene.ENTRANCE_SCENE,
            app.const.scene.LOGIN_SCENE,
            app.const.scene.REGISTER_SCENE
        ], name);
        if(!isInOutgameScene && app.taiXiuTreoManager) 
            // create mini game
            app.taiXiuTreoManager.createIcon()
    }

    onDestroy() {
        super.onDestroy();
        clearTimeout(this._errorMessageTimeout);
        app.system.setSceneChanging(true);
    }

    setVisibleEmptyNode(visible = true){
        CCUtils.setVisible(this.emptyNode, visible);
        CCUtils.setVisible(this.bodyNode, !visible);
    }

    showShortLoading(message = '', payload = '') {
        this.showLoading(message, 5, payload);
    }

    showLongLoading(message = '', payload = '') {
        this.showLoading(message, 20, payload);
    }

    showLoading(message = '', timeoutInSeconds = 30, payload = '') {
        this.hideLoading(payload);

        if (utils.isNumber(message)) {
            timeoutInSeconds = message;
            message = "";
        }

        this.loading = true;
        this.progress && this.progress.show(message, timeoutInSeconds);
    }

    hideLoading(payload) {
        this.progress && this.progress.hide();
        this.loading = false;
    }
    
    testData(data) {
        this._initedData = data;
    }
    
    changeScene(name, onLaunched, initData) {
        this.showLoading();
        clearTimeout(this._errorMessageTimeout);
        app.system.loadScene(name, onLaunched, initData);
    }

    loginToDashboard(username, password, isRegister = false, isQuickLogin = false, accessToken = null, fbId = null, cb, tmpRegister = false) {
        this.showLoading(app.res.string('connecting_to_server'));
        this._errorMessageTimeout = setTimeout(() => {
            if(app.service.getClient()._socketEngine.isConnecting){
                app.service.getClient()._socketEngine.disconnect();
                // app.service._onSocketError();
            }
        }, 15 * 1000);
        
        if (app.service.getClient().isConnected()) {
            this._requestAuthen(username, password, isRegister, isQuickLogin, accessToken, fbId, null, cb, tmpRegister);
        } else {
            this._tryToConnectAndLogin(username, password, isRegister, isQuickLogin, accessToken, fbId, null, cb, tmpRegister);
        }
    }

    _initProgress() {
        cc.loader.setAutoReleaseRecursively('common/FullSceneProgress', false);
        let progressNode = cc.instantiate(app.res.prefab.fullSceneLoading);
        if (progressNode) {
            this.node.parent.addChild(progressNode, app.const.loadingZIndex);
            this.progress = progressNode.getComponent('FullSceneProgress');
        }
    }

    _tryToConnectAndLogin(username, password, isRegister, isQuickLogin, accessToken, fbId, tryOneTime, cb, tmpRegister){
        app.service.connect((success) => {
            if (success) {
                this._requestAuthen(username, password, isRegister, isQuickLogin, accessToken, fbId, tryOneTime, cb, tmpRegister);
            }
        });
    }

    _requestAuthen(username, password, isRegister, isQuickLogin, accessToken, fbId, tryOneTime, cb, tmpRegister) {
        
        clearTimeout(this._errorMessageTimeout);
        // cc.log(`isAndroid ${app.env.isAndroid()}`, app.env.isMobile(),  cc.sys.os, cc.sys.OS_ANDROID, cc.sys.platform , cc.sys.ANDROID);
        if (app.env.isAndroid()) {
            const isRooted = window.jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSBUtils", "isRooted", "()Z");
            // cc.log(`device rooted ? ${isRooted} `);
            if(isRooted){
                this.hideLoading();
                app.system.info(app.res.string('message_not_support_rooted_device'));
                return;
            }
        }
        else if(app.env.isIOS()){
            const isJailbroken = window.jsb.reflection.callStaticMethod("JSBUtils", "isJailbroken");
            if(isJailbroken){
                this.hideLoading();
                app.system.info(app.res.string('message_not_support_rooted_device'));
                return;
            }
        }
        
        app.service.requestAuthen(username, password, isRegister, isQuickLogin, accessToken, fbId, (error, result) => {
            if (error) {
                let splitMsgs = error.errorMessage && error.errorMessage.split('|');
                
                if(splitMsgs && splitMsgs.length > 1){
                    if(splitMsgs[0] == 'submitServer'){
                        if(tryOneTime){
                            error = "5"; //Hệ thống đang quá tải
                            app.system.hideLoader();
                            app.system.showErrorToast(app.getMessageFromServer(error));
                        } else {
                            app.config.host = splitMsgs[1]
                            app.config.port = parseInt(splitMsgs[2])
                            app.service.disconnect();
                            let tryToConnectInterval = setInterval(() => {
                                if(!app.service.getClient().isConnected()) {
                                    clearInterval(tryToConnectInterval)
                                    app.config.useSSL = false;
                                    app.service.getClient().config.useSSL = false;
                                    this._tryToConnectAndLogin(username, password, isRegister, isQuickLogin, accessToken, fbId, true)
                                }
                            }, 100)
                        }
                    } else if(splitMsgs[0] == '121'){ //Force update version
                        let versionStr = splitMsgs[1];
                        let downloadLink = splitMsgs[2];
                        if(versionStr && downloadLink){
                            let message = app.res.string("message_force_update_version", {version: versionStr})
                            app.system.confirm(message, null, () => {
                                cc.sys.openURL(downloadLink);   
                            })
                        }
                    }
                } else {
                    if(error.errorMessage == '122') { // facebook token is invalid, sdkbox saves local token, logout order to renew
                        // logout fb 
                        app.facebookActions.logout(() => app.facebookActions.login(this._onLoginWithAccessToken.bind(this)), this._showFBLoginPopup); // at this line, this._showFBLoginPopup = true
                        this._showFBLoginPopup = false;
                        return;
                    } 
                    app.system.hideLoader();
                    app.system.showErrorToast(app.getMessageFromServer(error));
                    
                    isRegister && cb && cb();
                }
            }
            if (result) {
                // set storage
                if(isRegister) {
                    let b64 = new Base64();
                    let userInfo = b64.encodeSafe(`${username}:${password}`);
                    app.system.marker.setItem(app.const.USER_LOCAL_STORAGE, userInfo);
                }
               
                log(`Logged in as ${app.context.getMe().name}`);

                if (app.env.isMobile() && window.sdkbox) {
                    window.sdkbox.PluginGoogleAnalytics.setUser(app.context.getMe().name);
                } 
                else if(app.env.isBrowser()) {
                    let l = location.href;
                    l = l.split("?")
                    l && l.length > 0 && (l = l[0])
                    l && window.history.pushState("", "Bai1368", l);
                }
                this.showLoading(app.res.string('login_success'));

                if(result.newVersion && result.newVersionLink){
                    app.context.newVersionInfo = {newVersion: result.newVersion, newVersionLink: result.newVersionLink}
                }

                /**
                 * after login try to resend iap saved on local storage
                 */
                
                // app.system.marker.initCaches();
                
                this.changeScene(app.const.scene.DASHBOARD_SCENE, () => {setTimeout(() => this._resendIAPSavedItem(), 2000)}, {a: 1, b: 2});
            }
        }, tmpRegister);
    }
    
    _onLoginWithAccessToken(fbId, accessToken) {
        this.loginToDashboard("", "", false, false, accessToken, fbId);
    }
    
    _resendIAPSavedItem() {
        if (!app.env.isMobile())
            return;

        let receipts = app.iap.getPurchasesByUsername(app.context.getMyInfo().name);
        
        if (!receipts || receipts.length == 0)
            return;

        let purchases = [];

        receipts.forEach(receipt => {
            let item;
            if (app.env.isIOS()) {
                item = receipt.receipt;
            } else if (app.env.isAndroid()) {
                item = { productId: receipt.id, token: receipt.receipt };
            }
            purchases.push(item);
        });

        let sendObj = {
            cmd: app.env.isIOS() ? app.commands.IOS_IN_APP_PURCHASE : app.commands.ANDROID_IN_APP_PURCHASE,
            data: {
                purchases
            }
        };

        app.env.isAndroid() && (sendObj.data.resubmit = true);
        
        // app.system.showLoader(app.res.string('re_sending_item_iap'), 60);
        app.service.send(sendObj);
    }
    
    update(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return; // we don't need to do the math every frame
        }
        
        if(app.system.notify && !app.system.notify.isEmptyStack()) {
            app.system.notify.calling()
        }
    }
}