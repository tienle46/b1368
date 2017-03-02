/**
 * Created by Thanh on 10/20/2016.
 */

import app from 'app';
import Component from 'Component';

export default class PlusBalanceAnimation extends Component {
    constructor() {
        super();
        this.player = null;
        this.startCallback = null;
        this.endCallback = null;
    }

    onDestroy() {
        this.startCallback = null;
        this.endCallback = null;
    }

    setup({ player = null, startCallback = null, endCallback = null } = {}) {
        this.player = player;
        this.startCallback = startCallback;
        this.endCallback = endCallback;
    }

    play() {
        this.node.getComponent(cc.Animation).play();
    }

    onAnimationStart() {
        this.node.active = true;
        this.startCallback && this.startCallback();
    }

    onAnimationEnd() {
        this.node.active = false;
        this.endCallback && this.endCallback();
    }
}

app.createComponent(PlusBalanceAnimation);