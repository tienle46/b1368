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

        this.loading = true;

        this.popUp = {
            default: null,
            type: cc.Prefab
        };

        this.progressPrefab = cc.Prefab;
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
        let progressNode = this.progressPrefab && cc.instantiate(this.progressPrefab);
        if (progressNode) {
            progressNode.active = false;
            this.node.addChild(progressNode, 10000);
            this.progress = progressNode.getComponent(FullSceneProgress.name);
        }

        this._pendingAddPopup && this._pendingAddPopup.forEach(msg => {
            this.addPopup(msg);
        });

        this.isLoaded = true;
    }

    onEnable(){
        app.system.setCurrentScene(this);
    }

    start() {
        if (this.onShown && this.onShown instanceof Function) {
            this.onShown();
        }
    }

    onDestroy() {
        super.onDestroy();
    }

    showShortLoading(payload, message = '') {
        this.showLoading(payload, message, 5);
    }

    showLongLoading(payload, message = '') {
        this.showLoading(payload, message, 20);
    }

    showLoading(payload, message = '', timeoutInSeconds = 10) {
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

    changeScene(name, duration = 0.5) {
        app.system.loadScene(name);
        // this.node.runAction(cc.sequence(
        //     cc.fadeOut(duration),
        //     cc.callFunc(function () {
        //         cc.director.loadScene(name);
        //     })
        // ));
    }
}

//asign