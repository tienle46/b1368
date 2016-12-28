/**
 * Created by Thanh on 9/20/2016.
 */

import app from 'app';
import utils from 'utils';
import Card from 'Card'
import numeral from 'numeral';
import * as Keywords from "../../../core/Keywords";
const gameState = app.const.game.state;

export default class GameUtils {

    static formatBalance(balance) {
        return utils.isNumber(balance) ? numeral(balance).format((balance < 1000000 ? '0,0' : '0.00a')) : "";
    }

    static toChangedBalanceString(changeAmount) {
        return isNaN(changeAmount) ? '' : changeAmount > 0 ? `+${changeAmount}` : `${changeAmount}`;
    }

    static isPlayingState(checkState) {
        return checkState && checkState != gameState.INITED && checkState != gameState.READY && checkState != gameState.BEGIN;
    }

    static convertToLocalGameState(state) {

        // if (data && data.hasOwnProperty(app.keywords.DEAL_CARD_LIST_KEYWORD)) {
        //     state = gameState.DEAL_CARD;
        // }

        switch (state) {
            case gameState.INITED:
                return gameState.INITED;

            case gameState.READY:
                return gameState.BEGIN;

            case gameState.DEAL_CARD:
            case gameState.BOARD_STATE_ARRANGE_CARD:
                return gameState.STARTING;

            case gameState.STARTED:
                return gameState.STARTED;

            case gameState.PLAYING:
            case gameState.TURN_BASE_TRUE_PLAY:
                return gameState.PLAYING;

            case gameState.BOARD_STATE_END:
                return gameState.ENDING;

        }
    }

    static convertToBytes(cards = []) {
        return cards.map(card => card.byteValue);
    }

    static convertBytesToCards(bytes = []) {
        return bytes.map(byteValue => Card.from(byteValue));
    }

    static sortCardAsc(cards, gamePlayType, compareRankFirst) {

        for (let i = 0; i < cards.length - 1; i++) {
            let minCard = cards[i];
            let minIndex = i;

            for (let j = i + 1; j < cards.length; j++) {
                let comparedCard = cards[j];
                if (minCard.compareTo(comparedCard, gamePlayType, compareRankFirst) >= 0) {
                    minIndex = j;
                    minCard = comparedCard;
                }
            }

            if (minIndex != i) {
                let tmpCard = cards[i];
                cards[i] = cards[minIndex];
                cards[minIndex] = tmpCard;
            }
        }

        return cards;
    }

    static getRank(card, gameType) {
        if (gameType) {
            if (gameType == app.const.game.GAME_TYPE_MAU_BINH) {
                if (card.rank == Card.RANK_AT) {
                    return Card.RANK_ACE;
                }
            }

            if (gameType == app.const.game.GAME_TYPE_TIENLEN || gameType == app.const.game.GAME_TYPE_XAM) {
                if (card.rank == Card.RANK_AT) {
                    return Card.RANK_ACE;
                } else if (card.rank == Card.RANK_HAI) {
                    return Card.RANK_DEUCE;
                }
            }
        }

        return card.rank;
    }

    static getSuit(card, gameType) {
        return card.suit;
    }

    static getUserBalance(user) {
        return utils.getVariable(user, app.keywords.USER_VARIABLE_BALANCE, 0);
    }

    static getPlayerId(dataObj) {
        return utils.getValue(app.keywords.PLAYER_ID);
    }

    static isContainHeo(selectedCards) {

        let heoContained = false;

        selectedCards.some((card) => {
            if (card.isHeo()) {
                heoContained = true;
                return true;
            }
        });

        return heoContained;
    }

    static isTester(user) {
        return utils.getVariable(user, app.keywords.USER_VARIABLE_IS_TESTER, false)
    }

    static createFakeCard(length) {
        let cardBytes = new Array(length).fill(0);
        return GameUtils.convertBytesToCards(cardBytes);
    }

    static getTotalPoint(cards = []) {
        return cards.reduce((point, card) => point + card.rank, 0);
    }
}