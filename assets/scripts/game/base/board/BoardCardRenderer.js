/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import CardList from 'CardList';
import BoardRenderer from 'BoardRenderer';

export default class BoardCardRenderer extends BoardRenderer {
    constructor() {
        super();

        this.dealCardAnchor = cc.Node;
        this.meDealCardListNode = cc.Node;

        this.meDealCardList = null;
    }

    _initUI(data){
        super._initUI(data);

        this.meDealCardList = this.meDealCardListNode.getComponent(CardList.name);
    }
}

app.createComponent(BoardCardRenderer);