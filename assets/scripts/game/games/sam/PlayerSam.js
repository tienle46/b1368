/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import game from 'game';
import Card from 'Card';
import Events from 'Events';
import ArrayUtils from 'ArrayUtils';
import SamUtils from 'SamUtils';
import PlayerCardTurnBase from 'PlayerCardTurnBase';
import utils from "../../../utils/Utils";

export default class PlayerSam extends PlayerCardTurnBase {

    constructor(board, user) {
        super(board, user);

        this.sentBaoXamValue = -1;
        this.isDenXam = false;
        this.isThangXam = false;
        this.isDenThoiHeo = false;

        this.sortSolution = SamUtils.SORT_BY_RANK;
        this.remainCardCount = PlayerSam.DEFAULT_HAND_CARD_COUNT;
    }

    _addGlobalListener() {
        super._addGlobalListener();
        
        this.scene.on(Events.ON_CLICK_PLAY_BUTTON, this._onPlayTurn, this);
        this.scene.on(Events.ON_CLICK_SKIP_TURN_BUTTON, this._onSkipTurn, this);
        this.scene.on(Events.ON_CLICK_SORT_BUTTON, this._onSortCards, this);
        this.scene.on(Events.ON_CLICK_BAO_XAM_BUTTON, this._onBaoXam, this);
        this.scene.on(Events.ON_CLICK_BO_BAO_XAM_BUTTON, this._onBoBaoXam, this);
        this.scene.on(Events.ON_PLAYER_REMAIN_CARD_COUNT, this._setRemainCardCount, this);
        this.scene.on(Events.HANDLE_PLAYER_PLAY_TURN, this._onPlayerPlayedTurn, this);
        this.scene.on(Events.ON_GAME_STATE, this._onGameState, this);
        this.scene.on(Events.ON_GAME_STATE_TRUE_PLAY, this._onGameTruePlay, this);
        this.scene.on(Events.ON_PLAYER_BAO_XAM, this._onPlayerBaoXam, this);
        this.scene.on(Events.ON_PLAYER_BAO_1, this._onPlayerBao1, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        
        this.scene.off(Events.ON_CLICK_PLAY_BUTTON, this._onPlayTurn, this);
        this.scene.off(Events.ON_CLICK_SKIP_TURN_BUTTON, this._onSkipTurn, this);
        this.scene.off(Events.ON_CLICK_SORT_BUTTON, this._onSortCards, this);
        this.scene.off(Events.ON_PLAYER_REMAIN_CARD_COUNT, this._setRemainCardCount, this);
        this.scene.off(Events.ON_CLICK_BAO_XAM_BUTTON, this._onBaoXam, this);
        this.scene.off(Events.ON_CLICK_BO_BAO_XAM_BUTTON, this._onBoBaoXam, this);
        this.scene.off(Events.HANDLE_PLAYER_PLAY_TURN, this._onPlayerPlayedTurn, this);
        this.scene.off(Events.ON_GAME_STATE_TRUE_PLAY, this._onGameTruePlay, this);
        this.scene.off(Events.ON_GAME_STATE, this._onGameState, this);
        this.scene.off(Events.ON_PLAYER_BAO_XAM, this._onPlayerBaoXam, this);
        this.scene.off(Events.ON_PLAYER_BAO_1, this._onPlayerBao1, this);
    }

    _onSkipTurn() {
        if(this.isItMe()){
            this.turnAdapter.skipTurn();
            this.renderer.cardList.cleanSelectedCard();
        }
    }

    _onPlayerPlayedCards(cards, cardList, isItMe){
        if(isItMe) {
            this.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS)
        }else{
            this.setRemainCardCount(cards ? this.remainCardCount - cards.length : this.remainCardCount)
        }
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
            this.createFakeCards(remain);
        }
    }

    setRemainCardCount(remain, visible = true) {
        this.remainCardCount = remain;
        this._updateRemainCardCount(this.remainCardCount, visible)
    }

    _onBaoXam(){
        if(this.isItMe()) {
            app.service.send({cmd: app.commands.PLAYER_BAO_XAM, data: {[app.keywords.IS_BAO_XAM]: true}, room: this.scene.room}, (data) => {
                this._handlePlayerBaoXam(data);
            });
            this.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);            
        }
    }

    _onBoBaoXam(){
        if(this.isItMe()) {
            app.service.send({cmd: app.commands.PLAYER_BAO_XAM, data: {[app.keywords.IS_BAO_XAM]: false}, room: this.scene.room}, (data) => {
                this._handlePlayerBaoXam(data);
            });
            this.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);
        }
    }

    _onPlayerPlayedTurn(playerId, data){
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
        if (!this.isItMe())  {
            return;
        }

        if(!this.turnAdapter.isTurn()){
            return;
        }

        let cards = this.getSelectedCards();
        let preCards = this.getPrePlayedCards();
        let remainCards = [...this.renderer.cardList.cards]
        ArrayUtils.removeAll(remainCards, cards);

        if(remainCards.length > 0 && remainCards.filter(card => card.rank == 2).length == remainCards.length){
            app.system.showToast(app.res.string("game_sam_cannot_play_2_at_the_end"));
        }else if (SamUtils.checkPlayCard(cards, preCards)) {
            this.turnAdapter.playTurn(cards);
        } else {
            app.system.showToast(app.res.string("invalid_play_card"));
        }
    }

    _onSortCards() {

        if (this.isItMe()) {
            let sortedCard = SamUtils.sortAsc(this.renderer.cardList.cards, this.sortSolution);
            this.renderer.cardList.onCardsChanged();

            if(this.sortSolution == SamUtils.SORT_BY_RANK){
                this.sortSolution = SamUtils.SORT_BY_RANK_SPECIAL
            }else if(this.sortSolution == SamUtils.SORT_BY_RANK_SPECIAL){
                this.sortSolution = SamUtils.SORT_BY_SUIT
            }else{
                this.sortSolution = SamUtils.SORT_BY_RANK
            }
        }
    }

    createFakeCards(size = PlayerSam.DEFAULT_HAND_CARD_COUNT) {
        super.createFakeCards(size);
    }

    onEnable() {
        super.onEnable(this.getComponent('PlayerSamRenderer'));

        // if (this.isItMe()) {
        //     this.renderer.setSelectCardChangeListener(this._onSelectedCardsChanged.bind(this));
        // }
    }

    // _onSelectedCardsChanged(selectedCards) {
    //     let interactable = SamUtils.checkPlayCard(selectedCards, this.getPrePlayedCards(), app.const.game.GAME_TYPE_TIENLEN);
    //     this.scene.emit(Events.SET_INTERACTABLE_PLAY_CONTROL, interactable);
    // }
    
    _onGameRejoin(data) {
        super._onGameRejoin(data);
        
        if (this.isPlaying() && !this.scene.isEnding() && !this.isItMe()) {
            let cards = Array(PlayerSam.DEFAULT_HAND_CARD_COUNT).fill(0).map(value => {return Card.from(value)});
            this.setCards(cards, false);
        }
    }

    _onGameState(state, data, isJustJoined){
        if(state == app.const.game.state.BOARD_STATE_BAO_XAM){
            this.scene.emit(Events.SHOW_BAO_XAM_CONTROLS);
        }
    }

    _onGameTruePlay(data){
        let pId = utils.getValue(data, app.keywords.BAO_XAM_SUCCESS_PLAYER_ID);
        if(pId == this.id){
            let samState = utils.getValue(data, app.keywords.IS_BAO_XAM);
            this.sentBaoXamValue = 1;
            this.renderer.showBaoXam(samState);
        } else {
            this.sentBaoXamValue = -1;
            this.renderer.showBaoXam(false);
            this.scene.emit(Events.SHOW_WAIT_TURN_CONTROLS);
        }
    }

    onGamePlaying(data, isJustJoined){
        super.onGamePlaying(data, isJustJoined)
        this._updateRemainCardCount(this.remainCardCount, true)
    }

    onGameEnding(data, isJustJoined){
        super.onGameEnding(data, isJustJoined)

        this.renderer.showBao1(false);
        this.renderer.showBaoXam(false);

        this.setRemainCardCount(0, false)
    }

    setMeDealCards(){
        super.setMeDealCards()

        this.setRemainCardCount(this.renderer.cardList.cards.length)
    }

    onGameReset(...args){
        super.onGameReset(...args);
        this.renderer.showBao1(false);
        this.renderer.showBaoXam(false);
        this.remainCardCount = 0;
    }

    showEndGameInfo({text = null, balanceChanged = NaN, info = "", cards = [], isWinner = false, point = 0} = {}){
        if(!this.isItMe()){
            this.renderer.showDownCards(cards, info);
        }
        
        this.playSoundBaseOnBalanceChanged(balanceChanged);  
        this.renderer.showEndGameCardInfo(info)
        this.renderer.showPlayerWinLoseInfo(text, isWinner)
        this.renderer.startPlusBalanceAnimation(balanceChanged, true)
    }

    onLoseTurn(){
        this.say(app.res.string("game_bo_luot"))
    }
}

PlayerSam.DEFAULT_HAND_CARD_COUNT = 10

app.createComponent(PlayerSam);
