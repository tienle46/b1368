import app from 'app';
import Component from 'Component';

class TopupDialog extends Component {
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

    onDestroy() {
        super.onDestroy();
        // this._removeGlobalListeners();
    }
}

app.createComponent(TopupDialog);