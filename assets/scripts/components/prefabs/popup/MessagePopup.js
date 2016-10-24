/**
 * Created by Thanh on 10/18/2016.
 */

import app from 'app';
import BasePopup from 'BasePopup';
import TextView from 'TextView';
import utils from 'utils';
import RubUtils from 'RubUtils';
import Component from 'Component';
import Progress from 'Progress';

let currentPopup

export default class MessagePopup extends Component {
    constructor() {
        super();

        this.messageNode = cc.Node;
        this.acceptButton = cc.Button;
        this.acceptButtonLabel = cc.Label;
        this.denyButtonLabel = cc.Label;
        this.messageTextView = null;

        this.loadingComponent = cc.Node;
        this.contentComponent = cc.Node;
        this.popupComponent = cc.Node;

        this.loading = null;
        this.messageLines = 2;
        this.maxPopupWidth = 550;
        this.acceptCb = null;
        this.denyCb = null;
        this.text = '';
        this.requestData = null;
        this.loadingHeight = 100;
    }

    onLoad() {

        this.node.on('touchstart', () => false);

        this.loadingHeight = this.loadingComponent.height;
        this.acceptButton.node.active = false;

        this.denyButtonLabel.string = app.res.string('label_close');
        this.loading = this.loadingComponent.getComponentInChildren(Progress.name);
        this.initMessageNode();

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

    initMessageNode() {
        this.messageTextView = this.messageNode.getComponent(TextView.name);
        this.messageTextView.setMaxWidth(this.maxPopupWidth - 30);
    }

    setMessage(message = "") {
        this._hideLoading();
        this.messageTextView.setText(message);
        let width = this.messageTextView.getWidth();
        this.node.width = width + 30;
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
        app.res.string('label_deny');
    }

    getAcceptText() {
        app.res.string('label_accept');
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

    static show(parentNode, textOrRequestData, denyCb, acceptCb) {

        currentPopup && currentPopup.hide();

        let args = [parentNode, textOrRequestData, denyCb, acceptCb];

        parentNode && textOrRequestData && RubUtils.loadRes('popup/MessagePopup').then((prefab) => {

            let messagePopupNode = cc.instantiate(prefab);
            let messagePopup = messagePopupNode.getComponent(MessagePopup.name);
            messagePopup.onShow(...args);

            currentPopup = messagePopup;

        }).catch((error) => {
            console.error('error: ', error)
        });

    }
}

app.createComponent(MessagePopup);