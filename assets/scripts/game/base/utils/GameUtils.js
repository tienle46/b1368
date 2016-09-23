/**
 * Created by Thanh on 9/20/2016.
 */

import app from 'app';
import Card from 'Card'
const boardState = app.const.game.board.state;

export default class GameUtils {

    static convertToLocalBoardState(state){

        // if (data && data.hasOwnProperty(app.keywords.DEAL_CARD_LIST_KEYWORD)) {
        //     state = boardState.DEAL_CARD;
        // }

        switch (state){
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

            case boardState.TURN_BASE_TRUE_PLAY:
                return boardState.PLAYING;

        }
    }

    static convertToBytes(cards = []){
        return cards.map(card => card.byteValue);
    }

    static convertBytesToCards(bytes = []){
        return bytes.map(byteValue => Card.from(byteValue));
    }

}