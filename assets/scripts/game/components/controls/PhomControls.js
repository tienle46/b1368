/**
 * Created by Thanh on 11/3/2016.
 */

import app from 'app';
import utils from 'utils';
import GameControls from 'GameControls';
import BaseControls from 'BaseControls';
import CardTurnBaseControls from 'CardTurnBaseControls';
import Keywords from 'Keywords';
import {Events} from 'events';

export default class PhomControls extends GameControls {

    constructor() {
        super();

        this.properties = {
            ...this.properties,
            baseControlsNode: cc.Node,
            cardTurnBaseControlsNode: cc.Node,
            eatButton: cc.Button,
            takeButton: cc.Button,
            joinPhomButton: cc.Button,
            skipJoinButton: cc.Button,
            downPhomButton: cc.Button,
            skipDownButton: cc.Button,
            changePhomButton: cc.Button,
            uButton: cc.Button,
            doiUTronButton: cc.Button,
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
        this.scene.on(Events.SHOW_U_PHOM_CONTROLS, this._showUPhomControls, this);
        // this.scene.on(Events.SHOW_ON_TURN_CONTROLS, this._showOnTurnControls, this);
        this.scene.on(Events.HIDE_ALL_CONTROLS, this.hideAllControls, this);
        this.scene.on(Events.SHOW_EAT_AND_TAKE_CONTROLS, this._showEatAndTakeControls, this);
        this.scene.on(Events.SHOW_PLAY_CONTROL_ONLY, this._showPlayControl, this);
        this.scene.on(Events.SHOW_DOWN_PHOM_CONTROLS, this._showDownPhomControls, this);
        this.scene.on(Events.SHOW_JOIN_PHOM_CONTROLS, this._showJoinPhomControls, this);
        this.scene.on(Events.SET_INTERACTABLE_HA_PHOM_CONTROL, this._setInteractableHaPhomControl, this);
        this.scene.on(Events.SET_INTERACTABLE_EAT_CONTROL, this._setInteractableEatControl, this);
    }

    _setInteractableHaPhomControl(interactable){
        this.setInteractable(this.downPhomButton, interactable);
    }

    _setInteractableEatControl(interactable){
        this.setInteractable(this.eatButton, interactable);
    }

    _showUPhomControls(){
        this.hideAllControls();
        utils.active(this.uButton);
        utils.active(this.doiUTronButton);
    }

    _showDownPhomControls(hideSkip, hideChange){
        this.hideAllControls();
        utils.active(this.downPhomButton);

        if(hideSkip){
            utils.deactive(this.skipDownButton);
        }else{
            utils.active(this.skipDownButton);
        }

        if(hideChange){
            utils.deactive(this.changePhomButton);
        }else{
            utils.active(this.changePhomButton);
        }

    }

    _showJoinPhomControls(){
        this.hideAllControls();
        utils.active(this.joinPhomButton);
        utils.active(this.skipJoinButton);
    }

    _showOnTurnControls(){
        /**
         * On game phom don't handle this event
         */
    }

    _showPlayControl(){
        this.hideAllControls();
        this.cardTurnBaseControls._showOnTurnControls(true);
    }

    _onGameBegin(data, isJustJoined) {
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
        utils.deactive(this.joinPhomButton);
        utils.deactive(this.skipJoinButton);
        utils.deactive(this.downPhomButton);
        utils.deactive(this.skipDownButton);
        utils.deactive(this.changePhomButton);
        utils.deactive(this.uButton);
        utils.deactive(this.doiUTronButton);
    }

    _showWaitTurnControls(){
        this.hideAllControls();
        this.cardTurnBaseControls._showWaitTurnControls();
    }

    _showEatAndTakeControls(){
        this.hideAllControls();

        this.cardTurnBaseControls._showWaitTurnControls();
        utils.active(this.eatButton);
        utils.active(this.takeButton);

        this.setInteractable(this.eatButton, false);
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
        if (this.scene.isBegin()) {
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

    onClickJoinPhomButton(event){
        this.scene.emit(Events.ON_CLICK_JOIN_PHOM_BUTTON);
    }

    onClickSkipJoinButton(event){
        this.scene.emit(Events.ON_CLICK_SKIP_JOIN_PHOM_BUTTON);
    }

    onClickDownPhomButton(event){
        this.scene.emit(Events.ON_CLICK_DOWN_PHOM_BUTTON);
    }

    onClickSkipDownButton(event){
        this.scene.emit(Events.ON_CLICK_SKIP_DOWN_PHOM_BUTTON);
    }

    onClickChangePhomButton(event){
        this.scene.emit(Events.ON_CLICK_CHANGE_PHOM_BUTTON);
    }
}

app.createComponent(PhomControls);