/**
 * Created by Thanh on 9/15/2016.
 */

import CCUtils from 'CCUtils';
import RubUtils from 'RubUtils';
import app from 'app';
import PlayerCardTurnBaseRenderer from 'PlayerCardTurnBaseRenderer';

export default class PlayerTLMNDLRenderer extends PlayerCardTurnBaseRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            specialInfoImageNode: cc.Node,
            downCardInfoLabel: cc.Label,
            downCardInfoNode: cc.Node,
            downCardAnchorNodes: {
                default: [],
                type: [cc.Node]
            }
        }

        /**
         * @type {[CardList]}
         */
        this.downCardLists = null;
        this.showInfoCardList = null;
    }

    // updatePlayerAnchor(anchorIndex){
    //
    //     console.warn("updatePlayerAnchor ---- ", anchorIndex)
    //
    //     super.updatePlayerAnchor(anchorIndex);
    //
    //     this._changeRemainCardPosition(anchorIndex)
    // }

    _changeRemainCardPosition(anchorIndex){
        let handCardAnchor = this._getCardAnchorPoint(this.data.actor);
        if(handCardAnchor){
            this.remainCardCount.removeFromParent()
            handCardAnchor.addChild(this.remainCardCount)
        }
    }

    _getCardAnchorPoint(player) {
        return player && player.renderer.isPositionOnRight(player.anchorIndex) ? this.defaultCardAnchor2 : super._getCardAnchorPoint(player);
    }

    _reset() {
        super._reset();

        this.downCardInfoLabel.string = "";
        CCUtils.setVisible(this.downCardInfoNode, false);
        CCUtils.setVisible(this.specialInfoImageNode, false)
        this.downCardLists && this.downCardLists.forEach(downCardList => downCardList.clear());
    }

    onEnable(){
        super.onEnable()

        this.downCardLists = [];

        this.downCardInfoLabel = this.downCardInfoNode.getComponentInChildren(cc.Label);
        this.downCardInfoNode.removeFromParent();

        if(this.data.isItMe){
            this.showInfoCardList = this.cardList
        }else{
            this.downCardAnchorNodes.forEach((node, index) => {
                if (index == this.anchorIndex) {
                    this.downCardLists = (node && node.getComponentsInChildren('CardList')) || [];

                    if(this.downCardLists.length == 1){
                        this.showInfoCardList = this.downCardLists[0]
                    }else if(this.downCardLists.length == 2){
                        this.showInfoCardList = this.downCardLists[1]
                    }
                } else {
                    CCUtils.setVisible(node, false);
                }
            })
        }

        if(this.showInfoCardList){
            this.showInfoCardList.node.parent && this.showInfoCardList.node.parent.addChild(this.downCardInfoNode);
            this.downCardInfoNode.setPosition(0, 0);
        }

        this._changeRemainCardPosition(this.anchorIndex)
    }

    _initHandCardList(cardList, isItMe, setMeCardDefaultConfig = true){
        super._initHandCardList(cardList, isItMe, false);
    }

    showDownCards(cards = []) {
        this.cardList.clear();

        if(this.downCardLists.length == 0) return;

        if(this.downCardLists.length == 1 || cards.length <= 7){
            if(this.isPositionOnRight()){
                this.showInfoCardList && this.showInfoCardList.setCards(cards.reverse())
            }else{
                this.showInfoCardList && this.showInfoCardList.setCards(cards)
            }
        }else{
            let cardPerList = parseInt(cards.length / 2);
            let cardArr1 = cards.slice(0, cardPerList);
            let cardArr2 = cards.slice(cardPerList, cards.length);

            if(this.isPositionOnRight()){
                this.downCardLists[0] && this.downCardLists[0].setCards(cardArr1.reverse());
                this.downCardLists[1] && this.downCardLists[1].setCards(cardArr2.reverse());
            }else{
                this.downCardLists[0] && this.downCardLists[0].setCards(cardArr1);
                this.downCardLists[1] && this.downCardLists[1].setCards(cardArr2);
            }
        }

        this.downCardLists.forEach((downCardList, index) => {
            downCardList && CCUtils.setVisible(downCardList, downCardList.cards.length > 0);
        })
    }


    showEndGameCardInfo(info = ""){
        if(info.length > 0 && this.showInfoCardList){
            let centerPosition = this.showInfoCardList.getCenterHorizontalPosition();
            this.downCardInfoNode.setPosition(centerPosition)
            this.downCardInfoLabel.string = info
            CCUtils.setVisible(this.downCardInfoNode);
        }
    }

    showPlayerWinLoseInfo(iconPath, isWinner = false) {
        if(iconPath){
            CCUtils.setVisible(this.specialInfoImageNode)
            RubUtils.getSpriteFrameFromAtlas('blueTheme/atlas/text-ingame', iconPath, (sprite) => {
                if(sprite){
                    this.specialInfoImageNode.getComponent(cc.Sprite).spriteFrame = sprite
                }
            });
        }
    }

    clearCards(isEnding){
        !isEnding && !this.data.isItMe && super.clearCards(isEnding);
    }
}

app.createComponent(PlayerTLMNDLRenderer);
