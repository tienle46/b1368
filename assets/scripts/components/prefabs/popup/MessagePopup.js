/**
 * Created by Thanh on 10/18/2016.
 */

import app from 'app';
import TextView from 'TextView';
import utils from 'utils';
import RubUtils from 'RubUtils';
import Component from 'Component';
import Progress from 'Progress';

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

        this.messageLabel = cc.Label;
        this.loading = null;
        this.acceptCb = null;
        this.denyCb = null;
        this.text = '';
        this.requestData = null;
        this.loadingHeight = 100;
    }

    onLoad(){
        super.onLoad();
        this.node.on('touchstart', () => false);
        this.loadingHeight = this.loadingComponent.height;
        this.loading = this.loadingComponent.getComponentInChildren('Progress');
    }

    onEnable() {
        super.onEnable();

        this.acceptButtonLabel.string = this.getAcceptText();
        this.denyButtonLabel.string = this.getDenyText();

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
        this.node.active = false;
        this.node.removeFromParent(true);
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

        parentNode.addChild(this.node, 10000);
    }

    static show(parentNode, textOrRequestData, denyCb, acceptCb, componentName = 'MessagePopup') {

        currentPopup && currentPopup.hide();

        let args = [parentNode, textOrRequestData, denyCb, acceptCb];

        parentNode && textOrRequestData && RubUtils.loadRes(`popup/${componentName}`).then((prefab) => {

            let messagePopupNode = cc.instantiate(prefab);
            let messagePopup = messagePopupNode.getComponent(`${componentName}`);
            messagePopup.onShow(...args);

            currentPopup = messagePopup;

        }).catch((error) => {
            console.error('error: ', error)
        });

    }
}

app.createComponent(MessagePopup);