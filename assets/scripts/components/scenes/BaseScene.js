/**
 * Created by Thanh on 8/25/2016.
 */

import app from 'app';
import utils from 'utils';
import Component from 'Component';
import BasePopup from 'BasePopup';
import Emitter from 'emitter'

export default class BaseScene extends Component {
    constructor() {
        super();

        this.loading = true;

        this.popUp = {
            default: null,
            type: cc.Prefab
        };

        this._eventEmitter = new Emitter();

        this.onShown = null;
    }

    /**
     * This func to add listener to handler data from server or a custom action into game system
     *
     * If event is belong to UI let use listener of cc.Node (node.on, node.off, node.emit, etc...) instead
     *
     * NOTE: Don't forget to add remove this event have been added into _removeListener func to avoid memory leak
     *
     * Example:
     *      app.system.addListener('adminMessage', () => {
     *          //Show admin message
     *      })
     *
     * @private
     */
    _addListener() {
        //TODO
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
    _removeListener() {
        //TODO
    }

    start() {
        app.system.setCurrentScene(this);

        if (this.onShown && this.onShown instanceof Function) {
            this.onShown();
        }
    }

    onLoad() {
        this._addListener();
    }

    onDestroy() {
        this._removeListener();
        this._eventEmitter.removeListener();
    }

    showShortLoading(payload, message = '') {
        this.showLoading(payload, message, 5);
    }

    showLongLoading(payload, message = '') {
        this.showLoading(payload, message, 20);
    }

    showLoading(payload, message, timeoutInSeconds = 10) {
        this.hideLoading(payload);

        if (utils.isNumber(message)) {
            timeoutInSeconds = message;
        }

        //TODO

        this.loading = true;
    }

    hideLoading(payload) {
        this.loading = false;
        //TODO
    }

    // show popup
    addPopup(string = null) {
        var popupBase = new cc.instantiate(this.popUp);
        popupBase.position = cc.p(0, 0);
        popupBase.getComponent(BasePopup).setContent(string);
        this.node.addChild(popupBase, 10);
    }

    changeScene(name, duration = 0.5) {
        this.node.runAction(cc.sequence(
            cc.fadeOut(duration),
            cc.callFunc(function() {
                cc.director.loadScene(name);
            })
        ));
    }

    emit(name, ...args){
        this._eventEmitter.emit(name, ...args);
    }

    on(eventName, listener, context){

        console.debug("on base scene: ", context)

        this._eventEmitter.addListener(eventName, listener, context);
    }

    off(eventName, listener, context){
        this._eventEmitter.removeListener(eventName, listener, context);
    }
}

//asign