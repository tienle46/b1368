/**
 * Created by Thanh on 10/18/2016.
 */

import app from 'app';
import BasePopup from 'BasePopup';
import TextView from 'TextView';
import utils from 'utils';
import RubUtils from 'RubUtils';
import Component from 'Component';

export default class MessagePopup extends Component {
    constructor() {
        super();

        this.messageNode = cc.Node;
        this.acceptButton = cc.Button;
        this.acceptButtonLabel = cc.Label;
        this.denyButtonLabel = cc.Label;
        this.messageTextView = null;

        this.messageLines = 2;
        this.maxPopupWidth = 500;
        this.acceptCb = null;
        this.denyCb = null;
        this.text = '';
    }

    onLoad(){
        this.denyButtonLabel.string = app.res.string('label_close');

        this.acceptButton.node.active = false;
        this.node.on('touchstart', () => {console.log("click popup")});

        this.messageTextView = this.messageNode.getComponent(TextView.name);
        this.messageTextView.setLines(this.messageLines);
        this.messageTextView.setMaxWidth(this.maxPopupWidth - 30);
        this.messageTextView.setText(this.text);
    }

    onClickAcceptButton(){
        this.hide();
        this.acceptCb && this.acceptCb();
    }

    onClickDenyButton(){
        this.hide();
        this.denyCb && this.denyCb();
    }

    hide(){
        this.node.active = false;
        this.node.removeFromParent(true);
    }

    getDenyText(){
        app.res.string('label_deny');
    }

    getAcceptText(){
        app.res.string('label_deny');
    }

    static show(parentNode = app.system.currentScene, text, denyCb, acceptCb){

        parentNode && !utils.isEmpty(text) && RubUtils.loadRes('popup/MessagePopup').then((prefab) => {

            let messagePopupNode = cc.instantiate(prefab);
            let messagePopup = messagePopupNode.getComponent(MessagePopup.name);
            messagePopup.denyCb = denyCb;
            messagePopup.acceptCb = acceptCb;
            messagePopup.text = text;

            parentNode.addChild(messagePopupNode);

            console.log(messagePopupNode)

        }).catch((error) => {console.error('error: ', error)});

    }
}

app.createComponent(MessagePopup);