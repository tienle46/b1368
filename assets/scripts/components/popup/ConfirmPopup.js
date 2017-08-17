/**
 * Created by Thanh on 10/18/2016.
 */

import app from 'app';
import utils from 'PackageUtils';
import MessagePopup from 'MessagePopup';

export default class ConfirmPopup extends MessagePopup {
    constructor() {
        super();
    }

    onEnable() {
        super.onEnable();
        this.node.zIndex = app.const.popupZIndex;
        utils.active(this.acceptButton);
    }

    getDenyText() {
        return this.denyLabel ? this.denyLabel : app.res.string('label_deny');
    }

    static getPrefab() {
        return app.res.prefab.confirmPopup;
    }

    static confirm(parentNode, message, denyCb, acceptCb, multi) {
        this.show(parentNode, message, denyCb, acceptCb, 'ConfirmPopup', multi);
    }

    static showCustomConfirm(parentNode, message, {acceptLabel, denyLabel, denyCb, acceptCb} = {}) {
        super.showCustomPopup(parentNode, message, {acceptLabel, denyLabel, denyCb, acceptCb, componentName: 'ConfirmPopup'});
    }
}

app.createComponent(ConfirmPopup);