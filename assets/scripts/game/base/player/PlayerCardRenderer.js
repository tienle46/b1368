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

        this.cardListPrefab = {
            default: null,
            type: cc.Prefab
        };

        this.myCardAnchor = {
            default: null,
            type: cc.Node
        };

        this.leftCardAnchor = {
            default: null,
            type: cc.Node
        };

        this.rightCardAnchor = {
            default: null,
            type: cc.Node
        };

        this.topCardAnchor = {
            default: null,
            type: cc.Node
        };

        this.bottomCardAnchor = {
            default: null,
            type: cc.Node
        };

        this.defaultCardAnchor = {
            default: null,
            type: cc.Node
        };

        this.cardList = null;
    }

    _initUI(data = {}){
        super._initUI(data);

        let cardListNode = cc.instantiate(this.cardListPrefab);
        this._getCardAnchorPoint(data.actor).addChild(cardListNode);

        let cardList = cardListNode.getComponent('CardList');
        if(data.isItMe){
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

        this.cardList = cardList;
    }

    setSelectCardChangeListener(listener){
        this.cardList.setSelectCardChangeListener(listener);
    }

    hideNotMeHandCard(isItMe){
        !isItMe && utils.deactive(this.cardList);
    }

    _getCardAnchorPoint(player){
        let anchorPoint = this.defaultCardAnchor;

        if(player && player.isItMe()){
            anchorPoint = this.myCardAnchor;
        }

        return anchorPoint;
    }

    clearCards(){
        this.cardList.clear();
    }

    renderCards(cards, reveal){
        console.log("Render card: ", cards, reveal);
        this.cardList.setCards(cards, true, reveal);
    }

    findCards(cardModels){
        return this.cardList.findCardComponents(cardModels);
    }
}

app.createComponent(PlayerCardRenderer);