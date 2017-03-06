/**
 * Created by Thanh on 8/23/2016.
 */

import { utils, GameUtils } from 'utils';
import app from 'app';
import Board from 'Board';
import Card from 'Card';
import CardList from 'CardList';
import { Keywords } from 'core';

import { Events } from 'events';

export default class BoardCard extends Board {
    constructor() {
        super();

        this.handCardSize = 0;
        this.meDealCards = null;
    }

    onGameStatePreChange(boardState, data) {
        super.onGameStatePreChange(boardState, data);

        if (data && data.hasOwnProperty(app.keywords.DEAL_CARD_LIST_KEYWORD)) {
            this._dealCards(data);
        }
    }

    _dealCards(data) {
        let cardBytes = data[app.keywords.DEAL_CARD_LIST_KEYWORD] || [];
        let dealCards = cardBytes.map(cardByte => Card.from(cardByte));
        let playerHandCardLists = this.scene.gamePlayers.getPlayerHandCardLists();
        playerHandCardLists.splice(0, 0, this.renderer.meDealCardList);
        this.onDealCard(playerHandCardLists, dealCards, data);
    }

    onDealCard(playerHandCardLists, dealCards, data) {
        this.meDealCards = [...dealCards]

        CardList.dealCards(this.renderer.dealCardActionComponent, this.renderer.dealCardAnchor, playerHandCardLists, dealCards.length, () => {
            this.scene.emit(Events.ON_GAME_STATE_STARTED);
            this.onDoneDealCards()
        });

        this.scene.emit(Events.ON_GAME_STATE_STARTING, data);
    }

    onDoneDealCards(){
        this.renderer.meDealCardList.clear();
        this.meDealCards = [];
    }

    _getPlayerHandCards(playerIds, data) {
        let playerHandCards = {};

        let handCardIndex = 0;
        let handCardSizes = utils.getValue(data, Keywords.GAME_LIST_PLAYER_CARDS_SIZE, []);
        let handCards = utils.getValue(data, Keywords.GAME_LIST_CARD, []);

        playerIds.forEach((id, i) => {
            let playerCardCount = handCardSizes[i];

            let playerCardBytes = handCards.slice(handCardIndex, handCardIndex + playerCardCount);
            playerHandCards[id] = GameUtils.convertBytesToCards(playerCardBytes);

            handCardIndex += playerCardCount;
        });

        return playerHandCards;
    }

    onBoardEnding(data = {}, isJustJoined) {
        super.onBoardEnding(data, isJustJoined);

        this.renderer.clearMeDealCards && this.renderer.clearMeDealCards();
    }
}