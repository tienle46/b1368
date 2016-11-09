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
import XamPlayerRenderer from 'PlayerXamRenderer';

export default class PlayerXam extends PlayerCardTurnBase {

    static get DEFAULT_HAND_CARD_COUNT() {
        return 13
    };

    constructor(board, user) {
        super(board, user);

        this.remainCardCount = PlayerXam.DEFAULT_HAND_CARD_COUNT;
    }

    _addGlobalListener() {
        super._addGlobalListener();

        this.board.scene.on(Events.ON_CLICK_PLAY_BUTTON, this._onPlayTurn, this);
        this.board.scene.on(Events.ON_CLICK_SKIP_TURN_BUTTON, this._onSkipTurn, this);
        this.board.scene.on(Events.ON_CLICK_SORT_BUTTON, this._onSortCards, this);
        this.board.scene.on(Events.ON_PLAYER_REMAIN_CARD_COUNT, this._setRemainCardCount, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();

        this.board.scene.off(Events.ON_CLICK_PLAY_BUTTON, this._onPlayTurn);
        this.board.scene.off(Events.ON_CLICK_SKIP_TURN_BUTTON, this._onSkipTurn);
        this.board.scene.off(Events.ON_CLICK_SORT_BUTTON, this._onSortCards);
        this.board.scene.off(Events.ON_PLAYER_REMAIN_CARD_COUNT, this._setRemainCardCount);
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
            let sortedCard = GameUtils.sortCardAsc(this.renderer.cardList.cards, game.const.GAME_TYPE_TIENLEN);
            this.renderer.cardList.setCards(sortedCard);
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

    createFakeCards(size = PlayerXam.DEFAULT_HAND_CARD_COUNT) {
        super.createFakeCards(size);
    }

    onEnable() {
        super.onEnable(this.getComponent(XamPlayerRenderer.name));

        if (this.isItMe()) {
            this.renderer.setSelectCardChangeListener((selectedCards) => {
                let interactable = TLMNUtils.checkPlayCard(selectedCards, this.getPrePlayedCards(), app.const.game.GAME_TYPE_TIENLEN);
                this.scene.emit(Events.SET_INTERACTABLE_PLAY_CONTROL, interactable);
            });
        }
    }

    _onGameRejoin(data) {
        super._onGameRejoin(data);
        if (this.isPlaying() && !this.scene.isEnding() && !this.isItMe()) {
            let cards = Array(PlayerXam.DEFAULT_HAND_CARD_COUNT).fill(5).map(value => {return Card.from(value)});
            this.setCards(cards, false);
        }
    }
}

app.createComponent(PlayerXam);
