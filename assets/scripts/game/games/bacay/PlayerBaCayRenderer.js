/**
 * Created by Thanh on 9/15/2016.
 */

import utils from 'utils';
import app from 'app';
import CardList from 'CardList';
import PlayerCardBetTurnRenderer from 'PlayerCardBetTurnRenderer';
import GameUtils from "../../base/utils/GameUtils";
import GameAnim from "../../components/anim/GameAnim";

export default class PlayerBaCayRenderer extends PlayerCardBetTurnRenderer {
    constructor() {
        super();

        this.betComponent = cc.Node;
        this.betCoinNode = cc.Node;

        this.betLabel = {
            default: null,
            type: cc.Label
        }

        this.cuocBienNode = {
            default: null,
            type: cc.Node
        }

        this.cuocBienLabel = {
            default: null,
            type: cc.Label
        }

        this.actionNode = {
            default: null,
            type: cc.Node
        }

        this.actionLabel = {
            default: null,
            type: cc.Label
        }

        this.actionActor = {
            default: null,
            type: cc.Node
        }

        this.cuocBienButton = {
            default : null,
            type: cc.Button,
        };

        /**
         * @type {cc.Animation}
         */
        this.actionNodeAnim = null;
        this.chipPrefab = {
            default : null,
            type : cc.Prefab
        };
    }

    onEnable(...args){
        super.onEnable(...args);
        this.actionNodeAnim = this.actionNode.getComponent(cc.Animation);
    }

    updatePlayerAnchor(anchorIndex){
        super.updatePlayerAnchor(anchorIndex);

        this._updatePlayerBetValueComponent();
    }

    _updatePlayerBetValueComponent(){
        let isRightAnchor = this.scene.gamePlayers.playerPositions.isPositionOnRight(this.anchorIndex);
        if(isRightAnchor){
            this.betComponent.setPositionX(-Math.abs(this.betComponent.getPositionX()));
            this.betComponent.setAnchorPoint(1, this.betComponent.getAnchorPoint().y);
            this.betComponent.getComponent(cc.Layout).horizontalDirection = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT;

            this.cuocBienNode.setAnchorPoint(1, this.cuocBienNode.getAnchorPoint().y);
            this.cuocBienNode.setPositionX(-Math.abs(this.cuocBienNode.getPositionX()));
            this.cuocBienNode.getComponent(cc.Layout).horizontalDirection = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT;
        }
    }

    showCuocBienValue(value){
        utils.active(this.cuocBienNode);
        this.cuocBienLabel.string = `${value}`;
    }

    hideCuocBienValue(){
        this.cuocBienLabel.string = '0';
        utils.deactive(this.cuocBienNode);
    }

    showBetAmount(amount){
        let formatted = GameUtils.formatBalance(amount);
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
        let positionOnRight = this.scene.gamePlayers.playerPositions.isPositionOnRight(player.anchorIndex);
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
        let coinChipAmount = this.scene.board.minBet > 0 ? Math.floor(betAmount / this.scene.board.minBet) : 1;
        coinChipAmount = Math.min(coinChipAmount, 3);
        GameAnim.flyTo({fromNode: this.node, toNode: master.renderer.betCoinNode, amount: coinChipAmount, prefab: this.chipPrefab});
    }

    _reset(){
        super._reset();

        utils.setVisible(this.actionActor, false);
    }

}

app.createComponent(PlayerBaCayRenderer);
