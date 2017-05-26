/**
 * Created by Thanh on 10/20/2016.
 */

import app from 'app';
import Component from 'Component';

export default class PlusBalanceAnimation extends Component {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            normalAnimName: {
                default: "plusBalance",
                type: cc.String
            },
            slowAnimName: {
                default: "plusBalanceSlow",
                type: cc.String
            }
        }

        this.player = null;
        this.startCallback = null;
        this.endCallback = null;
    }

    onLoad(){
        super.onLoad()

        this._plusAnim = this.node.getComponent(cc.Animation)
    }

    onDestroy() {
        super.onDestroy()
        this.startCallback = null;
        this.endCallback = null;
    }

    setup({ player = null, startCallback = null, endCallback = null } = {}) {
        this.player = player;
        this.startCallback = startCallback;
        this.endCallback = endCallback;

        player = null;
        startCallback = null;
        endCallback = null;
    }

    play() {
        this._plusAnim.play(this.normalAnimName);
    }

    playSlow(){
        this._plusAnim.play(this.slowAnimName);
    }

    onAnimationStart() {
        this.node.active = true;
        this.startCallback && this.startCallback();
    }

    onAnimationEnd() {
        this.node.active = false;
        this.endCallback && this.endCallback();
        this._plusAnim.stop()
    }
}

app.createComponent(PlusBalanceAnimation);