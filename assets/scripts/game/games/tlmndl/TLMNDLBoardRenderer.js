/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import utils from 'utils';
import BoardRenderer from 'BoardRenderer';
import BoardCardRenderer from 'BoardCardRenderer';
import BoardCardTurnBaseRenderer from 'BoardCardTurnBaseRenderer';

export default class TLMNDLBoardRenderer extends BoardCardTurnBaseRenderer {
    constructor() {
        super();

        this.boardPrefab = {
            default: null,
            type: cc.Prefab
        };

        this.boardCardPrefab = {
            default: null,
            type: cc.Prefab
        };

        this.boardCardTurnBasePrefab = {
            default: null,
            type: cc.Prefab
        };
    }

    _initUI(data){
        this.assign(this.boardPrefab, 'BoardRenderer');
        this.assign(this.boardCardPrefab, 'BoardCardRenderer');
        this.assign(this.boardCardTurnBasePrefab, 'BoardCardTurnBaseRenderer');

        super._initUI(data)
    }

    onLoad() {
        super.onLoad();
    }

    updateDeckCard(cards) {

    }

}

app.createComponent(TLMNDLBoardRenderer);