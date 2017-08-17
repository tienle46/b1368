/**
 * Created by Thanh on 9/19/2016.
 */

import utils from 'PackageUtils';
import app from 'app';
import Events from 'GameEvents';
import GameControls from 'GameControls';
import BaseControls from 'BaseControls';
import Keywords from 'Keywords'
import CardBetTurnControls from 'CardBetTurnControls';
import GameUtils from "../../base/utils/GameUtils";

export default class BaCayControls extends GameControls {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            baseControlsNode: cc.Node,
            cardBetTurnControlsNode: cc.Node,
            downBtn: cc.Button,
            revealAllBtn: cc.Button
        });

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

        this.baseControls.serverAutoStartGame = !(this.scene.gamePlayers.owner && GameUtils.isTester(this.scene.gamePlayers.owner.user));
    }

    _showBetControls(){
        this.hideAllControls();
        //this.scene.gamePlayers.isMeReady() && this.cardBetTurnControls.showBetControls();
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
        //this.cardBetTurnControls.hideAllControls();

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

    onClickDownBtn(){
        this.scene.emit(Events.ON_CLICK_DOWN_BUTTON);
    }

    onClickRevealBtn(){
        this.scene.emit(Events.ON_CLICK_REVEAL_BUTTON);
        this.setVisible(this.revealAllBtn, false);
        this.onClickDownBtn()
    }
}

app.createComponent(BaCayControls);