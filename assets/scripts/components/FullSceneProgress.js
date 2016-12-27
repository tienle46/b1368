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
        }

        this.progressNode = {
            default: null,
            type: cc.Node
        }

        this.label = {
            default: null,
            type: cc.Label
        }

        this.text = null;
        this.duration = 60;
        /**
         *
         * @type {Progress}
         */
        this.progress = null;
        this.timeoutCb = null;
    }

    onLoad() {
        super.onLoad();
    }

    onEnable() {
        super.onEnable();

        this.node.on(cc.Node.EventType.TOUCH_START, () => true);

        this.node.active = this.active;
        console.log("on Enable: ", this.active, this.node.active);

        this.progress = this.progressNode.getComponent('Progress');
        if (this.active) {
            this.label.string = this.text || "";
            this.progress.show(this.duration, () => {
                this.hide();
                this.timeoutCb && this.timeoutCb();
            });
        }
    }

    onDisable() {
        super.onDisable();
        this.progress.hide();
    }

    show(text = "", duration = this.duration, timeoutCb) {
        this.hide();

        this.text = text;
        this.duration = duration;
        this.timeoutCb = timeoutCb;
        this.node.active = true;
    }

    hide() {
        this.progress && this.progress.hide();
        this.node.active = false;
    }
}

app.createComponent(FullSceneProgress);