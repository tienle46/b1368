/**
 * Created by Thanh on 10/18/2016.
 */

import app from 'app';
import utils from 'utils';
import MessagePopup from 'MessagePopup';

export default class ConfirmPopup extends MessagePopup {
    constructor() {
        super();
    }

    onEnable(){
        super.onEnable();
        utils.active(this.acceptButton);
    }

    getDenyText() {
        return app.res.string('label_deny');
    }

    static confirm(parentNode, message, denyCb, acceptCb) {
        this.show(parentNode, message, denyCb, acceptCb, 'ConfirmPopup');
    }
}

app.createComponent(ConfirmPopup)