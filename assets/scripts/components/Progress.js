/**
 * Created by Thanh on 10/17/2016.
 */

import app from 'app';
import Component from 'Component';

export default class Progress extends Component {
    constructor() {
        super();

        this.spinNode = {
            default: null,
            type: cc.Node
        };

        this.duration = 2;
        this.timeoutCb = null;
        this.pending = false;
        this.active = true;
    }

    onEnable() {
        this.spinNode.runAction(cc.repeatForever(cc.rotateBy(1.0, 360)));

        if (this.duration) {
            this.interval = setInterval(() => {
                this.interval && clearInterval(this.interval);
                this.timeoutCb ? this.timeoutCb() : this.hide();
            }, this.duration * 1000);
        }
    }

    onDisable() {
        this.interval && clearInterval(this.interval);
        this.spinNode && this.spinNode.stopAllActions() && (this.spinNode.active = false);
    }

    show(duration = 60, timeoutCb) {
        if (this.node) {
            this.hide();

            this.duration = duration;
            this.timeoutCb = timeoutCb;
            this.node.active = true;
        }
    }

    hide() {
        this.node && (this.node.active = false);
    }
}

app.createComponent(Progress);