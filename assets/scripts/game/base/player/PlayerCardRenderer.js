/**
 * Created by Thanh on 9/15/2016.
 */

import app from 'app'
import CardList from 'CardList'
import PlayerRenderer from 'PlayerRenderer';

export default class PlayerCardRenderer extends PlayerRenderer {
    constructor() {
        super();

        this.cardListPrefab = {
            default: null,
            type: cc.Prefab
        }

        this.myCardAnchor = {
            default: null,
            type: cc.Node
        }

        this.leftCardAnchor = {
            default: null,
            type: cc.Node
        }

        this.rightCardAnchor = {
            default: null,
            type: cc.Node
        }

        this.topCardAnchor = {
            default: null,
            type: cc.Node
        }

        this.bottomCardAnchor = {
            default: null,
            type: cc.Node
        }

        this.cardList = null;
    }

    _initUI(data){
        super._initUI();

        let cardListNode = cc.instantiate(this.cardListPrefab);
        cardListNode.setAnchorPoint(0, 0);
        // cardListNode.setPosition(this.topCardAnchor.getPosition());

        this.node.addChild(cardListNode);
        this.cardList = cardListNode.getComponent('CardList');
    }

    onLoad(){
        super.onLoad();
    }

    renderCards(cards){
        console.log("Render cards: ", cards)
        this.cardList.setCards(cards);
    }

}

app.createComponent(PlayerCardRenderer);