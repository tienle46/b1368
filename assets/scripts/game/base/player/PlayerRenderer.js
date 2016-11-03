/**
 * Created by Thanh on 9/15/2016.
 */

import app from 'app';
import {utils, GameUtils} from 'utils';
import ActorRenderer from 'ActorRenderer';
import PlusBalanceAnimation from 'PlusBalanceAnimation';
import PlayerMessage from 'PlayerMessage';

export default class PlayerRenderer extends ActorRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            playerNameLabel: cc.Label,
            balanceLabel: cc.Label,
            status1: cc.Node,
            status2: cc.Node,
            ownerIcon: cc.Node,
            masterIcon: cc.Node,
            plusBalanceNode: cc.Node,
            plusBalanceLabel: cc.Label,
            playerMessageNode: cc.Node,
            playerTimeLineProgress: cc.ProgressBar,
        }

        this.playerMessage = null;
        this.plusBalanceAnim = null;
        this.anchorIndex = null;
    }

    updatePlayerAnchor(anchorIndex){
        this.anchorIndex = anchorIndex;
        this.playerMessage && this.playerMessage.updateAnchor(anchorIndex);
    }

    _init(data){
        console.log("init player renderer")
        super._init(data);
        this.scene = app.system.currentScene;
    }

    onEnable(){
        super.onEnable();

        utils.deactive(this.status1);
        utils.deactive(this.status2);

        this.setVisibleOwner(this.data.owner);
        this.setVisibleMaster(this.data.master);
        this.setVisibleReady(this.data.ready);

        this.plusBalanceAnim = this.plusBalanceNode.getComponent(PlusBalanceAnimation.name);
        this.plusBalanceAnim.setup({player: this, endCallback: this._onDonePlusBalanceAnimation.bind(this)});

        this.playerMessage = this.playerMessageNode.getComponent(PlayerMessage.name);
        this.playerMessage.setup(this);

        this._stopCountdown();

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
        utils.setActive(this.ownerIcon, visible);
    }

    setVisibleMaster(visible) {
        utils.setActive(this.masterIcon, visible);
    }

    setVisibleReady(visible) {
        this.ready = visible;
        this.node.cascadeOpacity = true;
        this.node.opacity = visible ? 255 : 150;
    }

    update(dt) {
        if (this.isCounting && this.timelineDuration > 0) {
            this.playerTimeLineProgress.progress = this.counterTimer / this.timelineDuration;

            if(this.counterTimer >= this.timelineDuration){
                this._stopCountdown();
            }

            this.counterTimer += dt;
            if (this.counterTimer >= this.timelineDuration) {
                this.isCounting = false;
                this.playerTimeLineProgress.progress = 1;
            }
        }
    }

    showMessage(message){
        if(utils.isEmpty(message)) return;
        this.playerMessage.show(message);
    }

    startPlusBalanceAnimation(balance){
        if(!this.loaded || isNaN(balance)) return;

        if(this.plusBalanceLabel && this.plusBalanceNode){
            this.plusBalanceLabel.string = GameUtils.toChangedBalanceString(balance);
            this.plusBalanceAnim.play();
        }
    }

    _startCountdown(duration) {
        if (this.playerTimeLineProgress) {
            this.timelineDuration = duration;
            this.isCounting = true;
            this.counterTimer = 0;
        }
    }

    _stopCountdown(){
        if (this.playerTimeLineProgress) {
            this.timelineDuration = 0;
            this.isCounting = false;
            this.counterTimer = 0;
            this.playerTimeLineProgress.progress = 0;
        }
    }

    _onDonePlusBalanceAnimation(){
        this.plusBalanceLabel.string = "";
    }
}

app.createComponent(PlayerRenderer);