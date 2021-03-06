/**
 * Created by Thanh on 9/15/2016.
 */

import app from 'app';
import { utils, GameUtils } from 'PackageUtils';
import ActorRenderer from 'ActorRenderer';
import PlusBalanceAnimation from 'PlusBalanceAnimation';
import PlayerMessage from 'PlayerMessage';
import RubUtils from 'RubUtils';

export default class PlayerRenderer extends ActorRenderer {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            playerNameLabel: cc.Label,
            balanceLabel: cc.Label,
            ownerIcon: cc.Node,
            plusBalanceNode: cc.Node,
            plusBalanceLabel: cc.Label,
            minusBalanceLabel: cc.Label,
            playerMessageNode: cc.Node,
            playerTimeLineProgress: cc.ProgressBar,
            avatarNode: cc.Node,
            friendProfilePopup: cc.Prefab
        });

        this.playerMessage = null;
        this.plusBalanceAnim = null;
        this.anchorIndex = null;
    }

    convertFromBoardToPlayerLocalPosition(position) {
        let global = this.scene.board.renderer.node.parent.convertToWorldSpaceAR(position);
        return this.node.parent.convertToNodeSpaceAR(global);
    }

    updatePlayerAnchor(anchorIndex) {
        this.anchorIndex = anchorIndex;
        this.playerMessage && this.playerMessage.updateAnchor(anchorIndex);
    }

    _init(data) {
        super._init(data);
        this.scene = app.system.currentScene;
        this.isItMe = data.isItMe;
    }

    onEnable() {
        super.onEnable();

        if(this.data){
            this.setVisibleOwner(this.data.owner);
            this.setVisibleMaster(this.data.master);
        }
        // this.setVisibleReady(this.data.ready);

        this.plusBalanceAnim = this.plusBalanceNode.getComponent('PlusBalanceAnimation');
        this.plusBalanceAnim.setup({ player: this, endCallback: this._onDonePlusBalanceAnimation.bind(this) });

        this.playerMessage = this.playerMessageNode.getComponent('PlayerMessage');
        this.playerMessage.setup(this);

        this._stopCountdown();
        this.loaded = true;

        if(this.anchorIndex >= 0){
            this.updatePlayerAnchor(this.anchorIndex)
        }

        this.isItMe && this.injectComponent();
    }

    getMessageAnchorIndex(anchorIndex = this.anchorIndex) {
        return anchorIndex;
    }

    /**
     * @abstract
     */
    injectComponent() {
    }

    setName(name) {
        this.playerName = name;
        this.playerNameLabel.string = name.length > 9? `${name.slice(0, 9)}...` : name;
    }

    setBalance(balance = 0) {
        this.balanceLabel && (this.balanceLabel.string = GameUtils.formatBalanceShort(balance));
    }

    setVisibleOwner(visible) {
        utils.setActive(this.ownerIcon, visible);
    }

    setVisibleMaster(visible = false) {}

    setVisibleReady(visible) {
        this.ready = visible;
        this.node.cascadeOpacity = true;
        this.node.opacity = visible ? 255 : 150;
    }

    update(dt) {
        if (this.isCounting && this.timelineDuration > 0) {
            this.playerTimeLineProgress.progress = this.counterTimer / this.timelineDuration;

            if (this.counterTimer >= this.timelineDuration) {
                this._stopCountdown();
            }

            this.counterTimer += dt;
            if (this.counterTimer >= this.timelineDuration) {
                this.isCounting = false;
                this.playerTimeLineProgress.progress = 1;
            }
        }
    }

    showMessage(message) {
        if (utils.isEmpty(message)) return;
        this.playerMessage.show(message);
    }

    startPlusBalanceAnimation(balance, playSlowAnim = false) {
        if (!this.loaded || isNaN(balance)) return;
        if(balance == 0)
            return;
            
        let isWinner = balance >= 0;
        let balanceStr = GameUtils.formatBalanceShort(balance) || 0;

        if (this.plusBalanceLabel && this.plusBalanceNode && this.minusBalanceLabel) {
            this.minusBalanceLabel.string = "";
            this.plusBalanceLabel.string = "";

            if (isWinner) {
                this.plusBalanceLabel.string = `+${balanceStr}`;
            } else {
                this.minusBalanceLabel.string = balanceStr;
            }

            if(playSlowAnim){
                this.plusBalanceAnim.playSlow();
            }else{
                this.plusBalanceAnim.play();
            }
        }
    }

    showUserProfilePopup(node, user, userId, avatarURL, isOwner, startAnimNode, endAnimNode) {
        let popup = cc.instantiate(this.friendProfilePopup);
        let component = popup.getComponent('FriendProfilePopup');
        component.displayUserDetail(user, userId, avatarURL, isOwner);
        component.setCallbackOptions(startAnimNode, endAnimNode);
        node.addChild(popup);
    }

    _startCountdown(duration) {
        if (this.playerTimeLineProgress) {
            this.timelineDuration = duration;
            this.isCounting = true;
            this.counterTimer = 0;
        }
    }

    _stopCountdown() {
        if (this.playerTimeLineProgress) {
            this.timelineDuration = 0;
            this.isCounting = false;
            this.counterTimer = 0;
            this.playerTimeLineProgress.progress = 0;
        }
    }

    _onDonePlusBalanceAnimation() {
        this.plusBalanceLabel.string = "";
    }

    /**
     *
     * @abstract
     */
    _reset() {
        // this.setVisibleReady(false);
        this.stopAllAnimation();
    }

    stopAllAnimation() {

    }

    showStatus(status, text = '', show = true) {
        utils.setActive(status, show);
        if (show) {
            let statusLabel = this._findStatusLabel();
            statusLabel && (statusLabel.string = text)
        }
    }

    _findStatusLabel(statusNode) {
        return statusNode ? statusNode.children.filter(child => child instanceof cc.Label).pop() : null;
    }
    
    initPlayerAvatar(url) {
        if(this.avatarNode) {
            let sprite = this.avatarNode.getComponentInChildren(cc.Sprite);
            sprite && url && app.context.loadUserAvatarByURL(url, sprite);
        }
    }

    isPositionOnTop(anchorIndex = this.anchorIndex){
        return this.scene.gamePlayers && this.scene.gamePlayers.playerPositions.isPositionOnTop(anchorIndex)
    }

    isPositionOnRight(anchorIndex = this.anchorIndex){
        return this.scene.gamePlayers && this.scene.gamePlayers.playerPositions.isPositionOnRight(anchorIndex)
    }

    isPositionOnLeft(anchorIndex = this.anchorIndex){
        return this.scene.gamePlayers && this.scene.gamePlayers.playerPositions.isPositionOnLeft(anchorIndex)
    }

    isMePositionOnLeft(anchorIndex = this.anchorIndex){
        return this.scene.gamePlayers && this.scene.gamePlayers.playerPositions.isMePositionOnLeft(anchorIndex)
    }
}

app.createComponent(PlayerRenderer);