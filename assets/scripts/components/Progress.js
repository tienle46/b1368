/**
 * Created by Thanh on 10/17/2016.
 */

import app from 'app';

export default class Progress {
    constructor() {
        this.spinNode = cc.Node;
        this.duration = 1;
    }

    show(duration = 1, timeoutCb){
        this.duration = duration;
        this.node.active = true;

        this.spinNode.runAction(cc.repeatForever(cc.rotateBy(1.0, 360)));
        this.interval = setInterval(() => {

            this.interval && clearInterval(this.interval);
            timeoutCb ? timeoutCb() : this.hide();

        }, this.duration * 1000);
    }

    hide(){
        this.node.active = false;
    }

    onDisable(){
        this.spinNode.stopAllActions();
        this.interval && clearInterval(this.interval);
    }
}

app.createComponent(Progress);