/**
 * Created by Thanh on 10/24/2016.
 */

import app from 'app';
import Component from 'Component';

export default class GameQuickChatItem extends Component {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            label: cc.Label,
        }
    }

    setLabel(text) {
        this.label.string = text || "";
    }

    getLabelText() {
        return this.label.string;
    }
}

app.createComponent(GameQuickChatItem);