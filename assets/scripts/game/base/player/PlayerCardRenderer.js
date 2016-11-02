/**
 * Created by Thanh on 9/15/2016.
 */

import app from 'app';
import utils from 'utils';
import CardList from 'CardList';
import PlayerRenderer from 'PlayerRenderer';

export default class PlayerCardRenderer extends PlayerRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            cardListPrefab: cc.Prefab,
            myCardAnchor: cc.Node,
            leftCardAnchor: cc.Node,
            rightCardAnchor: cc.Node,
            topCardAnchor: cc.Node,
            bottomCardAnchor: cc.Node,
            defaultCardAnchor: cc.Node,
        }

        this.cardList = null;
        this.selectCardChangeListener = null;
    }

    onEnable(){
        super.onEnable();

        let cardListNode = cc.instantiate(this.cardListPrefab);
        this._getCardAnchorPoint(this.data.actor).addChild(cardListNode);

        let cardList = cardListNode.getComponent('CardList');
        if (this.data.isItMe) {
            cardList.setMaxDimension(800);
            cardList.setDraggable(true);
            cardList.setSelectable(true);
            cardList.setAnchorPoint(0, 0);
        } else {
            cardList.setMaxDimension(0);
            cardList.setScale(app.const.game.DECK_CARD_SCALE);
            cardList.setReveal(false);
        }

        cardList.setPosition(0, 0);
        cardList.setSelectCardChangeListener(this.selectCardChangeListener);

        this.cardList = cardList;
    }

    setSelectCardChangeListener(listener) {
        this.selectCardChangeListener = listener;
    }

    hideNotMeHandCard(isItMe) {
        !isItMe && utils.deactive(this.cardList);
    }

    _getCardAnchorPoint(player) {
        let anchorPoint = this.defaultCardAnchor;

        if (player && player.isItMe()) {
            anchorPoint = this.myCardAnchor;
        }

        return anchorPoint;
    }

    clearCards() {
        this.cardList.clear();
    }

    renderCards(cards, reveal) {
        this.cardList.setCards(cards, true, reveal);
    }

    findCards(cardModels) {
        return this.cardList.findCardComponents(cardModels);
    }
}

app.createComponent(PlayerCardRenderer);