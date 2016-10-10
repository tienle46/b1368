/**
 * Created by Thanh on 8/23/2016.
 */

import {utils, GameUtils} from 'utils';
import app from 'app';
import Board from 'Board';
import Card from 'Card';
import CardList from 'CardList';
import {Keywords} from 'core';

import {Events} from 'events';

export default class BoardCard extends Board {
    constructor() {
        super();

        this.handCardSize = 0;
    }

    _init(scene){
        super._init(scene);
    }

    onLoad() {
        super.onLoad();
    }

    handleGameStateChange(boardState, data) {
        super.handleGameStateChange(boardState, data);

        if (data && data.hasOwnProperty(app.keywords.DEAL_CARD_LIST_KEYWORD)) {
            this._dealCards(data);
        }
    }

    _dealCards(data) {
        let cardBytes = data[app.keywords.DEAL_CARD_LIST_KEYWORD] || [];
        let dealCards = cardBytes.map(cardByte => Card.from(cardByte));

        let playerHandCardLists = this.scene.gamePlayers.getPlayerHandCardLists();
        let dealCardAction = CardList.dealCards(this.renderer.dealCardList, playerHandCardLists, dealCards.length, () => {

            this.scene.gamePlayers.onDealCards(dealCards);
            this.scene.emit(Events.ON_GAME_STATE_STARTED, data);
        });

        this.scene.node.runAction(dealCardAction);

        this.scene.emit(Events.ON_GAME_STATE_STARTING, data);
    }

    _getPlayerHandCards(playerIds, data) {
        let playerHandCards = {};

        let handCardIndex = 0;
        const handCardSizes = utils.getValue(data, Keywords.GAME_LIST_PLAYER_CARDS_SIZE);
        const handCards = utils.getValue(data, Keywords.GAME_LIST_CARD);

        playerIds && handCards && handCardSizes && playerIds.forEach((id, i) => {
            let playerCardCount = handCardSizes[i];

            let playerCardBytes = handCards.slice(handCardIndex, handCardIndex + playerCardCount);
            playerHandCards[id] = GameUtils.convertBytesToCards(playerCardBytes);

            handCardIndex += playerCardCount;
        });

        return playerHandCards;
    }

}