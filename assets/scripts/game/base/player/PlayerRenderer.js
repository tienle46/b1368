/**
 * Created by Thanh on 9/15/2016.
 */

import app from 'app';
import {utils, GameUtils} from 'utils';
import ActorRenderer from 'ActorRenderer';
import PlusBalanceAnimation from 'PlusBalanceAnimation';
import PlayerMessageComponent from 'PlayerMessageComponent';

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

        this.plusBalanceNode = cc.Node;
        this.plusBalanceLabel = cc.Label;
        this.messageAnchorTop = cc.Node;
        this.messageAnchorBottom = cc.Node;
        this.sayMessageNode = cc.Node;
        this.sayMessageComponent = null;
        this.messageAnchor = null;
        this.plusBalanceAnimation = null;
        this.anchorIndex = null;
    }

    updatePlayerAnchor(anchorIndex){
        this.anchorIndex = anchorIndex;
        this.sayMessageComponent && this.sayMessageComponent.updateAnchor(anchorIndex);
    }

    _initUI(data = {}) {

        super._initUI(data);

        this.scene = data.scene;

        utils.deactive(this.status1);
        utils.deactive(this.status2);

        this.setVisibleOwner(data.owner);
        this.setVisibleMaster(data.master);
        this.setVisibleReady(data.ready);

        this.plusBalanceAnimation = this.plusBalanceNode.getComponent(PlusBalanceAnimation.name);
        this.plusBalanceAnimation.setup({player: this, endCallback: this._onDonePlusBalanceAnimation.bind(this)});

        this.sayMessageComponent = this.sayMessageNode.getComponent(PlayerMessageComponent.name);
        this.sayMessageComponent.setup(this);

        this.stopCountdown();
        this.loaded = true;
    }

    setName(name) {
        this.playerName = name;
        this.playerNameLabel.string = name;
    }

    setBalance(balance = 0) {
        this.balanceLabel.string = GameUtils.formatBalance(balance);
    }

    setVisibleOwner(visible) {
        console.log("setVisibleOwner: ", visible);
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

    _updateCountDown(dt) {
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

    showMessage(message){
        
        console.log("showMessage: ", this);
        
        if(utils.isEmpty(message)) return;
        this.sayMessageComponent.show(message);
    }

    startPlusBalanceAnimation(balance){

        if(!this.loaded || isNaN(balance)) return;

        if(this.plusBalanceLabel && this.plusBalanceNode){
            this.plusBalanceLabel.string = GameUtils.toChangedBalanceString(balance);
            this.plusBalanceAnimation.play();
        }

    }

    _onDonePlusBalanceAnimation(){
        this.plusBalanceLabel.string = "";
    }
}

app.createComponent(PlayerRenderer);