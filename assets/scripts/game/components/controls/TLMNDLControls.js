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

        this.properties = {
            ...this.properties,
            baseControlsNode: cc.Node,
            cardTurnBaseControlsNode: cc.Node
        }

        this.baseControls = null;
        this.cardTurnBaseControls = null;
    }

    onEnable() {
        super.onEnable();

        this.scene = app.system.currentScene;

        this.baseControls = this.baseControlsNode.getComponent(BaseControls.name);
        this.cardTurnBaseControls = this.cardTurnBaseControlsNode.getComponent(CardTurnBaseControls.name);
        this.cardTurnBaseControls.node.on('touchstart', (event) => true);

        this.scene.on(Events.SHOW_WAIT_TURN_CONTROLS, this._showWaitTurnControls, this);
        this.scene.on(Events.SHOW_ON_TURN_CONTROLS, this._showOnTurnControls, this);
        this.scene.on(Events.SHOW_GAME_BEGIN_CONTROLS, this._showGameBeginControls, this);
        this.scene.on(Events.ON_GAME_STATE_BEGIN, this._onGameBegin, this);
        this.scene.on(Events.ON_GAME_STATE_STARTING, this._onGameStarting, this);
        this.scene.on(Events.ON_GAME_STATE_STARTED, this._onGameStarted, this, 0);
        this.scene.on(Events.ON_GAME_STATE_PLAYING, this._onGamePlaying, this);
        this.scene.on(Events.ON_GAME_STATE_ENDING, this.hideAllControls, this);
    }

    _onGameBegin(data, isJustJoined) {
        this._showGameBeginControls();
    }

    _onGameStarting(data, isJustJoined) {
        this.hideAllControlsBeforeGameStart();
    }

    _onGameStarted(data, isJustJoined) {
        if (isJustJoined) {
            this._showWaitTurnControls();
        } else {
            this.scene.isStarting() && this._showWaitTurnControls();
        }
    }

    /**
     * On game state playing if data has turn owner id => don't need to update controls
     *
     * @param data
     * @private
     */
    _onGamePlaying(data, isJustJoined) {
        let nextTurnPlayerId = utils.getValue(data, Keywords.TURN_PLAYER_ID);
        if (!nextTurnPlayerId) {
            this._showWaitTurnControls();
        } else {
            this.hideAllControlsBeforeGameStart();
        }
    }

    _showOnTurnControls(showPlayControlOnly) {
        this.hideAllControls();
        this.cardTurnBaseControls._showOnTurnControls(showPlayControlOnly);
    }

    _showWaitTurnControls() {
        this.hideAllControls();
        this.cardTurnBaseControls._showWaitTurnControls();
    }

    _showGameBeginControls() {
        this.hideAllControls();
        if (this.scene.board.isBegin()) {
            this.baseControls._showGameBeginControls();
        }
    }

    hidePlayControls() {
        this.cardTurnBaseControls.hideAllControls();
    }

    hideAllControls() {
        this.baseControls.hideAllControls();
        this.cardTurnBaseControls.hideAllControls();
    }

    hideAllControlsBeforeGameStart() {
        super.hideAllControlsBeforeGameStart();
        this.baseControls.hideAllControls();
    }
}

app.createComponent(TLMNDLControls);