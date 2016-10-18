/**
 * Created by Thanh on 10/17/2016.
 */

import app from 'app';
import Component from 'Component';

export default class Progress extends Component{
    constructor() {
        super();

        this.spinNode = cc.Node;
        this.duration = 1;
        this.showing = false;
    }

    onLoad(){
        !this.showing && (this.node.active = false);
    }

    show(duration = 1, timeoutCb){
        this.showing = true;
        this.node.active = true;
        this.duration = duration;

        this.spinNode.runAction(cc.repeatForever(cc.rotateBy(1.0, 360)));
        this.interval = setInterval(() => {

            this.interval && clearInterval(this.interval);
            timeoutCb ? timeoutCb() : this.hide();

        }, this.duration * 1000);
    }

    hide(){
        this.showing = false;
        this.node.active = false;
    }

    onDisable(){
        this.spinNode.stopAllActions();
        this.interval && clearInterval(this.interval);
    }
}

app.createComponent(Progress);