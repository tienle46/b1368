/**
 * Created by Thanh on 9/15/2016.
 */

import utils from 'utils';
import app from 'app';
import PlayerCardTurnBaseRenderer from 'PlayerCardTurnBaseRenderer';

export default class PlayerTLMNDLRenderer extends PlayerCardTurnBaseRenderer {
    constructor() {
        super();
    }

    _initUI(data) {

        // this.assign(this.basePlayerPrefab, 'PlayerRenderer');
        // this.assign(this.cardPlayerPrefab, 'PlayerCardRenderer');

        super._initUI(data);
        
        console.log("init ui TLMNDL")
    }
}

app.createComponent(PlayerTLMNDLRenderer);
