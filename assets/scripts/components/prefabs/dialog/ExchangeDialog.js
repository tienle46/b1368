import app from 'app';
import Component from 'Component';

class ExchangeDialog extends Component {
    constructor() {
        super();
    }

    onLoad() {
        super.onLoad();
        // this._initComponents();
        this.node.on('touchstart', function() {
            return;
        });
    }

    start() {
        super.start();
    }

    showNode(updatePhoneNode) {
       updatePhoneNode.active = true;
    }

    hideNode(updatePhoneNode) {
       updatePhoneNode.active = false;
    }
}

app.createComponent(ExchangeDialog);