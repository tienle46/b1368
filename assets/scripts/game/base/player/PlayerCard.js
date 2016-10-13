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

        this.scene.on(Events.ON_GAME_REJOIN, this._onGameRejoin, this);
    }

    _removeGlobalListener(){
        super._removeGlobalListener();
        this.scene.off(Events.ON_GAME_REJOIN, this._onGameRejoin, this);
    }

    _onGameRejoin(data){
        if (this.isItMe() && this.isPlaying()) {
            let cards = GameUtils.convertBytesToCards(utils.getValue(data, Keywords.GAME_LIST_CARD, []));
            cards.length > 0 && this.setCards(cards, true) && this.emit(Events.ON_CLICK_SORT_BUTTON);
        }
    }

    setCards(cards, reveal){
        this.cards = cards;
        this.renderer.renderCards(cards, reveal);
    }

    _init(board, user){
        super._init(board, user);
    }

    removeFakeCard(length){
        this.renderer.cardList.removeCards(length);
    }

    createFakeCards(size){
        let cardBytes = new Array(size).fill(5);
        this.setCards(GameUtils.convertBytesToCards(cardBytes), false);
    }

    onLoad(){
        super.onLoad();
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

        if(data instanceof Array){
            this.isItMe() ? this.setCards(data) : this.isReady() && this.createFakeCards();
        }
    }

    findCards(cardModels){
        return this.renderer.findCards(cardModels);
    }

    onGameEnding(data = {}, isJustJoined){
        super.onGameEnding(data, isJustJoined);
        this.renderer.clearCards();
    }

}