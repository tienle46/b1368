/**
 * Created by Thanh on 9/20/2016.
 */

import app from 'app';
import game from 'game';
import {Card} from 'game-components'
const boardState = app.const.game.board.state;

export default class GameUtils {

    static convertToLocalBoardState(state) {

        // if (data && data.hasOwnProperty(app.keywords.DEAL_CARD_LIST_KEYWORD)) {
        //     state = boardState.DEAL_CARD;
        // }

        switch (state) {
            case boardState.INITED:
                return boardState.INITED;

            case boardState.READY:
                return boardState.BEGIN;

            case boardState.DEAL_CARD:
            case boardState.BOARD_STATE_ARRANGE_CARD:
                return boardState.STARTING;

            case boardState.STARTED:
                return boardState.STARTED;

            case boardState.PLAYING:
            case boardState.TURN_BASE_TRUE_PLAY:
                return boardState.PLAYING;

            case boardState.BOARD_STATE_END:
                return boardState.ENDING;

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

        return card.rank;
    }

    static getSuit(card, gameType) {
        return card.suit;
    }
}