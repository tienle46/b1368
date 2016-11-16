import app from 'app';
import Dialog from 'Dialog';

class ExchangeDialog extends Dialog {
    constructor() {
        super();
    }

    onLoad() {
        // this._initComponents();
        this.node.on('touchstart', function() {
            return;
        });
    }

    updatePhoneNode() {
        return this.node.getChildByName('dialog').getChildByName('update_phone_number');
    }

    showUpdatePhone() {
        if (this.updatePhoneNode()) this.updatePhoneNode().active = true;
    }

    hideUpdatePhone() {
        if (this.updatePhoneNode()) this.updatePhoneNode().active = false;
    }
}

app.createComponent(ExchangeDialog);