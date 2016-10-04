/**
 * Created by Thanh on 9/15/2016.
 */

import app from 'app';
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
        this.scene = null;
    }

    _initUI(data = {}){
        super._initUI();

        let cardListNode = cc.instantiate(this.cardListPrefab);
        this._getCardAnchorPoint(data.actor).addChild(cardListNode);

        this.cardList = cardListNode.getComponent('CardList');
        this.cardList._setMaxWidth(800);
        this.cardList.setAnchorPoint(0, 0);
        this.cardList.setPosition(0, 0);
    }

    _getCardAnchorPoint(player){
        let anchorPoint = this.defaultCardAnchor;

        if(player && player.isItMe()){
            anchorPoint = this.myCardAnchor;
        }

        return anchorPoint;
    }

    onLoad(){
        super.onLoad();
    }

    clearCards(){
        this.cardList.clear();
    }

    renderCards(cards){
        this.cardList.setCards(cards);
    }

    findCards(cardModels){
        return this.cardList.findCardComponents(cardModels);
    }

}

app.createComponent(PlayerCardRenderer);