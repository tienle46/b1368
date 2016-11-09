/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import CardList from 'CardList';
import BoardCardTurnBaseRenderer from 'BoardCardTurnBaseRenderer';

export default class BoardPhomRenderer extends BoardCardTurnBaseRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            playedCardListAnchor: {
                default: [],
                type: [cc.Node]
            },
            mePlayedCardListAnchor: cc.Node,
            meDownPhomListAnchor: cc.Node,
        }
    }

    onLoad(){
        super.onLoad();
    }

    onEnable(){
        super.onEnable();
        this._initCenterDeckCard();
    }

    getPlayerPlayedCardAnchor(anchorIndex){
        return anchorIndex > 0 && this.playedCardListAnchor[anchorIndex];
    }
}

app.createComponent(BoardPhomRenderer);