/**
 * Created by Thanh on 10/17/2016.
 */

import app from 'app';
import Progress from 'Progress';
import Component from 'Component';

export default class FullSceneProgress extends Component {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            active: false,
            label: cc.Label,
            progressNode:cc.Node
        }

        this.text = null;
        this.duration = 60;
        this.progress = null;
        this.timeoutCb = null;
    }

    onLoad(){
        super.onLoad();

        this.node.active = this.active;
        this.progress = this.progressNode.getComponent(Progress.name);
    }

    onEnable(){
        super.onEnable();

        this.node.on('touchstart', () => {});

        if(this.active){
            this.label.string = this.text || "";
            this.progress.show(this.duration, () => {
                this.hide();
                this.timeoutCb && this.timeoutCb();
            });
        }
    }

    onDisable(){
        super.onDisable();
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