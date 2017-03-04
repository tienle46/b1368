/**
 * Created by Thanh on 10/18/2016.
 */

import app from 'app';
import utils from 'utils';
import RubUtils from 'RubUtils';
import Component from 'Component';
import Progress from 'Progress';
import { destroy } from 'CCUtils';

let currentPopup

export default class MessagePopup extends Component {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            acceptButton: cc.Button,
            acceptButtonLabel: cc.Label,
            denyButtonLabel: cc.Label,
            loadingComponent: cc.Node,
            contentComponent: cc.Node,
            popupComponent: cc.Node,
            componentName: 'MessagePopup'
        }

        this.messageLabel = {
            default: null,
            type: cc.Label,
        };
        this.loading = null;
        this.acceptCb = null;
        this.denyCb = null;
        this.text = '';
        this.requestData = null;
        this.loadingHeight = 100;
    }

    onLoad() {
        super.onLoad();
        this.node.on('touchstart', () => false);
        this.loadingHeight = this.loadingComponent.height;
        this.loading = this.loadingComponent.getComponentInChildren('Progress');
    }

    onEnable() {
        super.onEnable();
        this.node.zIndex = app.const.popupZIndex;
        this.acceptButtonLabel && (this.acceptButtonLabel.string = this.getAcceptText());
        this.denyButtonLabel && (this.denyButtonLabel.string = this.getDenyText());

        if (this.requestData) {
            this._showLoading();
            app.service.send(this.requestData, (data) => {
                // this._hideLoading();

                debug(data);

                if (this.requestData.parser) {
                    let str = this.requestData.parser(data);
                    this.setMessage(str)
                }
            });
        } else {
            this.setMessage(this.text);
        }
    }

    /**
     * @abstract
     */
    static getPrefab() {
        return app.res.prefab.messagePopup;
    }

    onDestroy() {
        super.onDestroy();
        this.denyCb = null;
        this.acceptCb = null;
    }

    setMessage(message = "") {
        this._hideLoading();
        this.messageLabel.string = message;
    }

    _showLoading() {
        this.loadingComponent.height = this.loadingHeight;
        this.loading.show(120, () => this.hide());
        this.contentComponent.active = false;
    }

    _hideLoading() {
        this.loadingComponent.height = 0;
        this.loading.hide();
        this.contentComponent.active = true;
    }

    onClickAcceptButton() {
        this.hide();
        this.acceptCb && this.acceptCb();
    }

    onClickDenyButton() {
        this.hide();
        this.denyCb && this.denyCb();
    }

    hide() {
        if (this.node) {
            this.node.active = false;
            destroy(this.node);
        }
        currentPopup = null;
    }

    getDenyText() {
        return app.res.string('label_close');
    }

    getAcceptText() {
        return app.res.string('label_accept');
    }

    onShow(parentNode, textOrRequestData, denyCb, acceptCb) {
        this.denyCb = denyCb;
        this.acceptCb = acceptCb;

        if (utils.isString(textOrRequestData)) {
            this.text = textOrRequestData;
            this.requestData = null;
        } else {
            this.text = null;
            this.requestData = textOrRequestData;
        }
        denyCb = null;
        acceptCb = null;
        parentNode && parentNode.addChild(this.node, 10000);
    }

    static show(parentNode, textOrRequestData, denyCb, acceptCb, componentName = 'MessagePopup') {

        currentPopup && currentPopup.hide();

        let args = [parentNode, textOrRequestData, denyCb, acceptCb];
        if (parentNode && textOrRequestData) {
            let prefab = this.getPrefab();

            if (prefab) {
                this._createAndShow(prefab, componentName, ...args);
            } else {
                RubUtils.loadRes(`popup/${componentName}`).then((prefab) => this._createAndShow(prefab, componentName, ...args));
            }
        }
        window.release(args);
    }

    static _createAndShow(prefab, componentName, ...args) {
        let messagePopupNode = cc.instantiate(prefab);
        let messagePopup = messagePopupNode.getComponent(`${componentName}`);
        messagePopup.onShow(...args);
        [...args].map(a => a = null);
        currentPopup = messagePopup;
    }
}

app.createComponent(MessagePopup);