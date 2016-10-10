/**
 * Created by Thanh on 9/15/2016.
 */

import app from 'app';
import ActorRenderer from 'ActorRenderer';
import utils from 'utils';

export default class PlayerRenderer extends ActorRenderer {
    constructor() {
        super();

        this.playerNameLabel = {
            default: null,
            type: cc.Label
        };

        this.balanceLabel = {
            default: null,
            type: cc.Label
        };

        this.status1 = {
            default: null,
            type: cc.Node
        };

        this.status2 = {
            default: null,
            type: cc.Node
        };

        this.ownerIcon = {
            default: null,
            type: cc.Node
        };

        this.masterIcon = {
            default: null,
            type: cc.Node
        };

        this.readyIcon = {
            default: null,
            type: cc.Node
        };

        this.playerTimeLinePrefab = {
            default: null,
            type: cc.Prefab
        };

        this.callCounter = {
            default: null,
            type: cc.ProgressBar
        };
    }

    _initUI(data = {}) {

        super._initUI(data);

        this.scene = data.scene;

        utils.deactive(this.status1);
        utils.deactive(this.status2);

        this.setVisibleOwner(data.owner);
        this.setVisibleMaster(data.master);
        this.setVisibleReady(data.ready);

        this.stopCountdown();
    }

    setName(name) {
        this.playerNameLabel.string = name;
    }

    setBalance(balance) {
        this.balanceLabel.string = `${balance}`;
    }

    setVisibleOwner(visible) {
        utils.setActive(this.ownerIcon, visible);
    }

    setVisibleMaster(visible) {
        utils.setActive(this.masterIcon, visible);
    }

    setVisibleReady(visible) {
        this.ready = visible;
        this.node.cascadeOpacity = true;
        this.node.opacity = visible ? 255 : 100;
    }

    update(dt) {
        if (this.isCounting && this.timelineDuration > 0) {
            this.callCounter.progress = this.counterTimer / this.timelineDuration;

            if(this.counterTimer >= this.timelineDuration){
                this.stopCountdown();
            }

            this.counterTimer += dt;
            if (this.counterTimer >= this.timelineDuration) {
                this.isCounting = false;
                this.callCounter.progress = 1;
            }
        }
    }

    startCountdown(duration) {
        if (this.callCounter) {
            this.timelineDuration = duration;
            this.isCounting = true;
            this.counterTimer = 0;
        }
    }

    stopCountdown(){
        if (this.callCounter) {
            this.timelineDuration = 0;
            this.isCounting = false;
            this.counterTimer = 0;
            this.callCounter.progress = 0;
        }
    }
}

app.createComponent(PlayerRenderer);