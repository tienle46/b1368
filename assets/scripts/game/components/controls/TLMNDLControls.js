/**
 * Created by Thanh on 9/19/2016.
 */

import app from 'app'
import GameControls from 'GameControls'

export default class TLMNDLControls extends GameControls {
    constructor() {
        super();

        this.baseControlsPrefab = {
            default: null,
            type: cc.Prefab
        }

        this.cardTurnBaseControlsPrefab = {
            default: null,
            type: cc.Prefab
        }

        this.baseControls = null;
        this.cardTurnBaseControls = null;
    }

    _init( scene){
        super._init(scene);

        this.baseControls._init(scene);
        // this.cardTurnBaseControls._init(scene);
    }

    onLoad(){
        super.onLoad();

        let baseControlsPrefab = cc.instantiate(this.baseControlsPrefab);
        let cardTurnBaseControlPrefabs = cc.instantiate(this.cardTurnBaseControlsPrefab);

        this.node.addChild(baseControlsPrefab)
        // this.node.addChild(cardTurnBaseControlPrefabs)

        this.baseControls = baseControlsPrefab.getComponent("BaseControls")
        // this.cardTurnBaseControls = cardTurnBaseControlPrefabs.getComponent("CardTurnBaseControls")
    }

    hidePlayControls(){
        this.cardTurnBaseControls.hideAllControls()
    }

    hideAllControls(){
        this.baseControls.hideAllControls();
        // this.cardTurnBaseControls.hideAllControls();
    }
}

app.createComponent(TLMNDLControls)