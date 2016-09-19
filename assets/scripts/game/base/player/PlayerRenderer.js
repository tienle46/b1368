/**
 * Created by Thanh on 9/15/2016.
 */

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
    }

    _initUI(){
        let nameNode = this.node.getChildByName('name');
        this.playerNameLabel = nameNode && nameNode.getComponent(cc.Label);

        let balanceNode = this.node.getChildByName('balance');
        this.balanceLabel = cc.find('balance/balanceText', this.node).getComponent(cc.Label);

        this.status1 = cc.find('status/status1', this.node);
        this.status2 = cc.find('status/status2', this.node);
        this.ownerIcon = this.node.getChildByName('owner');
        this.masterIcon = this.node.getChildByName('master');
        this.readyIcon = this.node.getChildByName('ready');

        utils.gone(this.status1);
        utils.gone(this.status2);
        utils.gone(this.ownerIcon);
        utils.gone(this.masterIcon);
        utils.gone(this.readyIcon);
    }

    onLoad(){
        super.onLoad();
    }

    setName(name){
        this.playerNameLabel.string = name;
    }

    setBalance(balance){
        this.balanceLabel.string = `${balance}`;
    }

    setVisibleOwner(visible){
        utils.setVisible(this.ownerIcon, visible);
    }

    setVisibleMaster(visible){
        utils.setVisible(this.masterIcon, visible);
    }

    setVisibleReady(visible){
        utils.setVisible(this.readyIcon, visible);
    }
}