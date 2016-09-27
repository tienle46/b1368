/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import utils from 'utils';
import {BoardCardTurnBaseRenderer}  from 'game-components';

export default class TLMNDLBoardRenderer extends BoardCardTurnBaseRenderer {
    constructor() {
        super();

        this.deckCardPrefab = {
            default: null,
            type: cc.Node
        };

        this.anTrangPrefab = {
            default: null,
            type: cc.Node
        };

        this.dutBaBichPrefab = {
            default: null,
            type: cc.Node
        };


        
    }

    onLoad() {
        super.onLoad();
    }

    setVisibleAnTrang(visible) {
        visible ? utils.show(this.anTrangPrefab) : utils.hide(this.anTrangPrefab);
    }

    setVisibleDutBaBich(visible) {
        visible ? utils.show(this.dutBaBichPrefab) : utils.hide(this.dutBaBichPrefab);
    }

    updateDeckCard(cards) {

    }

}

app.createComponent(TLMNDLBoardRenderer);