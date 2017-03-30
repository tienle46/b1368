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
            mePlayCardListNode: cc.Node,
        }

        this.cardList = null;
        this.selectCardChangeListener = null;
    }

    onEnable(){
        super.onEnable();

        if(this.data.isItMe && this.mePlayCardListNode){
            this.cardList = this.mePlayCardListNode.getComponent('CardList')
            this._initHandCardList(this.cardList, this.data.isItMe, true);
        }else{
            let cardListNode = cc.instantiate(this.cardListPrefab);
            this._getCardAnchorPoint(this.data.actor).addChild(cardListNode);
            this.cardList = cardListNode.getComponent('CardList');
            this._initHandCardList(this.cardList, this.data.isItMe);
        }

        this.cardList.setPosition(0, 0);
        this.cardList.setSelectCardChangeListener(this.selectCardChangeListener);
    }

    _initHandCardList(cardList, isItMe, setMeCardDefaultConfig = true){
        if (isItMe) {
            if(setMeCardDefaultConfig){
                cardList.setMaxDimension(900);
                cardList.setDraggable(true);
                cardList.setSelectable(true);
                cardList.setAlign(CardList.ALIGN_BOTTOM_LEFT);
                cardList.setReveal(true);
            }
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