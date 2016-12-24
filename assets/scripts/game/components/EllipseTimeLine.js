/**
 * Created by Thanh on 12/23/2016.
 */

import app from 'app';
import Component from 'Component';

export default class EllipseTimeLine extends Component {

    constructor() {
        super();

        this.timelineDuration = 0;
        this._playerTimeLineProgress = null;
        this.isCounting = false;
        this.counterTimer = 0;
        this.__timeSettedBeforLoaded = 0;
        this._enabled = false;
    }

    onLoad(){
        super.onLoad();
        this._playerTimeLineProgress = this.node.getComponent(cc.ProgressBar);
    }

    onEnable(){
        super.onEnable();
        this._enabled = true;

        if(this.__timeSettedBeforLoaded > 0) {
            this.timelineDuration = this.__timeSettedBeforLoaded;
            this.__timeSettedBeforLoaded = 0;
        }

    }

    startTimeline(duration) {
        if(this._enabled){
            if (this._playerTimeLineProgress) {
                this.timelineDuration = duration;
                this.isCounting = true;
                this.counterTimer = 0;
            }
        }else{
            this.__timeSettedBeforLoaded = duration;
        }
    }

    stop() {
        if (this._playerTimeLineProgress) {
            this.timelineDuration = 0;
            this.isCounting = false;
            this.counterTimer = 0;
            this._playerTimeLineProgress.progress = 0;
        }
    }

    update(dt) {
        if (this.isCounting && this.timelineDuration > 0) {
            this._playerTimeLineProgress.progress = this.counterTimer / this.timelineDuration;

            if (this.counterTimer >= this.timelineDuration) {
                this.stop();
            }

            this.counterTimer += dt;
            if (this.counterTimer >= this.timelineDuration) {
                this.isCounting = false;
                this._playerTimeLineProgress.progress = 1;
            }
        }
    }

    onDestroy() {
        this.stop();
    }
}

app.createComponent(EllipseTimeLine);