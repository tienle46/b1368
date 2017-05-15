/**
 * Created by Thanh on 9/15/2016.
 */

import utils from 'utils';
import app from 'app';
import CCUtils from 'CCUtils';
import CardList from 'CardList';
import GameUtils from 'GameUtils';
import PlayerCardBetTurnRenderer from 'PlayerCardBetTurnRenderer';
import GameAnim from "../../components/anim/GameAnim";
import * as Events from "../../../core/Events";

export default class PlayerBaCayRenderer extends PlayerCardBetTurnRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            betComponent: cc.Node,
            defaultGopGaIconNode: cc.Node,
            inlineGopGaIconNode: cc.Node,
            betCoinNode: cc.Node,
            cuocBienNode: cc.Node,
            actionNode: cc.Node,
            actionLabel: cc.Label,
            actionActor: cc.Node,
            cuocBienButton: cc.Button,
            chipPrefab: cc.Prefab,
            topBetPositionAnchor: cc.Node,
            bottomBetPositionAnchor: cc.Node,
            centerRightBetPositionAnchor: cc.Node,
            centerLeftBetPositionAnchor: cc.Node,
            bottomRightBetPositionAnchor: cc.Node,
            masterIcon: cc.Node,
        }

        /**
         * @type {cc.Animation}
         */
        this.actionNodeAnim = null
        this.betLabel = null
        this.cuocBienLabel = null
        this.gopGaIcon = null
    }

    _addGlobalListener() {
        super._addGlobalListener();

        // this.scene.on(Events.ON_GAME_MASTER_CHANGED, this._onGameMasterChanged, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        // this.scene.off(Events.ON_GAME_MASTER_CHANGED, this._onGameMasterChanged, this);
    }

    onLoad(){
        super.onLoad()

        this.betLabel = this.betCoinNode.getComponentInChildren(cc.Label);
        this.cuocBienLabel = this.cuocBienNode.getComponentInChildren(cc.Label);
    }

    onEnable(...args){
        super.onEnable(...args);
        this.actionNodeAnim = this.actionNode.getComponent(cc.Animation);
    }

    updatePlayerAnchor(anchorIndex){
        super.updatePlayerAnchor(anchorIndex);

        this._updatePlayerBetValueComponent();
    }

    _updatePlayerBetValueComponent(anchorIndex){

        let player = this.data.actor

        if(player.isItMe() || this.anchorIndex == 1 || this.anchorIndex == 2 || this.anchorIndex == 9){
            this.betComponent.setPosition(this.topBetPositionAnchor.getPosition())
        }else if(this.anchorIndex == 3 || this.anchorIndex == 4){
            this.betComponent.setPosition(this.centerRightBetPositionAnchor.getPosition())
        }else if(this.anchorIndex == 5){
            this.betComponent.setPosition(this.bottomBetPositionAnchor.getPosition())
            this.setLayoutVerticalDirection(this.betComponent, cc.Layout.VerticalDirection.TOP_TO_BOTTOM)

            this.betComponent.setAnchorPoint(0.5, 1)
        }else if(this.anchorIndex == 6){
            this.betComponent.setPosition(this.bottomRightBetPositionAnchor.getPosition())
            this.setLayoutVerticalDirection(this.betComponent, cc.Layout.VerticalDirection.TOP_TO_BOTTOM)

            this.betComponent.setAnchorPoint(0.5, 1)
            this.betCoinNode.setAnchorPoint(1, 0.5)
            this.cuocBienNode.setAnchorPoint(1, 0.5)
            this._reverseHorizontalLayoutDirection(this.betCoinNode);

        } else if(this.anchorIndex == 7 || this.anchorIndex == 8){
            this.betComponent.setPosition(this.centerLeftBetPositionAnchor.getPosition())
            this.betCoinNode.setAnchorPoint(1, 0.5)
            this.cuocBienNode.setAnchorPoint(1, 0.5)
            this.defaultGopGaIconNode.setAnchorPoint(1, 0.5)

            this._reverseHorizontalLayoutDirection(this.betCoinNode);
        }

        this._assignGopGaIcon(this.anchorIndex);

        // let isRightAnchor = this.scene.gamePlayers.playerPositions.isPositionOnRight(this.anchorIndex);
        // if(isRightAnchor){
        //     this.betComponent.setPositionX(-Math.abs(this.betComponent.getPositionX()));
        //     this.betComponent.setAnchorPoint(1, this.betComponent.getAnchorPoint().y);
        //     this.betComponent.getComponent(cc.Layout).horizontalDirection = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT;
        //
        //     this.cuocBienNode.setAnchorPoint(1, this.cuocBienNode.getAnchorPoint().y);
        //     this.cuocBienNode.setPositionX(-Math.abs(this.cuocBienNode.getPositionX()));
        //     this.cuocBienNode.getComponent(cc.Layout).horizontalDirection = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT;
        // }
    }

    _assignGopGaIcon(anchorIndex){
        if(anchorIndex == 5 || anchorIndex == 6){
            this.gopGaIcon = this.inlineGopGaIconNode;
            CCUtils.setVisible(this.defaultGopGaIconNode, false)
        }else{
            this.gopGaIcon = this.defaultGopGaIconNode;
            CCUtils.setVisible(this.inlineGopGaIconNode, false)
        }

        // CCUtils.setVisible(this.gopGaIcon) //only for test
    }

    setLayoutVerticalDirection(node, direction = cc.Layout.VerticalDirection.BOTTOM_TO_TOP){
        let layout = node && node.getComponent(cc.Layout)
        layout && (layout.verticalDirection = direction)
    }

    _reverseHorizontalLayoutDirection(node){
        let layout = node && node.getComponent(cc.Layout)
        layout && (layout.horizontalDirection = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT)
    }

    showCuocBienValue(value){
        utils.active(this.cuocBienNode);
        this.cuocBienLabel.string = `${GameUtils.formatBalanceShort(value)}`;
    }

    hideCuocBienValue(){
        this.cuocBienLabel.string = '0';
        utils.deactive(this.cuocBienNode);
    }

    showBetAmount(amount){
        let formatted = GameUtils.formatBalanceShort(amount);
        this.betLabel.string = `${formatted}`;
    }

    showAddBetToMasterAnimation(amount, fromPlayer){
        //TODO
    }

    revealAllCards(){
        this.cardList.cards.forEach(card => card.setReveal(true));
    }

    _getHandCardAlign(){
        let positionOnRight = this.scene.gamePlayers.playerPositions.isPositionOnRight(this.anchorIndex);
        return positionOnRight ? CardList.ALIGN_BOTTOM_RIGHT : CardList.ALIGN_BOTTOM_LEFT;
    }

    /**
     * @param cardList
     * @param isItMe
     * @override
     */
    _getCardAnchorPoint(player) {
        let positionOnRight = player && this.isPositionOnRight(player.anchorIndex);
        return positionOnRight ? this.defaultCardAnchor2 : this.defaultCardAnchor;
    }

    /**
     * @param cardList
     * @param isItMe
     * @override
     */
    _initHandCardList(cardList, isItMe){
        super._initHandCardList(cardList, isItMe);
        if (isItMe) {
            cardList.setSpace(70);
            cardList.setMaxDimension(350);
            cardList.setDraggable(false);
            cardList.setSelectable(false);
            cardList.setRevealOnClick(true);
            cardList.setReveal(false);
        } else {
            cardList.setSpace(50);
            cardList.setMaxDimension(350);
        }

        cardList.setAlign(CardList.ALIGN_CENTER);
    }

    showCuocBienBtn(show = true){
        utils.setVisible(this.cuocBienButton, show);
    }

    showAction(text = ''){

        this.actionLabel.string = text;

        if(!utils.isEmpty(text)){
            utils.setVisible(this.actionActor, true);
        }

        // if(!this.actionNodeAnim) return;
        //
        // this.actionNodeAnim.stop();
        // this.actionLabel.string = text;
        // text.length > 0 && this.actionNodeAnim.play();
    }

    showChangeMasterAnimation(){

        if(!this.actionNodeAnim) return;

        this.actionNodeAnim.stop();
        this.actionLabel.string = app.res.string('game_bacay_cuop_chuong') || '';
        this.actionLabel.string.length > 0 && this.actionNodeAnim.play();
    }

    stopAllAnimation(){
        super.stopAllAnimation();
        this.actionNodeAnim && this.actionNodeAnim.stop();
    }

    /**
     * @override
     */
    clearCards(){
        if(this.scene.gameState != app.const.game.state.ENDING) {
            super.clearCards();
        }
    }

    playBetAnimation(betAmount){
        let master = this.scene.gamePlayers.master;
        if(master){
            
            // console.debug("master: ", master)
            
            let coinChipAmount = this.scene.board.minBet > 0 ? Math.floor(betAmount / this.scene.board.minBet) : 1;
            coinChipAmount = Math.min(coinChipAmount, 3);
            master.renderer && GameAnim.flyTo({fromNode: this.node, toNode: master.renderer.betCoinNode, amount: coinChipAmount, prefab: this.chipPrefab});
        }
    }

    visibleGopGaIcon(visible = true){
        utils.setVisible(this.gopGaIcon, visible);
    }

    _reset(){
        super._reset();

        utils.setVisible(this.actionActor, false);
        this.visibleGopGaIcon(false);
    }

    setVisibleMaster(visible = false) {
        utils.setActive(this.masterIcon, visible);
    }

}

app.createComponent(PlayerBaCayRenderer);
