/**
 * Created by Thanh on 9/15/2016.
 */

import utils from 'utils';
import app from 'app';
import CardList from 'CardList';
import PhomListComponent from 'PhomListComponent';
import PlayerCardTurnBaseRenderer from 'PlayerCardTurnBaseRenderer';

export default class PlayerPhomRenderer extends PlayerCardTurnBaseRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            eatenCardListNode: cc.Node,
            eatenCardListNode2: cc.Node,
            anChotNode: cc.Node,
            anChotAnimName: "showAnChot",

            playedCardListNodes: {
                default: [],
                type: [cc.Node]
            },

            downPhomListNodes: {
                default: [],
                type: [cc.Node]
            },
        }

        this.playedCardList = null;
        this.eatenCardList = null;
        this.downPhomList = null;

        /**
         * @type {PhomListComponent}
         * @private
         */
        this._downPhomListComponent = null;
        this.animation = null;
        this._enabledPlayerPhomRenderer = false
    }

    onEnable(){
        super.onEnable();
        this.animation = this.getComponent(cc.Animation);
        this._enabledPlayerPhomRenderer = true;
        this._reloadComponentOnIndexChanged();

        utils.active(this.anChotNode);
    }

    _reset(){
        super._reset();

        console.log("clean reset Phom renderer")
        
        this.playedCardList.clear();
        this.eatenCardList.clear();
        this.cardList.clear();
        this.downPhomList && this.downPhomList.clear();
    }

    setHighlightPhom(phom, highlight){
        this._downPhomListComponent.setHighlight(phom, highlight);
    }

    downPhom(playerPhomList, player){
        return this._downPhomListComponent.setPhomList(playerPhomList, player);
    }

    cleanHighlightDownPhom(){
        this._downPhomListComponent.cleanHighlight();
    }

    _reloadComponentOnIndexChanged(){

        console.log("this.anchorIndex: ", this.anchorIndex);

        this.playedCardListNodes.forEach((node, index) => {
            if(index == this.anchorIndex){
                this.playedCardList = node.getComponent('CardList');
            }else{
                node.active = false;
            }
        });

        this.downPhomListNodes.forEach((node, index) => {
            if(index == this.anchorIndex){
                this._downPhomListComponent = node.getComponent('PhomListComponent');
                this.downPhomList = this._downPhomListComponent.phomList;
            }else{
                node.active = false;
            }
        });

        this.eatenCardList = this._getEatenCardComponent();
    }

    start(){
        super.start();
        /**
         * In first time load player, method _reloadComponentOnIndexChanged call before this._downPhomListComponent.phomList assigned
         */
        this.downPhomList = this._downPhomListComponent.phomList
    }

    /**
     * This method must call inner method onEnable of PlayerPhom.
     * Component PlayerPhom must added above PlayerPhomRenderer
     *
     * @param anchorIndex
     */
    updatePlayerAnchor(anchorIndex){
        super.updatePlayerAnchor(anchorIndex);

        if(this._enabledPlayerPhomRenderer){
            this._reloadComponentOnIndexChanged();
        }
    }

    showAnChot(){
        this.animation && this.animation.play(this.anChotAnimName);
    }

    addHelpCard(cards, srcCardList, phomIndex){
        let helpPhom = phomIndex && this.downPhomList[phomIndex];
        if(helpPhom){
            if(srcCardList){
                helpPhom.transferFrom(srcCardList, cards);
            }else {
                helpPhom.addCards(cards);
            }
        }
    }

    addPlayedCard(cards, srcCardList, isItMe){
        if(srcCardList){
            this.playedCardList.transferFrom(srcCardList, cards);
        }else {
            this.playedCardList.addCards(cards);
        }
    }

    addEatenCard(card, srcCardList, isItMe){
        if(srcCardList){
            this.eatenCardList.transferFrom(srcCardList, [card]);
        }else {
            this.eatenCardList.addCards([card]);
        }
    }

    clearEatenCards(){
        this.eatenCardList.clear();
    }

    _getCardAnchorPoint(player) {
        return player.anchorIndex == 4 ? this.defaultCardAnchor2 : super._getCardAnchorPoint(player);
    }

    /**
     *
     * @returns {CardList}
     * @private
     */
    _getEatenCardComponent(){
        let player = this.data.actor;
        let eatenCardNode = this.anchorIndex == 1 || this.anchorIndex == 4 ? this.eatenCardListNode2 : this.eatenCardListNode;
        return eatenCardNode.getComponent('CardList');
    }
}

app.createComponent(PlayerPhomRenderer);