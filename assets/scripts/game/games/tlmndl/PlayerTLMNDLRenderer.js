/**
 * Created by Thanh on 9/15/2016.
 */

import utils from 'utils';
import app from 'app';
import PlayerCardTurnBaseRenderer from 'PlayerCardTurnBaseRenderer';

export default class PlayerTLMNDLRenderer extends PlayerCardTurnBaseRenderer {
    constructor() {
        super();

        this.basePlayerPrefab = {
            default: null,
            type: cc.Prefab
        };

        this.cardPlayerPrefab = {
            default: null,
            type: cc.Prefab
        };

        this.rendererClassName = this;
    }

    _initUI(data){

        this.assign(this.basePlayerPrefab, 'PlayerRenderer');
        this.assign(this.cardPlayerPrefab, 'PlayerCardRenderer');

        super._initUI(data);
    }

    onLoad(){
        super.onLoad();
    }
}

app.createComponent(PlayerTLMNDLRenderer);