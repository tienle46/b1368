/**
 * Created by Thanh on 9/15/2016.
 */

import utils from 'utils';
import app from 'app';
import CardList from 'CardList';
import PhomList from 'PhomList';
import PlayerCardTurnBaseRenderer from 'PlayerCardTurnBaseRenderer';

export default class PlayerPhomRenderer extends PlayerCardTurnBaseRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            eatenCardListNode: cc.Node,
            eatenCardListNode2: cc.Node,
            anChotAnimName: "",

            playedCardListNode: {
                default: [],
                type: [cc.Node]
            },

            downPhomListNode: {
                default: [],
                type: [cc.Node]
            },
        }

        this.playedCardList = null;
        this.eatenCardList = null;
        this.downPhomList = null;
        this.animation = null;
        this._enabledPlayerPhomRenderer = false
    }

    onEnable(){
        super.onEnable();
        this.animation = this.getComponent(cc.Animation);
        this._enabledPlayerPhomRenderer = true;
        this._reloadComponentOnIndexChanged();
    }

    _reset(){
        super._reset();

        this.playedCardList.clear();
        this.eatenCardList.clear();
        this.downPhomList.clear();
    }

    _reloadComponentOnIndexChanged(){
        this.playedCardListNode.forEach((node, index) => {
            if(index == this.anchorIndex){
                this.playedCardList = node.getComponent(CardList.name);
            }else{
                node.active = false;
            }
        });

        this.downPhomListNode.forEach((node, index) => {
            if(index == this.anchorIndex){
                this.downPhomList = node.getComponent(PhomList.name);
            }else{
                node.active = false;
            }
        });

        this.eatenCardList = this._getEatenCardComponent();
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
        let helpPhom = phomIndex && this.downPhomList.getPhomAt(phomIndex);
        if(helpPhom){
            if(srcCardList){
                helpPhom.transferFrom(cards, srcCardList, {reveal: true});
            }else {
                helpPhom.addCards(cards);
            }
        }
    }

    addPlayedCard(card, srcCardList, isItMe){
        if(srcCardList){
            this.playedCardList.transferFrom([card], srcCardList, {reveal: true});
        }else {
            this.playedCardList.addCards([card]);
        }
    }

    addEatenCard(card, srcCardList, isItMe){
        if(srcCardList){
            this.eatenCardList.transferFrom([card], srcCardList, {reveal: true});
        }else {
            this.eatenCardList.addCards([card]);
        }
    }

    clearEatenCards(){
        this.eatenCardList.clear();
    }

    _getCardAnchorPoint(player) {
        return player.anchorIndex == 3 ? this.defaultCardAnchor2 : super._getCardAnchorPoint(player);
    }

    /**
     *
     * @returns {CardList}
     * @private
     */
    _getEatenCardComponent(){
        let player = this.data.actor;
        let eatenCardNode = this.anchorIndex == 1 || this.anchorIndex == 3 ? this.eatenCardListNode2 : this.eatenCardListNode;
        return eatenCardNode.getComponent(CardList.name);
    }
}

app.createComponent(PlayerPhomRenderer);
