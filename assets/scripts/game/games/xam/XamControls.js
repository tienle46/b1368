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

export default class XamControls extends GameControls {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            baseControlsNode: cc.Node,
            cardTurnBaseControlsNode: cc.Node,
            baoXamBtn: cc.Button,
            boBaoXamBtn: cc.Button
        }

        this.baseControls = null;
        this.cardTurnBaseControls = null;
    }

    onEnable() {

        this.baseControls = this.baseControlsNode.getComponent('BaseControls');
        this.cardTurnBaseControls = this.cardTurnBaseControlsNode.getComponent('CardTurnBaseControls');

        super.onEnable();

        this.scene.on(Events.ON_GAME_STATE_BEGIN, this._onGameBegin, this);
        this.scene.on(Events.ON_GAME_STATE_STARTING, this._onGameStarting, this);
        this.scene.on(Events.ON_GAME_STATE_STARTED, this._onGameStarted, this, 0);
        this.scene.on(Events.ON_GAME_STATE_PLAYING, this._onGamePlaying, this);
        this.scene.on(Events.ON_GAME_STATE_ENDING, this._onGameEnding, this);
        this.scene.on(Events.SHOW_GAME_BEGIN_CONTROLS, this._showGameBeginControls, this);
        this.scene.on(Events.SHOW_WAIT_TURN_CONTROLS, this._showWaitTurnControls, this);
        this.scene.on(Events.SHOW_BAO_XAM_CONTROLS, this._showBaoXamControls, this);
        this.scene.on(Events.SHOW_ON_TURN_CONTROLS, this._showOnTurnControls, this);
        this.scene.on(Events.HIDE_ALL_CONTROLS, this.hideAllControls, this);
    }

    _showOnTurnControls(showPlayControlOnly) {
        this.hideAllControls();
        this.cardTurnBaseControls._showOnTurnControls(showPlayControlOnly);
    }

    _showBaoXamControls() {
        this.hideAllControls();
        utils.active(this.cardTurnBaseControls.sortButton);
        utils.active(this.baoXamBtn);
        utils.active(this.boBaoXamBtn);
    }

    _showWaitTurnControls() {
        this.hideAllControls();
        this.cardTurnBaseControls._showWaitTurnControls();
    }

    _onGameBegin(data, isJustJoined) {
        this.hideAllControls();
        this._showGameBeginControls();
    }

    _onGameStarting(data, isJustJoined) {
        this._hideGameBeginControls();
    }

    _onGameStarted(data, isJustJoined) {
        this._hideGameBeginControls();

        if (isJustJoined) {
            this._showWaitTurnControls();
        } else {
            this.scene.isStarting() && this._showWaitTurnControls();
        }
    }

    _onGamePlaying(data, isJustJoined) {

        this._hideGameBeginControls();

        let nextTurnPlayerId = utils.getValue(data, Keywords.TURN_PLAYER_ID);
        if (!nextTurnPlayerId) {
            this._showWaitTurnControls();
        } else {
            this._hideGameBeginControls();
        }

    }

    _onGameEnding(data, isJustJoined) {
        this.hideAllControls();
    }

    hideAllControls() {
        this.baseControls.hideAllControls();
        this.cardTurnBaseControls.hideAllControls();
        utils.deactive(this.baoXamBtn);
        utils.deactive(this.boBaoXamBtn);
    }

    _showGameBeginControls() {
        this.hideAllControls();
        if (this.scene.board.isBegin()) {
            this.baseControls._showGameBeginControls();
        }
    }

    _hideGameBeginControls(){
        this.baseControls.hideAllControls();
    }

    onClickBaoXamBtn(){
        this.scene.emit(Events.ON_CLICK_BAO_XAM_BUTTON);
    }

    onClickBoBaoXamBtn(){
        this.scene.emit(Events.ON_CLICK_BO_BAO_XAM_BUTTON);
    }
}

app.createComponent(XamControls);