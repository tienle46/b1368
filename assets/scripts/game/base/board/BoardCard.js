/**
 * Created by Thanh on 8/23/2016.
 */

import Board from 'Board';
import app from 'app';

export default class BoardCard extends Board {
    constructor(room, scene) {
        super(room, scene)

        this.handCardSize = 0;
    }

    onLoad() {
        super.onLoad();
    }

    changeBoardState(boardState, data) {
        super.changeBoardState(boardState, data);

        if (data && data.hasOwnProperty(app.keywords.DEAL_CARD_LIST_KEYWORD)) {
            this._dealCards(data);
        }
    }

    _dealCards(data) {

    }
}