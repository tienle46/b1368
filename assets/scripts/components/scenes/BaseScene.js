/**
 * Created by Thanh on 8/25/2016.
 */

import app from 'app';
import utils from 'utils';
import Actor from 'Actor';
import BasePopup from 'BasePopup';
import Emitter from 'emitter'
import FullSceneProgress from 'FullSceneProgress';

export default class BaseScene extends Actor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            popUp: cc.Prefab
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

        let progressNode = cc.instantiate(app.res.prefab.fullSceneLoading);
        if (progressNode) {
            this.node.parent.addChild(progressNode, app.const.loadingZIndex);
            this.progress = progressNode.getComponent('FullSceneProgress');
        }

        this._pendingAddPopup && this._pendingAddPopup.forEach(msg => {
            this.addPopup(msg);
        });

        this.isLoaded = true;
    }

    onEnable() {
        super.onEnable();


        if (this.onShown && this.onShown instanceof Function) {
            this.onShown();
        }
        this.progress && this.progress.hide();
    }

    start() {
        super.start();
        app.system.setSceneChanging(false);
    }

    onDestroy() {
        super.onDestroy();
        app.system.setSceneChanging(true);
    }

    showShortLoading(message = '', payload = '') {
        this.showLoading(payload, message, 5);
    }

    showLongLoading(message = '', payload = '') {
        this.showLoading(payload, message, 20);
    }

    showLoading(message = '', timeoutInSeconds = 10, payload = '') {
        this.hideLoading(payload);

        if (utils.isNumber(message)) {
            timeoutInSeconds = message;
            message = "";
        }

        this.progress && this.progress.show(message, timeoutInSeconds);

        this.loading = true;
    }

    hideLoading(payload) {
        this.loading = false;
        this.progress && this.progress.hide();
    }

    // show popup
    addPopup(string = null) {
        if (utils.isEmpty(string)) {
            return;
        }

        if (this.popUp) {
            var popupBase = new cc.instantiate(this.popUp);
            popupBase.position = cc.p(0, 0);
            popupBase.getComponent(BasePopup).setContent(string);
            this.node.addChild(popupBase);
        } else {
            this._addToPendingAddPopup(string);
        }
    }

    changeScene(name, onLaunched) {
        app.system.loadScene(name, onLaunched);
    }
}

//asign