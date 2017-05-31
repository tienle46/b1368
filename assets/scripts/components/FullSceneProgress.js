/**
 * Created by Thanh on 10/17/2016.
 */

import app from 'app';
import Component from 'Component';

export default class FullSceneProgress extends Component {
    constructor() {
        super();
        
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
        this.progress = this.progressNode.getComponent('Progress');

        this.label.string = this.text || "";
        this.progress.show(this.duration, () => {
            this.hide();
            this.timeoutCb && this.timeoutCb();
        });
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
        this.node && (this.node.active = true);
    }

    hide() {
        this.progress && this.progress.hide();
        this.node && (this.node.active = false);
    }
}

app.createComponent(FullSceneProgress);