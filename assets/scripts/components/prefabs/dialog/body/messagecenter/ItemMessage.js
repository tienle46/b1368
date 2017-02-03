import app from 'app';
import Component from 'Component';

export default class ItemMessage extends Component {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            titleLbl: cc.Label,
            contentLbl: cc.RichText,
            btnLbl: cc.Label,
            btn: cc.Button
        }
    }

    onLoad() {
        super.onLoad();
        this.btn.node.active = false;
    }

    init(title, content, btnText) {
        this.titleLbl.string = title;
        this.contentLbl.string = content;
        if (btnText) {
            this.btnLbl.string = btnText;
            this.btn.node.active = true;
        }
    }
}

app.createComponent(ItemMessage);