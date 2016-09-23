/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';
import Board from 'Board';
import Card from 'Card';

export default class BoardCard extends Board {
    constructor(room, scene) {
        super(room, scene);

        this.handCardSize = 0;
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

        this.scene.playerManager.onDealCards(dealCards);
    }

}