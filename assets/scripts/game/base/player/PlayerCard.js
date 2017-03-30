/**
 * Created by Thanh on 8/23/2016.
 */

import {utils, GameUtils} from 'utils';
import Player from 'Player';
import Events from 'Events';
import {Keywords} from 'core';

export default class PlayerCard extends Player {
    constructor(board, user) {
        super(board, user);

        this.cards = [];
        this.remainCardCount = 0;
    }

    _addGlobalListener(){
        super._addGlobalListener();

        if(this.scene){
            this.scene.on(Events.ON_GAME_REJOIN, this._onGameRejoin, this);
            this.scene.on(Events.SHOW_PLAY_CONTROL, this._onSelectedCardsChanged, this);
        }
    }

    _removeGlobalListener(){
        super._removeGlobalListener();

        if(this.scene) {
            this.scene.off(Events.ON_GAME_REJOIN, this._onGameRejoin, this);
            this.scene.off(Events.SHOW_PLAY_CONTROL, this._onSelectedCardsChanged, this);
        }
    }

    _onGameRejoin(data){
        if(this.isPlaying()){
            if (this.isItMe()) {
                let cards = GameUtils.convertBytesToCards(utils.getValue(data, Keywords.GAME_LIST_CARD, []));
                cards.length > 0 && this.setCards(cards, true) && this.emit(Events.ON_CLICK_SORT_BUTTON);
            }
        }
    }

    setCards(cards, reveal){
        this.cards = cards;
        this.renderer.renderCards(cards, reveal);
    }

    /**
     * @returns {null|Array}
     */
    getCards(){
        return this.renderer.cardList.cards || [];
    }

    /**
     * @returns {null|CardList}
     */
    getCardList(){
        return this.renderer.cardList;
    }

    removeFakeCard(length){
        this.renderer.cardList.removeCards(length);
    }

    createFakeCards(size){
        let cardBytes = new Array(size).fill(0);
        this.setCards(GameUtils.convertBytesToCards(cardBytes), false);
    }

    onGameReset(){
        super.onGameReset();

        this.renderer.cardList.clear();
    }

    onGameBegin(data, isJustJoined){
        super.onGameBegin(data, isJustJoined)

        this.renderer.cardList.clear();
    }

    onGameStarting(data, isJustJoined){

        super.onGameStarting(data, isJustJoined);

        if(isJustJoined){
            !this.isItMe() && this.isReady() && this.createFakeCards();
        }
    }

    onGameStarted(data, isJustJoined){
        super.onGameStarted(data, isJustJoined);
        this.setMeDealCards();
    }

    setMeDealCards(){
        let dealCards = this.scene.board.meDealCards || [];
        this.isItMe() ? this.setCards(dealCards) : this.isReady() && this.createFakeCards();
    }

    getSelectedCards() {
        return this.renderer.cardList.getSelectedCards();
    }

    findCards(cardModels){
        return this.renderer.findCards(cardModels);
    }

    onGameEnding(data = {}, isJustJoined){
        super.onGameEnding(data, isJustJoined);
        this.renderer.clearCards(true);
    }

    _onSelectedCardsChanged(selectedCards){

    }

}