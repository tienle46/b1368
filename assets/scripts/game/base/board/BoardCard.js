/**
 * Created by Thanh on 8/23/2016.
 */

import { utils, GameUtils } from 'PackageUtils';
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

        // play sound
        app.system.audioManager.play(app.system.audioManager.CHIA_BAI, true);
        
        /**
         * CardList thực sự của user this.scene.gamePlayers.me.renderer.cardList.node.parent
         * this.scene.gamePlayers.me.renderer.cardList.node.parent đóng vai trò là Anchor
         * 18/04/2017: điều chỉnh vị trí của dealCardAnchor cho khớp với vị trí card list của user me
         */
        this.adjustDealCardAnchor();
        CardList.dealCards(this.renderer.dealCardActionComponent, this.renderer.dealCardAnchor, playerHandCardLists, dealCards.length, () => {
            this.scene.emit(Events.ON_GAME_STATE_STARTED);
            this.onDoneDealCards()
        });

        this.scene.emit(Events.ON_GAME_STATE_STARTING, data);
    }
    
    adjustDealCardAnchor(){
        const meCardList = this.scene.gamePlayers.me.renderer.cardList;
        
        const meAnchor = meCardList.node.parent;
        const worldPosOfMeAnchor = meAnchor.parent.convertToWorldSpaceAR(meAnchor.getPosition());
        const newPos = this.renderer.dealCardAnchor.parent.convertToNodeSpaceAR(worldPosOfMeAnchor);
        
        this.renderer.meDealCardListNode.setPosition(newPos);
        
        this.renderer.meDealCardList.setScale(meCardList.scale);
        this.renderer.meDealCardList.setMaxDimension(meCardList.maxDimension);
        this.renderer.meDealCardList.setAlign(meCardList.align);
    }

    onDoneDealCards(){
        
        this.renderer.meDealCardList.clear();
        this.meDealCards = [];
        // stop sound
        app.system.audioManager.stop(app.system.audioManager.CHIA_BAI);
    }

    _getPlayerHandCards(playerIds, data) {
        let playerHandCards = {};

        let handCardIndex = 0;
        let handCardSizes = utils.getValue(data, Keywords.GAME_LIST_PLAYER_CARDS_SIZE, []);
        let handCards =  utils.getValue(data, data[Keywords.NEW_ALL_PLAYER_CARDS] ? Keywords.NEW_ALL_PLAYER_CARDS : Keywords.GAME_LIST_CARD, []);

        // for (let i = 0; i < playerIds.length; i++) {
        //     let id = playerIds[i];
        //
        //     let playerCardCount = handCardSizes[i];
        //     let playerCardBytes = handCards.slice(handCardIndex, handCardIndex + playerCardCount);
        //     playerHandCards[id] = GameUtils.convertBytesToCards(playerCardBytes);
        //
        //     handCardIndex += playerCardCount;
        // }

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