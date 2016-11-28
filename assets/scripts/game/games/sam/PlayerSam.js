/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import game from 'game';
import Card from 'Card';
import Events from 'Events';
import GameUtils from 'GameUtils';
import SamUtils from 'SamUtils';
import PlayerCardTurnBase from 'PlayerCardTurnBase';
import utils from "../../../utils/Utils";

export default class PlayerSam extends PlayerCardTurnBase {

    static get DEFAULT_HAND_CARD_COUNT() {
        return 10
    };

    constructor(board, user) {
        super(board, user);

        this.sentBaoXamValue = -1;
        this.isDenXam = false;
        this.isThangXam = false;
        this.isDenThoiHeo = false;

        this.remainCardCount = PlayerSam.DEFAULT_HAND_CARD_COUNT;
    }

    _addGlobalListener() {
        super._addGlobalListener();

        this.board.scene.on(Events.ON_CLICK_PLAY_BUTTON, this._onPlayTurn, this);
        this.board.scene.on(Events.ON_CLICK_SKIP_TURN_BUTTON, this._onSkipTurn, this);
        this.board.scene.on(Events.ON_CLICK_SORT_BUTTON, this._onSortCards, this);
        this.board.scene.on(Events.ON_CLICK_BAO_XAM_BUTTON, this._onBaoXam, this);
        this.board.scene.on(Events.ON_CLICK_BO_BAO_XAM_BUTTON, this._onBoBaoXam, this);
        this.board.scene.on(Events.ON_PLAYER_REMAIN_CARD_COUNT, this._setRemainCardCount, this);
        this.board.scene.on(Events.HANDLE_PLAY_TURN, this._onPlayerPlayedTurn, this);
        this.board.scene.on(Events.ON_GAME_STATE, this._onGameState, this);
        this.board.scene.on(Events.ON_GAME_STATE_TRUE_PLAY, this._onGameTruePlay, this);
        this.board.scene.on(Events.ON_PLAYER_BAO_XAM, this._onPlayerBaoXam, this);
        this.board.scene.on(Events.ON_PLAYER_BAO_1, this._onPlayerBao1, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();

        this.board.scene.off(Events.ON_CLICK_PLAY_BUTTON, this._onPlayTurn);
        this.board.scene.off(Events.ON_CLICK_SKIP_TURN_BUTTON, this._onSkipTurn);
        this.board.scene.off(Events.ON_CLICK_SORT_BUTTON, this._onSortCards);
        this.board.scene.off(Events.ON_PLAYER_REMAIN_CARD_COUNT, this._setRemainCardCount);
        this.board.scene.off(Events.ON_CLICK_BAO_XAM_BUTTON, this._onBaoXam, this);
        this.board.scene.off(Events.ON_CLICK_BO_BAO_XAM_BUTTON, this._onBoBaoXam, this);
        this.board.scene.off(Events.HANDLE_PLAY_TURN, this._onPlayerPlayedTurn, this);
        this.board.scene.off(Events.ON_GAME_STATE, this._onGameState, this);
        this.board.scene.off(Events.ON_PLAYER_BAO_XAM, this._onPlayerBaoXam, this);
        this.board.scene.off(Events.ON_PLAYER_BAO_1, this._onPlayerBao1, this);
    }

    _onPlayerBao1(playerId){
        if(this.id == playerId && !this.isItMe()){
            this.renderer.showBao1();
        }
    }

    _onPlayerBaoXam(playerId, baoXamValue = true){
        if(this.id == playerId && this.isPlaying()){
            this.sentBaoXamValue = 1;
            this.renderer.showBaoXam(baoXamValue);
        }
    }

    _setRemainCardCount(id, remain = 0) {
        if (id == this.id) {
            this.setRemainCardCount(remain);
        }
    }

    setRemainCardCount(remain) {
        this.remainCardCount = remain;
        this.createFakeCards(remain);
    }

    _onBaoXam(){
        app.service.send({cmd: app.commands.PLAYER_BAO_XAM, data: {[app.keywords.IS_BAO_XAM]: true}, room: this.board.scene.room}, (data) => {
            this._handlePlayerBaoXam(data);
        });
        this.board.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);
    }

    _onBoBaoXam(){
        app.service.send({cmd: app.commands.PLAYER_BAO_XAM, data: {[app.keywords.IS_BAO_XAM]: false}, room: this.board.scene.room}, (data) => {
            this._handlePlayerBaoXam(data);
        });
        this.board.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);
    }

    _onPlayerPlayedTurn(data){
        let playerId = utils.getValue(data, app.keywords.PLAYER_ID);
        if(playerId == this.id && !this.isItMe()) {
            let isBao1 = utils.getValue(data, app.keywords.XAM_BAO_1_PLAYER_ID);
            isBao1 && this.renderer.showBao1();
        }
    }

    _handlePlayerBaoXam(data){
        this.sentBaoXamValue = utils.getValue(data, app.keywords.IS_BAO_XAM) ? 1 : 0;

        if (this.sentBaoXamValue == 1) {
            this.renderer.showBaoXam(true);
        }
    }

    _onPlayTurn() {
        if (!this.isItMe()) {
            return;
        }

        let cards = this.getSelectedCards();
        let preCards = this.getPrePlayedCards();

        if (SamUtils.checkPlayCard(cards, preCards)) {
            this.turnAdapter.playTurn(cards);
        } else {
            this.notify(app.res.string("invalid_play_card"));
        }
    }

    _onSortCards() {
        if (this.isItMe()) {
            SamUtils.sortAsc(this.renderer.cardList.cards);
            this.renderer.cardList.onCardsChanged();

            console.log("_onSortCards")
        }
    }

    createFakeCards(size = PlayerSam.DEFAULT_HAND_CARD_COUNT) {
        super.createFakeCards(size);
    }

    onEnable() {
        super.onEnable(this.getComponent('PlayerSamRenderer'));

        if (this.isItMe()) {
            this.renderer.setSelectCardChangeListener((selectedCards) => {
                let interactable = SamUtils.checkPlayCard(selectedCards, this.getPrePlayedCards(), app.const.game.GAME_TYPE_TIENLEN);
                this.scene.emit(Events.SET_INTERACTABLE_PLAY_CONTROL, interactable);
            });
        }
    }

    _onGameRejoin(data) {
        super._onGameRejoin(data);
        if (this.isPlaying() && !this.scene.isEnding() && !this.isItMe()) {
            let cards = Array(PlayerSam.DEFAULT_HAND_CARD_COUNT).fill(0).map(value => {return Card.from(value)});
            this.setCards(cards, false);
        }
    }

    _onGameState(state, data, isJustJoined){
        if(state == app.const.game.state.BOARD_STATE_BAO_XAM){
            this.board.scene.emit(Events.SHOW_BAO_XAM_CONTROLS);
        }
    }

    _onGameTruePlay(data){
        let pId = utils.getValue(data, app.keywords.BAO_XAM_SUCCESS_PLAYER_ID);
        if(pId == this.id){
            this.sentBaoXamValue = 1;
            this.renderer.showBaoXam(true);
        }else{
            this.sentBaoXamValue = -1;
            this.renderer.showBaoXam(false);
            this.board.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);
        }
    }

    onGameEnding(...args){
        super.onGameEnding(...args);
        this.renderer.showBao1(false);
        this.renderer.showBaoXam(false);
    }

    onGameReset(...args){
        super.onGameReset(...args);
        this.renderer.showBao1(false);
        this.renderer.showBaoXam(false);

    }
}

app.createComponent(PlayerSam);
