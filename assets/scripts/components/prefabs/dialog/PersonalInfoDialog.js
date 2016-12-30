import app from 'app';
import Component from 'Component';

class PersonalInfoDialog extends Component {
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
}

app.createComponent(PersonalInfoDialog);