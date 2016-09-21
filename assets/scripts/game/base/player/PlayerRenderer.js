/**
 * Created by Thanh on 9/15/2016.
 */

import app from 'app'
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

        this.align;
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
        utils.deactive(this.ownerIcon);
        utils.deactive(this.masterIcon);
        utils.deactive(this.readyIcon);
    }

    onLoad() {
        super.onLoad();

        console.log("player renderer")
    }

    setName(name) {
        this.playerNameLabel.string = name;
    }

    setBalance(balance) {
        this.balanceLabel.string = `${balance}`;
    }

    setVisibleOwner(visible) {
        utils.setActive(this.ownerIcon, visible)
    }

    setVisibleMaster(visible) {
        utils.setActive(this.masterIcon, visible)
    }

    setVisibleReady(visible) {
        utils.setActive(this.readyIcon, visible)
    }
}

app.createComponent(PlayerRenderer);