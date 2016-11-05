/**
 * Created by Thanh on 10/18/2016.
 */

import MessagePopup from 'MessagePopup';
import app from 'app';

export default class ConfirmPopup extends MessagePopup {
    constructor() {
        super();
    }

    onLoad() {
        super.onLoad();
        this.acceptButton.node.active = true;

        this.denyButtonLabel.string = app.res.string('label_deny');
    }

    confirm(parentNode, message, denyCb, acceptCb) {
        this.show(parentNode, message, denyCb, acceptCb);
    }
}