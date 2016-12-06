/**
 * Created by Thanh on 9/19/2016.
 */

import utils from 'utils';
import app from 'app';
import Events from 'Events';
import GameControls from 'GameControls';
import BaseControls from 'BaseControls';
import Keywords from 'Keywords'
import CardBetTurnControls from 'CardBetTurnControls';

export default class BaCayControls extends GameControls {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            baseControlsNode: cc.Node,
            cardBetTurnControlsNode: cc.Node,
            hucBtn: cc.Button,
            keBtn: cc.Button,
            downBtn: cc.Button,
            revealAllBtn: cc.Button
        }

        /**
         * @type {BaseControls}
         */
        this.baseControls = null;
        /**
         * @type {CardBetTurnControls}
         */
        this.cardBetTurnControls = null;
    }

    onEnable() {

        this.baseControls = this.baseControlsNode.getComponent('BaseControls');
        this.cardBetTurnControls = this.cardBetTurnControlsNode.getComponent('CardBetTurnControls');

        super.onEnable();

        this.scene.on(Events.ON_GAME_STATE_BEGIN, this._onGameBegin, this);
        this.scene.on(Events.ON_GAME_STATE_STARTING, this._onGameStarting, this);
        this.scene.on(Events.ON_GAME_STATE_STARTED, this._onGameStarted, this, 0);
        this.scene.on(Events.ON_GAME_STATE_PLAYING, this._onGamePlaying, this);
        this.scene.on(Events.ON_GAME_STATE_ENDING, this._onGameEnding, this);
        this.scene.on(Events.SHOW_GAME_BEGIN_CONTROLS, this._showGameBeginControls, this);
        this.scene.on(Events.HIDE_ALL_CONTROLS, this.hideAllControls, this);

        this.scene.on(Events.SHOW_BACAY_BET_CONTROLS, this._showBetControls, this);
        this.scene.on(Events.SHOW_DOWN_CARD_CONTROLS, this._showDownCardControls, this);
    }

    _showBetControls(showHuc, showKe){
        this.hideAllControls();
        this.cardBetTurnControls.showBetControls();
        showHuc && this.setVisible(this.hucBtn);
        showKe && this.setVisible(this.keBtn);
    }

    _showDownCardControls(show = true){
        this.hideAllControls();
        this.setVisible(this.downBtn, show);
        this.setVisible(this.revealAllBtn, show);
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
    }

    _onGamePlaying(data, isJustJoined) {
        this._hideGameBeginControls();
    }

    _onGameEnding(data, isJustJoined) {
        this.hideAllControls();
    }

    hideAllControls() {
        this.baseControls.hideAllControls();
        this.cardBetTurnControls.hideAllControls();

        this.setVisible(this.hucBtn, false);
        this.setVisible(this.keBtn, false);
        this.setVisible(this.downBtn, false);
        this.setVisible(this.revealAllBtn, false);
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

    onClickHucBtn(){
        this.scene.emit(Events.ON_CLICK_HUC_BUTTON);
    }

    onClickKeBtn(){
        this.scene.emit(Events.ON_CLICK_KE_BUTTON);
    }

    onClickDownBtn(){
        this.scene.emit(Events.ON_CLICK_DOWN_BUTTON);
    }

    onClickRevealBtn(){
        this.scene.emit(Events.ON_CLICK_REVEAL_BUTTON);
    }
}

app.createComponent(BaCayControls);