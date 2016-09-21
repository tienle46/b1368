/**
 * Created by Thanh on 9/20/2016.
 */

import app from 'app';
const boardState = app.const.game.board.state;

export default class GameUtils {

    static convertToLocalBoardState(serverState){
        switch (serverState){
            case boardState.INITED:
                return boardState.INITED;

            case boardState.READY:
                return boardState.BEGIN;

            case boardState.DEAL_CARD:
                return boardState.STARTING;

            case boardState.STARTED:
                return boardState.STARTED;

            case boardState.TURN_BASE_TRUE_PLAY:
                return boardState.PLAYING;

            case boardState.TURN_BASE_TRUE_PLAY:
                return boardState.PLAYING;

        }
    }

}