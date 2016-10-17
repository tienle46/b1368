/**
 * Created by Thanh on 10/17/2016.
 */

import app from 'app';
import Progress from 'Progress';

export default class FullSceneProgress {
    constructor() {
        this.label = cc.Label;
        this.progressNode = cc.Node;
        this.progress = null;
        this.pendingToShow = false;
        this.duration = null;
        this.timeoutCb = null;
        this.text = null;
    }

    onLoad(){
        this.progress = this.progressNode.getComponent(Progress.name);
        if(this.pendingToShow){
            this.pendingToShow = false;
            this.show(this.text, this.duration, this.timeoutCb);
        }
    }

    setText(text = ""){
        this.label.string = text;
    }

    show(text = "", duration, timeoutCb){

        this.node.active = true;

        this.setText(text);
        this.text = text;
        this.duration = duration;
        this.timeoutCb = timeoutCb;

        if(this.progress) {
            this.progress.show(duration, () => {
                this.hide();
                timeoutCb && timeoutCb();
            });
        }else{
            this.pendingToShow = true;
        }
    }

    hide(){
        this.node.active = false;
        this.progress && this.progress.hide();

        debug("hide: ", this.progress);
    }
}

app.createComponent(FullSceneProgress);