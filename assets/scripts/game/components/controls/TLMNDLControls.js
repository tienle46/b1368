/**
 * Created by Thanh on 9/19/2016.
 */

import app from 'app';
import Events from 'Events'
import GameControls from 'GameControls';

export default class TLMNDLControls extends GameControls {
    constructor() {
        super();

        this.baseControlsPrefab = {
            default: null,
            type: cc.Prefab
        };

        this.cardTurnBaseControlsPrefab = {
            default: null,
            type: cc.Prefab
        };

        this.baseControls = null;
        this.cardTurnBaseControls = null;
    }

    _init( scene){
        super._init(scene);

        this.baseControls._init(scene);
        this.cardTurnBaseControls._init(scene);

        this._registerListener();
    }

    _registerListener(){
        this.scene.on(Events.SHOW_WAIT_TURN_CONTROLS, this._showWaitTurnControls);
        this.scene.on(Events.SHOW_ON_TURN_CONTROLS, this._showOnTurnControls);
        this.scene.on(Events.SHOW_GAME_BEGIN_CONTROLS, this._showGameBeginControls);

        console.log("_registerListener Controls");
    }

    onLoad(){
        super.onLoad();

        let baseControlsPrefab = cc.instantiate(this.baseControlsPrefab);
        let cardTurnBaseControlPrefabs = cc.instantiate(this.cardTurnBaseControlsPrefab);

        this.node.addChild(baseControlsPrefab);
        this.node.addChild(cardTurnBaseControlPrefabs);

        this.baseControls = baseControlsPrefab.getComponent("BaseControls");
        this.cardTurnBaseControls = cardTurnBaseControlPrefabs.getComponent("CardTurnBaseControls");

        this.cardTurnBaseControls.node.on('touchstart', (event) => {
            return true;
        });

    }

    _showGameBeginControls(){
        this.hideAllControls();
        super._showGameBeginControls();
    }

    hidePlayControls(){
        this.cardTurnBaseControls.hideAllControls();
    }

    hideAllControls(){
        this.baseControls.hideAllControls();
        this.cardTurnBaseControls.hideAllControls();
    }

    hideAllControlsBeforeGameStart(){
        super.hideAllControlsBeforeGameStart();

        this.baseControls.hideAllControls();
    }
}

app.createComponent(TLMNDLControls);