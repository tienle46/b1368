/**
 * Created by Thanh on 10/24/2016.
 */

import app from 'app';
import Component from 'Component';
import TextView from 'TextView';
import { CCUtils, utils } from 'utils';

export default class ToastItem extends Component {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            textViewNode: cc.Node,
        }
        this.message = null;
        this.timeoutId = null;
        this.duration = 5000;
        this.type = ToastItem.TYPE_MESSAGE;
    }

    onLoad() {

        debug("onload toast: ", this.message)

        let textView = this.textViewNode.getComponent('TextView');
        textView.setText(this.message || "");

        let animation = this.node.getComponent(cc.Animation);
        animation && animation.play();

        this.timeoutId = setTimeout(() => this.hide(), this.duration);
    }

    _init({ message = "", type = ToastItem.TYPE_MESSAGE, duration = 5000 } = {}) {
        this.message = message;
        this.type = type;
        this.duration = duration;
    }

    hide() {
        this.node.destroy();
        this.node.removeFromParent(true);
    }

    onDestroy() {
        this.timeoutId && clearTimeout(this.timeoutId);
    }

}

ToastItem.TYPE_MESSAGE = 0;
ToastItem.TYPE_ERROR = 1;

app.createComponent(ToastItem);