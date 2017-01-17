import app from 'app';
import Component from 'Component';

export default class P404 extends Component {
    constructor() {
        super();
        this.textLbl = {
            default: null,
            type: cc.Label
        };

        this.addedNodes = {};
    }

    setText(str) {
        this.textLbl.string = str;
    }
}

app.createComponent(P404);