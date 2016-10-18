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
        this.progress = null;
        this.pendingToShow = false;
        this.duration = null;
        this.timeoutCb = null;
        this.text = null;
        this.showing = false;
    }

    onLoad(){

        !this.showing && (this.node.active = false);

        this.progress = this.progressNode.getComponent(Progress.name);
        if(this.pendingToShow){
            this.pendingToShow = false;
            this.show(this.text, this.duration, this.timeoutCb);
        }

        this.node.on('touchstart', () => {});

    }

    setText(text = ""){
        this.label.string = text;
    }

    show(text = "", duration, timeoutCb){
        this.showing = true;
        this.setText(text);
        this.text = text;
        this.duration = duration;
        this.timeoutCb = timeoutCb;

        if(this.progress) {
            this.node.active = true;
            this.progress.show(duration, () => {
                this.hide();
                timeoutCb && timeoutCb();
            });
        }else{
            this.pendingToShow = true;
        }
    }

    hide(){
        this.showing = false;
        this.node.active = false;
        this.progress && this.progress.hide();
    }
}

app.createComponent(FullSceneProgress);