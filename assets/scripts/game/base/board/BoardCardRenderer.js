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
    }

    _initUI(data){
        super._initUI(data);

        let dealCardListNode = cc.instantiate(this.cardListPrefab);
        dealCardListNode.parent = this.node;
        this.dealCardList = dealCardListNode.getComponent(CardList.name);
        this.dealCardList.setReveal(true);
        this.dealCardList.setScale(0.5);
        this.dealCardList.setMaxDimension(0);
    }
}

app.createComponent(BoardCardRenderer)