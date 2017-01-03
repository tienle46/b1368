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
            defaultCardAnchor2: cc.Node,
        }

        this.cardList = null;
        this.selectCardChangeListener = null;
    }

    onEnable(){
        super.onEnable();

        let cardListNode = cc.instantiate(this.cardListPrefab);
        this._getCardAnchorPoint(this.data.actor).addChild(cardListNode);

        let cardList = cardListNode.getComponent('CardList');
        this._initHandCardList(cardList, this.data.isItMe);

        cardList.setPosition(0, 0);
        cardList.setSelectCardChangeListener(this.selectCardChangeListener);

        this.cardList = cardList;
    }

    _initHandCardList(cardList, isItMe){
        if (isItMe) {
            cardList.setMaxDimension(900);
            cardList.setDraggable(true);
            cardList.setSelectable(true);
            cardList.setAlign(CardList.ALIGN_BOTTOM_RIGHT);
            cardList.setAnchorPoint(1, 0);
            cardList.setReveal(true);
        } else {
            cardList.setMaxDimension(0);
            cardList.setScale(app.const.game.DECK_CARD_SCALE);
            cardList.setAlign(CardList.ALIGN_CENTER);
            cardList.setReveal(false);
        }
    }

    setSelectCardChangeListener(listener) {
        this.selectCardChangeListener = listener;
        this.cardList && this.cardList.setSelectCardChangeListener(listener);
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