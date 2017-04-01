/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import game from 'game';
import Card from 'Card';
import Events from 'Events';
import GameUtils from 'GameUtils';
import TLMNUtils from 'TLMNUtils';
import PlayerCardTurnBase from 'PlayerCardTurnBase';
import TLMNDLPlayerRenderer from 'PlayerTLMNDLRenderer';

export default class PlayerTLMNDL extends PlayerCardTurnBase {

    constructor(board, user) {
        super(board, user);

        this.sortSolution = TLMNUtils.SORT_BY_RANK;
        this.remainCardCount = PlayerTLMNDL.DEFAULT_HAND_CARD_COUNT;
    }

    _addGlobalListener() {
        super._addGlobalListener();

        this.scene.on(Events.ON_CLICK_PLAY_BUTTON, this._onPlayTurn, this);
        this.scene.on(Events.ON_CLICK_SKIP_TURN_BUTTON, this._onSkipTurn, this);
        this.scene.on(Events.ON_CLICK_SORT_BUTTON, this._onSortCards, this);
        this.scene.on(Events.ON_PLAYER_REMAIN_CARD_COUNT, this._setRemainCardCount, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();

        this.scene.off(Events.ON_CLICK_PLAY_BUTTON, this._onPlayTurn, this);
        this.scene.off(Events.ON_CLICK_SKIP_TURN_BUTTON, this._onSkipTurn, this);
        this.scene.off(Events.ON_CLICK_SORT_BUTTON, this._onSortCards, this);
        this.scene.off(Events.ON_PLAYER_REMAIN_CARD_COUNT, this._setRemainCardCount, this);
    }

    _onPlayerPlayedCards(cards, cardList, isItMe){
        if(!isItMe){
            this.setRemainCardCount(cards ? this.remainCardCount - cards.length : this.remainCardCount)
        }
    }

    _setRemainCardCount(id, remain = 0) {
        if (id == this.id) {
            this.setRemainCardCount(remain);
            this.createFakeCards(remain);
        }
    }

    setRemainCardCount(remain) {

        this.remainCardCount = remain;
        this._updateRemainCardCount(this.remainCardCount, true)
    }

    _onPlayTurn() {
        if (!this.isItMe()) {
            return;
        }

        let cards = this.getSelectedCards();
        let preCards = this.getPrePlayedCards();

        if (TLMNUtils.checkPlayCard(cards, preCards)) {
            this.turnAdapter.playTurn(cards);
        } else {
            this.notify(app.res.string("invalid_play_card"));
        }
    }

    _onSkipTurn() {
        this.turnAdapter.skipTurn();
    }

    _onSortCards() {

        if (this.isItMe()) {
            let sortedCard = TLMNUtils.sortAsc(this.renderer.cardList.cards, this.sortSolution);
            this.renderer.cardList.onCardsChanged();

            // this.sortSolution = this.sortSolution == TLMNUtils.SORT_BY_RANK ? TLMNUtils.SORT_BY_SUIT : TLMNUtils.SORT_BY_RANK;
        }
    }

    getSelectedCards() {
        return this.renderer.cardList.getSelectedCards();
    }

    getPrePlayedCards() {
        return this.board.playedCards;
    }

    setCards(cards, reveal) {
        super.setCards(cards, reveal);
    }

    createFakeCards(size = PlayerTLMNDL.DEFAULT_HAND_CARD_COUNT) {
        super.createFakeCards(size);
        
        console.log("create fake card: ", size)
    }

    onEnable() {
        super.onEnable(this.node.getComponent('PlayerTLMNDLRenderer'));

        if (this.isItMe()) {
            this.renderer.setSelectCardChangeListener(this._onSelectedCardsChanged.bind(this));
        }
    }

    _onSelectedCardsChanged(selectedCards) {
        let interactable = TLMNUtils.checkPlayCard(selectedCards, this.getPrePlayedCards(), app.const.game.GAME_TYPE_TIENLEN);
        this.scene.emit(Events.SET_INTERACTABLE_PLAY_CONTROL, interactable);
    }

    onGamePlaying(data, isJustJoined){
        super.onGamePlaying(data, isJustJoined)
        this._updateRemainCardCount(this.remainCardCount, true)
    }

    onGameEnding(data, isJustJoined){
        super.onGameEnding(data, isJustJoined)
        this.setRemainCardCount(0)
    }

    onGameReset(){
        super.onGameReset()
        this.remainCardCount = 0;
    }

    setMeDealCards(){
        
        super.setMeDealCards()
        this._onSortCards();
        this.setRemainCardCount(this.renderer.cardList.cards.length)
    }

    _onGameRejoin(data) {
        super._onGameRejoin(data);
        if (this.isPlaying() && !this.scene.isEnding() && !this.isItMe()) {
            let cards = Array(PlayerTLMNDL.DEFAULT_HAND_CARD_COUNT).fill(0).map(value => { return Card.from(value) });
            this.setCards(cards, false);
        }
    }

    showEndGameInfo({text = null, balanceChanged = NaN, info = "", cards = [], isWinner = false, point = 0} = {}){
        if(!this.isItMe()){
            this.renderer.showDownCards(cards, info);
        }

        this.renderer.showPlayerWinLoseInfo(text, isWinner)

        if(balanceChanged != NaN && balanceChanged != 0){
            this.renderer.startPlusBalanceAnimation(balanceChanged);
        }
    }
}

PlayerTLMNDL.DEFAULT_HAND_CARD_COUNT = 13

app.createComponent(PlayerTLMNDL);