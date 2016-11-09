/**
 * Created by Thanh on 11/3/2016.
 */

import app from 'app';
import utils from 'utils';
import GameControls from 'GameControls';
import BaseControls from 'BaseControls';
import CardTurnBaseControls from 'CardTurnBaseControls';
import {Events} from 'events';

export default class PhomControls extends GameControls {

    constructor() {
        super();

        this.properties = {
            ...this.properties,
            baseControlsNode: cc.Node,
            cardTurnBaseControlsNode: cc.Node,
            eatButton: cc.Button,
            takeButton: cc.Button
        }

        this.baseControls = null;
        this.cardTurnBaseControls = null;
    }

    onEnable(){
        this.baseControls = this.baseControlsNode.getComponent(BaseControls.name);
        this.cardTurnBaseControls = this.cardTurnBaseControlsNode.getComponent(CardTurnBaseControls.name);

        super.onEnable();

        this.scene.on(Events.ON_GAME_STATE_BEGIN, this._onGameBegin, this);
        this.scene.on(Events.ON_GAME_STATE_STARTING, this._onGameStarting, this);
        this.scene.on(Events.ON_GAME_STATE_STARTED, this._onGameStarted, this, 0);
        this.scene.on(Events.ON_GAME_STATE_PLAYING, this._onGamePlaying, this);
        this.scene.on(Events.ON_GAME_STATE_ENDING, this._onGameEnding, this);
        this.scene.on(Events.SHOW_GAME_BEGIN_CONTROLS, this._showGameBeginControls, this);
        this.scene.on(Events.SHOW_WAIT_TURN_CONTROLS, this._showWaitTurnControls, this);
        this.scene.on(Events.SHOW_ON_TURN_CONTROLS, this._showOnTurnControls, this);
        this.scene.on(Events.HIDE_ALL_CONTROLS, this.hideAllControls, this);
        this.scene.on(Events.SHOW_EAT_AND_TAKE_CONTROLS, this._showEatAndTakeControls, this);
    }

    _showOnTurnControls(showPlayControlOnly) {
        this.hideAllControls();
        this.cardTurnBaseControls._showOnTurnControls(showPlayControlOnly);
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

    hideAllControls(){
        this.baseControls.hideAllControls();
        this.cardTurnBaseControls.hideAllControls();

        utils.deactive(this.eatButton);
        utils.deactive(this.takeButton);
    }

    _showWaitTurnControls(){
        this.hideAllControls();
        this.cardTurnBaseControls._showWaitTurnControls();
    }

    _showEatAndTakeControls(){
        super.hideAllControls();
        utils.active(this.eatButton);
        utils.active(this.takeButton);
        utils.active(this.sortButton);
    }

    _onGamePlaying(data, isJustJoined) {
        this._hideGameBeginControls();

        let nextTurnPlayerId = utils.getValue(data, Keywords.TURN_PLAYER_ID);
        if (!nextTurnPlayerId) {
            this._showWaitTurnControls();
        }
    }

    _onGameEnding(data, isJustJoined) {
        this.hideAllControls();
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

    onClickEatButton(event){
        this.scene.emit(Events.ON_CLICK_EAT_CARD_BUTTON);
    }

    onClickTakeButton(event){
        this.scene.emit(Events.ON_CLICK_TAKE_CARD_BUTTON);
    }
}

app.createComponent(PhomControls);