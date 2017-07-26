/**
 * Created by Thanh on 12/23/2016.
 */

import app from 'app';
import Component from 'Component';
import utils from 'utils';

export default class EllipseTimeLine extends Component {

    constructor() {
        super();

        this.timelineDuration = 0;
        this._playerTimeLineProgress = null;
        this.isCounting = false;
        this.counterTimer = 0;
        this._enabledTimeLine = false;
    }

    onLoad(){
        super.onLoad();
        this._playerTimeLineProgress = this.node.getComponent(cc.ProgressBar);
    }

    onEnable(){

        super.onEnable();

        this._enabledTimeLine = true;

        if(this.__timeSettedBeforLoaded > 0) {
            this._startCountDown(this.__timeSettedBeforLoaded);
            this.__timeSettedBeforLoaded = 0;
        }

    }

    _startCountDown(duration){
        if (this._playerTimeLineProgress) {
            this.timelineDuration = duration;
            this.isCounting = true;
            this.counterTimer = 0;
        }
    }

    startTimeLine(duration) {

        if(this._enabledTimeLine){
            if (this._playerTimeLineProgress) {
                this.timelineDuration = duration;
                this.isCounting = true;
                this.counterTimer = 0;
            }
        }else{
            this.__timeSettedBeforLoaded = duration;
        }

        utils.active(this.node);
    }

    stop(changeActive = true) {

        changeActive && utils.setActive(this.node, false);

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
        super.onDestroy()
        this.stop(false);
    }
    
    hideProgressBar() {
        utils.deactive(this._playerTimeLineProgress);
    }
}

app.createComponent(EllipseTimeLine);