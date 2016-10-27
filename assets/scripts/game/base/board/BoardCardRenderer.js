/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import CardList from 'CardList';
import BoardRenderer from 'BoardRenderer';

export default class BoardCardRenderer extends BoardRenderer {
    constructor() {
        super();

        this.cardListPrefab = cc.Prefab;
        this.dealCardList = null;
        this.meDealCardList = null;
    }

    _initUI(data){
        super._initUI(data);

        let dealCardListNode = cc.instantiate(this.cardListPrefab);
        this.dealCardList = dealCardListNode.getComponent(CardList.name);
        this.dealCardList.setReveal(true);
        this.dealCardList.setScale(app.const.game.DECK_CARD_SCALE);
        this.dealCardList.setMaxDimension(0);

        let meDealCardListNode = cc.instantiate(this.cardListPrefab);
        this.meDealCardList = meDealCardListNode.getComponent(CardList.name);
        this.meDealCardList.setReveal(true);
        this.meDealCardList.setScale(app.const.game.DECK_CARD_SCALE);

        meDealCardListNode.setPosition(0, -330);
        meDealCardListNode.parent = this.node;
        dealCardListNode.parent = this.node;
    }
}

app.createComponent(BoardCardRenderer)