/**
 * Created by Thanh on 9/19/2016.
 */

import utils from 'utils';
import app from 'app';
import Events from 'Events';
import GameControls from 'GameControls';
import BaseControls from 'BaseControls';
import Keywords from 'Keywords'
import CardTurnBaseControls from 'CardTurnBaseControls';

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

        this.baseControls = BaseControls;
        this.cardTurnBaseControls = CardTurnBaseControls;
    }

    _init( scene) {
        super._init(scene);
        this.baseControls && this.baseControls._init(scene);
        this.cardTurnBaseControls && this.cardTurnBaseControls._init(scene);

        this.scene.on(Events.SHOW_WAIT_TURN_CONTROLS, this._showWaitTurnControls, this);
        this.scene.on(Events.SHOW_ON_TURN_CONTROLS, this._showOnTurnControls, this);
        this.scene.on(Events.SHOW_GAME_BEGIN_CONTROLS, this._showGameBeginControls, this);

        this.scene.on(Events.ON_GAME_STATE_BEGIN, this._showGameBeginControls, this);
        this.scene.on(Events.ON_GAME_STATE_STARTING, this._onGameStarting, this);
        this.scene.on(Events.ON_GAME_STATE_STARTED, this._onGameStarted, this);
        this.scene.on(Events.ON_GAME_STATE_PLAYING, this._onGamePlaying, this);
        this.scene.on(Events.ON_GAME_STATE_ENDING, this.hideAllControls, this);
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

    _onGameStarting(){
        this.hideAllControlsBeforeGameStart();
    }

    _onGameStarted(){
        this._showWaitTurnControls();
    }

    /**
     * On game state playing if data has turn owner id => don't need to update controls
     *
     * @param data
     * @private
     */
    _onGamePlaying(data){
        
        log("_onGamePlaying")
        
        let nextTurnPlayerId = utils.getValue(data, Keywords.TURN_PLAYER_ID);
        if (!nextTurnPlayerId) {
            this._showWaitTurnControls();
        }
    }

    _showOnTurnControls(showPlayControlOnly){
        this.cardTurnBaseControls._showOnTurnControls(showPlayControlOnly);
    }

    _showWaitTurnControls(){
        this.cardTurnBaseControls._showWaitTurnControls();
    }

    _showGameBeginControls(){
        this.hideAllControls();
        if(this.scene.board.isBegin()){
            this.baseControls._showGameBeginControls();
        }
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