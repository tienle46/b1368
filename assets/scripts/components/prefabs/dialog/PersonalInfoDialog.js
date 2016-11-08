import app from 'app';
import Dialog from 'Dialog';

class PersonalInfoDialog extends Dialog {
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

app.createComponent(PersonalInfoDialog);