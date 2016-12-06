/**
 * Created by Thanh on 9/15/2016.
 */

import utils from 'utils';
import app from 'app';
import CardList from 'CardList';
import PlayerCardBetTurnRenderer from 'PlayerCardBetTurnRenderer';
import GameUtils from "../../base/utils/GameUtils";

export default class PlayerBaCayRenderer extends PlayerCardBetTurnRenderer {
    constructor() {
        super();

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

        /**
         * @type {cc.Animation}
         */
        this.actionNodeAnim = null;

    }

    onEnable(...args){
        super.onEnable(...args);

        this.actionNodeAnim = this.actionNode.getComponent(cc.Animation);
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
            cardList.setAlign(CardList.ALIGN_BOTTOM_LEFT);
        } else {
            cardList.setSpace(50);
            cardList.setMaxDimension(350);
            cardList.setAlign(this._getHandCardAlign());
        }
    }

    showCuocBienBtn(show = true){
        this.showStatus(this.status2, app.res.string('game_bacay_cuoc_bien'), show)
    }

    showAction(text = ''){
        if(!this.actionNodeAnim) return;

        this.actionNodeAnim.stop();
        this.actionLabel.string = text;
        text.length > 0 && this.actionNodeAnim.play();
    }

    showChangeMasterAnimation(){

        if(!this.actionNodeAnim) return;

        this.actionNodeAnim.stop();
        this.actionLabel.string = app.res.string('game_bacay_cuop_chuong') || '';
        this.actionLabel.string.length > 0 && this.actionNodeAnim.play();
    }

    stopAllAnimation(){
        super.stopAllAnimation();

        utils.deactive(this.actionActor);
        this.actionNodeAnim && this.actionNodeAnim.stop();
    }

}

app.createComponent(PlayerBaCayRenderer);
