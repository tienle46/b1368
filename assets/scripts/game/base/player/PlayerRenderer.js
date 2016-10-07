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

        this.align;
        this.callCounter = {
            default: null,
            type: cc.ProgressBar
        };
    }

    _initUI() {

        // let nameNode = this.node.getChildByName('name');
        // this.playerNameLabel = nameNode && nameNode.getComponent(cc.Label);

        // let balanceNode = this.node.getChildByName('balance');
        // this.balanceLabel = cc.find('balance/balanceText', this.node).getComponent(cc.Label);
        //
        // this.status1 = cc.find('status/status1', this.node);
        // this.status2 = cc.find('status/status2', this.node);
        // this.ownerIcon = this.node.getChildByName('owner');
        // this.masterIcon = this.node.getChildByName('master');
        // this.readyIcon = this.node.getChildByName('ready');
        //
        // console.log("player renderer init ui: ", this.status1 instanceof cc.Node, this.status2 instanceof cc.Node)

        utils.deactive(this.status1);
        utils.deactive(this.status2);

        this.setVisibleOwner(false);
        this.setVisibleMaster(false);
        this.setVisibleReady(false);

        // utils.deactive(this.ownerIcon);
        // utils.deactive(this.masterIcon);
        // utils.deactive(this.readyIcon);

        this.isCounting = true;
        this.counterTimer = 0;
        this.turnDuration = 20;
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
        // utils.setActive(this.readyIcon, visible);
        this.node.cascadeOpacity = true;
        this.node.opacity = visible ? 255 : 100;
    }

    update(dt) {
        if (this.isCounting) {
            this.callCounter.progress = this.counterTimer / this.turnDuration;
            this.counterTimer += dt;
            if (this.counterTimer >= this.turnDuration) {
                this.isCounting = false;
                this.callCounter.progress = 1;
            }
        }
    }

    startCountdown() {
        if (this.callCounter) {
            this.isCounting = true;
            this.counterTimer = 0;
        }
    }

    resetCountdown() {
        if (this.callCounter) {
            this.isCounting = false;
            this.counterTimer = 0;
            this.callCounter.progress = 0;
        }
    }
}

app.createComponent(PlayerRenderer);