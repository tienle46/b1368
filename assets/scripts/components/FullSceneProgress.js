/**
 * Created by Thanh on 10/17/2016.
 */

import app from 'app';
import Progress from 'Progress';
import Component from 'Component';

export default class FullSceneProgress extends Component {
    constructor() {
        super();

        this.label = cc.Label;
        this.progressNode = cc.Node;
        this.active = {
            default: true,
            type: cc.Boolean
        };

        this.text = null;
        this.duration = 60;
        this.progress = null;
        this.timeoutCb = null;
    }

    onLoad(){
        this.node.active = this.active;
        this.progress = this.progressNode.getComponent(Progress.name);
        this.node.on('touchstart', () => {});
    }

    onEnable(){
        if(this.active){
            this.label.string = this.text || "";
            this.progress.show(this.duration, () => {
                this.hide();
                this.timeoutCb && this.timeoutCb();
            });
        }
    }

    onDisable(){
        this.progress.hide();
    }

    show(text = "", duration = this.duration, timeoutCb){
        this.hide();

        this.text = text;
        this.duration = duration;
        this.timeoutCb = timeoutCb;
        this.node.active = true;
    }

    hide(){
        this.progress && this.progress.hide();
        this.node.active = false;
    }
}

app.createComponent(FullSceneProgress);