/**
 * Created by Thanh on 9/15/2016.
 */

import utils from 'utils';
import app from 'app';
import CardList from 'CardList';
import PhomListComponent from 'PhomListComponent';
import PlayerCardTurnBaseRenderer from 'PlayerCardTurnBaseRenderer';
import CCUtils from 'CCUtils';
import ArrayUtils from 'ArrayUtils'
import PhomUtils from 'PhomUtils'

export default class PlayerPhomRenderer extends PlayerCardTurnBaseRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            eatenCardListNode2: cc.Node,
            eatenCardListNode3: cc.Node,
            eatenCardListNode4: cc.Node,
            anChotNode: cc.Node,
            specialInfoImageNode: cc.Node,
            anChotAnimName: "showAnChot",
            downCardInfoNode: cc.Node,

            playedCardListNodes: {
                default: [],
                type: [cc.Node]
            },

            downCardListNodes: {
                default: [],
                type: [cc.Node]
            },

            downPhomListNodes: {
                default: [],
                type: [cc.Node]
            },
        }

        /**
         * @type {CardList}
         */
        this.playedCardList = null;
        this.eatenCardList = null;
        this.downPhomList = null;
        this.downCardList = null;
        this.downCardInfoLabel = null

        /**
         * @type {PhomListComponent}
         * @private
         */
        this._downPhomListComponent = null;
        this.animation = null;
        this._enabledPlayerPhomRenderer = false
    }

    onEnable() {
        super.onEnable();
        this.animation = this.getComponent(cc.Animation);
        this._enabledPlayerPhomRenderer = true;
        this._reloadComponentOnIndexChanged();
    }

    cleanPlayerCards() {
        this.downPhomList && this.downPhomList.clear();
        this.eatenCardList && this.eatenCardList.clear();
        this.playedCardList && this.playedCardList.clear();
        this.downCardList && this.downCardList.clear();
    }

    _reset() {
        super._reset();

        this.cardList.clear();

        this.cleanPlayerCards();
        this.downCardInfoLabel.string = "";
        CCUtils.setVisible(this.downCardInfoNode, false);
        CCUtils.setVisible(this.specialInfoImageNode, false)
    }

    setHighlightPhom(phom, highlight) {
        this._downPhomListComponent.setHighlight(phom, highlight);
    }

    downPhom(playerPhomList, player) {
        return this._downPhomListComponent.addPhomList(player, playerPhomList, player.eatenCards);
    }

    setCurrentPhom(currentPhomList, eatenCards = []) {
        this._downPhomListComponent && this._downPhomListComponent.clear();
        this._downPhomListComponent.addPhomList(null, currentPhomList, eatenCards);
    }

    cleanHighlightDownPhom() {
        this._downPhomListComponent.cleanHighlight();
    }

    _reloadComponentOnIndexChanged() {

        this.cleanPlayerCards()

        this._downPhomListComponent && this._downPhomListComponent.clear();

        this.playedCardListNodes.forEach((node, index) => {
            if (index == this.anchorIndex) {
                this.playedCardList = node.getComponent('CardList');
            } else {
                CCUtils.setVisible(node, false);
            }
        });

        this.downCardInfoLabel = this.downCardInfoNode.getComponentInChildren(cc.Label);
        this.downCardInfoNode.removeFromParent();

        this.downCardListNodes.forEach((node, index) => {
            if (index == this.anchorIndex) {
                this.downCardList = node.getComponent('CardList');
                node.parent && node.parent.addChild(this.downCardInfoNode);
                this.downCardInfoNode.setPosition(0, 0);
            } else {
                CCUtils.setVisible(node, false);
            }
        });

        this.downPhomListNodes.forEach((node, index) => {
            if (index == this.anchorIndex) {
                this._downPhomListComponent = node.getComponent('PhomListComponent');
                this.downPhomList = this._downPhomListComponent.phomList;
            } else {
                CCUtils.setVisible(false);
            }
        });

        this.eatenCardList = this._getEatenCardComponent();
    }

    start() {
        super.start();
        /**
         * In first time load player, method _reloadComponentOnIndexChanged call before this._downPhomListComponent.phomList assigned
         */

        this.downPhomList && this.downPhomList.clear();
        this.downPhomList = this._downPhomListComponent.phomList
    }

    /**
     * This method must call inner method onEnable of PlayerPhom.
     * Component PlayerPhom must added above PlayerPhomRenderer
     *
     * @param anchorIndex
     */
    updatePlayerAnchor(anchorIndex) {
        super.updatePlayerAnchor(anchorIndex);

        if (this._enabledPlayerPhomRenderer) {
            this._reloadComponentOnIndexChanged();
        }
    }

    showAnChot() {
        this.animation && this.animation.play(this.anChotAnimName);
    }

    addHelpCard(cards, srcCardList, phomIndex) {
        let helpPhom = phomIndex && this.downPhomList[phomIndex];
        if (helpPhom) {
            if (srcCardList) {
                helpPhom.transferFrom(srcCardList, cards);
            } else {
                helpPhom.addCards(cards);
            }
        }
    }

    addPlayedCard(cards, srcCardList, isItMe) {
        if (srcCardList) {
            this.playedCardList.transferFrom(srcCardList, cards);
        } else {
            this.playedCardList.addCards(cards);
        }
    }

    addEatenCard(card, srcCardList, isItMe) {
        if (srcCardList) {
            this.eatenCardList.transferFrom(srcCardList, [card]);
        } else {
            this.eatenCardList.addCards([card]);
        }
    }

    clearEatenCards() {
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
    _getEatenCardComponent() {
        let player = this.data.actor;
        let eatenCardNode = this.anchorIndex == 1 || this.anchorIndex == 4 ? this.eatenCardListNode4 : this.anchorIndex == 2 ? this.eatenCardListNode2 : this.eatenCardListNode3;
        return eatenCardNode.getComponent('CardList');
    }

    _initHandCardList(cardList, isItMe, skipSettingForMe = false) {

        super._initHandCardList(cardList, isItMe, true);

        if (isItMe) {
            // cardList.setAlign(CardList.ALIGN_BOTTOM_RIGHT);
            // cardList.setAnchorPoint(1, 0);

            let player = this.data.actor;
            cardList.setOnCardClickListener((card) => {
                player && player.isSelectSingleCard() && !card.selected && cardList.cleanSelectedCard()
            })
        }
    }

    setDownCards(cards = [], info = "") {
        if(this.downCardList){
            this.downCardList.transferFrom(this.cardList, cards);

            if(this.downCardInfoLabel && info.length > 0){
                let centerPosition = this.downCardList.getCenterHorizontalPosition();
                this.downCardInfoNode.setPosition(centerPosition);
                this.downCardInfoLabel.string = info
                CCUtils.setVisible(this.downCardInfoNode);
            }
        }
    }

    showPlayerWinLoseInfo(iconPath, isWinner = false) {
        if(iconPath){
            CCUtils.setVisible(this.specialInfoImageNode)
            //TODO change to load from atlas
            iconPath && cc.loader.loadRes(iconPath, cc.SpriteFrame, (err, sprite) => {

                if(sprite){
                    this.specialInfoImageNode.getComponent(cc.Sprite).spriteFrame = sprite
                }

            });
        }
    }

    clearCards(isEnding){
        !isEnding && super.clearCards(isEnding);
    }
}

app.createComponent(PlayerPhomRenderer);