/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import CardList from 'CardList';
import BoardRenderer from 'BoardRenderer';

export default class BoardCardRenderer extends BoardRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            dealCardAnchor: cc.Node,
            dealCardActionComponentNode: cc.Node,
            meDealCardListNode: cc.Node
        }

        /**
         * @type {CardList}
         */
        this.meDealCardList = null;
        this.dealCardActionComponent = null;
    }

    onLoad(){
        super.onLoad()

        this.dealCardActionComponent = this.dealCardActionComponentNode && this.dealCardActionComponentNode.getComponent('ActionComponent')
    }

    onEnable(){
        super.onEnable();
        this.meDealCardList = this.meDealCardListNode && this.meDealCardListNode.getComponent('CardList');
    }

    clearMeDealCards(){
        this.meDealCardList.clear();
    }
}

app.createComponent(BoardCardRenderer);