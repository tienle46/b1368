/**
 * Created by Thanh on 10/18/2016.
 */

import app from 'app';
import MessagePopup from 'MessagePopup';
import RubUtils from 'RubUtils';

let currentPopup = null;
export default class ScrollMessagePopup extends MessagePopup {
    constructor() {
        super();

        this.messageLabel = cc.Label;
    }

    initMessageNode(){
    }

    setMessage(message = ""){
        this._hideLoading();
        this.messageLabel && (this.messageLabel.string = message);
    }

    hide(){
        super.hide();
        currentPopup = null;
    }

    static show(parentNode, textOrRequestData, denyCb, acceptCb){

        currentPopup && currentPopup.hide();
        let args = [parentNode, textOrRequestData, denyCb, acceptCb];

        parentNode && textOrRequestData && RubUtils.loadRes('popup/ScrollMessagePopup').then((prefab) => {

            let messagePopupNode = cc.instantiate(prefab);
            let messagePopup = messagePopupNode.getComponent(ScrollMessagePopup.name);
            messagePopup.onShow(...args);

            currentPopup = messagePopup;

        }).catch((error) => {console.error('error: ', error)});

    }
}

app.createComponent(ScrollMessagePopup);