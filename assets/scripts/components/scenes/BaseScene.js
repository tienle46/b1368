/**
 * Created by Thanh on 8/25/2016.
 */

import app from 'app';
import utils from 'utils';
import Actor from 'Actor';
import FullSceneProgress from 'FullSceneProgress';
import CCUtils from 'CCUtils';

export default class BaseScene extends Actor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            emptyNode: cc.Node,
            bodyNode: cc.Node,
        }

        this.loading = true;
        this.progress = null;
        this.onShown = null;
        this.isLoaded = false;
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
    }

    onDestroy() {
        super.onDestroy();
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

    showLoading(message = '', timeoutInSeconds = 10, payload = '') {
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

    changeScene(name, onLaunched) {
        this.showLoading()
        app.system.loadScene(name, onLaunched);
    }

    loginToDashboard(username, password, isRegister = false, isQuickLogin = false, accessToken = null) {

        app.system.showLoader('Đang kết nối đến server ...');

        if (app.service.client.isConnected()) {
            this._requestAuthen(username, password, isRegister, isQuickLogin, accessToken);
        } else {
            this._tryToConnectAndLogin(username, password, isRegister, isQuickLogin, accessToken);
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

    _tryToConnectAndLogin(username, password, isRegister, isQuickLogin, accessToken, tryOneTime){
        app.service.connect((success) => {
            if (success) {
                this._requestAuthen(username, password, isRegister, isQuickLogin, accessToken, tryOneTime);
            }
        });
    }

    _requestAuthen(username, password, isRegister, isQuickLogin, accessToken, tryOneTime) {
        app.service.requestAuthen(username, password, isRegister, isQuickLogin, accessToken, (error, result) => {
            if (error) {
                console.log(error.errorMessage)
                let splitMsgs = error && error.errorMessage && error.errorMessage.split('|');
                if(splitMsgs && splitMsgs.length > 0 && splitMsgs[0] == 'submitServer'){
                    if(tryOneTime){
                        error = "5"; //Hệ thống đang quá tải
                        app.system.hideLoader();
                        app.system.showErrorToast(app.getMessageFromServer(error));
                    }else{
                        app.config.host = splitMsgs[1]
                        app.config.port = parseInt(splitMsgs[2])
                        app.service.disconnect();
                        let tryToConnectInterval = setInterval(() => {
                            if(!app.service.client.isConnected()) {
                                clearInterval(tryToConnectInterval)
                                app.config.useSSL = false;
                                app.service.client.config.useSSL = false;
                                this._tryToConnectAndLogin(username, password, isRegister, isQuickLogin, accessToken, true)
                            }
                        }, 100)
                    }
                }else{
                    app.system.hideLoader();
                    app.system.showErrorToast(app.getMessageFromServer(error));
                }
            }
            if (result) {

                log(`Logged in as ${app.context.getMe().name}`);

                if (app.env.isMobile() && window.sdkbox) {
                    window.sdkbox.PluginGoogleAnalytics.setUser(app.context.getMe().name);
                }
                app.system.showLoader('Đăng nhập thành công ...');

                /**
                 * after login try to resend iap saved on local storage
                 */
                
                // app.system.marker.initCaches();
                
                this.changeScene(app.const.scene.DASHBOARD_SCENE, () => {setTimeout(() => this._resendIAPSavedItem(), 2000)});
            }
        });
    }

    _resendIAPSavedItem() {
        if (!app.env.isMobile())
            return;

        let receipts = app.context.getPurchases();
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
        app.system.showLoader(app.res.string('re_sending_item_iap'), 60);
        app.service.send(sendObj);
    }
}