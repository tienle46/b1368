/**
 * Created by Thanh on 10/17/2016.
 */

import app from 'app';
import Component from 'Component';

export default class Progress extends Component {
    constructor() {
        super();

        this.spinNode = cc.Node;
        this.duration = 2;
        this.timeoutCb = null;
        this.pending = false;
        this.active = true;
    }

    onEnable(){
        this.spinNode.runAction(cc.repeatForever(cc.rotateBy(1.0, 360)));

        console.log("Progress onEnable: ", this.parent, this.node.active, Date.now());

        if (this.duration) {
            this.interval = setInterval(() => {
                this.interval && clearInterval(this.interval);
                this.timeoutCb ? this.timeoutCb() : this.hide();
            }, this.duration * 1000);
        }
    }

    onDisable() {
        console.log("Progress onDisable: ", this.parent, this.node.active, Date.now());

        this.spinNode && this.spinNode.stopAllActions() && (this.spinNode.active = false);

        this.interval && clearInterval(this.interval);
    }

    show(duration = 60, timeoutCb) {
        this.hide();

        this.duration = duration;
        this.timeoutCb = timeoutCb;
        this.node.active = true;
    }

    hide() {
        console.log("Progress hide: ", this.node.active, this.node);
        this.node.active = false;

    }
}

app.createComponent(Progress);