import app from 'app';
// import Component from 'Component';
// import ToggleGroup from 'ToggleGroup';
// import CheckBox from 'CheckBox';
// import AlertPopupRub from 'AlertPopupRub';
import Dialog from 'Dialog';

class TopupDialog extends Dialog {
    constructor() {
        super();
    }

    onLoad() {
        // this._initComponents();
        this.node.on('touchstart', function() {
            return;
        });
    }
}

app.createComponent(TopupDialog);