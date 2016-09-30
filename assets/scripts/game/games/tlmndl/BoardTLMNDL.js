/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import game from 'game';
import {utils, GameUtils} from 'utils';
import {Keywords} from 'core';
import {Events} from 'events';
import BoardCardTurnBase from 'BoardCardTurnBase';
import PlayerTLMNDL from 'PlayerTLMNDL';

export default class BoardTLMNDL extends BoardCardTurnBase {

    constructor() {
        super();

        this.winRank = 0;
        this.handCardSize = PlayerTLMNDL.DEFAULT_HAND_CARD_COUNT;
    }

    _init(scene) {
        super._init(scene);
    }

    onLoad() {
        super.onLoad();
    }

    get gameType() {
        return app.const.game.GAME_TYPE_TIENLEN;
    }

    _resetBoard() {
        super._resetBoard();
        this.winRank = 0;
    }

    handleGameStateChange(boardState, data) {
        super.handleGameStateChange(boardState, data);

    }

    _loadGamePlayData(data) {
        super._loadGamePlayData(data);

        /**
         * Get deck card size
         */
        let deckCardsBytes = utils.getValue(data, Keywords.GAME_LIST_PLAYED_CARDS);
        if (deckCardsBytes) {

            let cards = GameUtils.convertBytesToCards(deckCardsBytes);
            cards = GameUtils.sortCardAsc(cards, this.gameType);
            this.addToDeck(cards);

            //TODO On android need to get card group type
            //TLMNUtil.getGroupCardType(deckCardsVector, getGameType());
        }

        /**
         * Get remain player card size
         */
        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER);
        let playerRemainCardSize = utils.getValue(data, Keywords.GAME_LIST_PLAYER_CARDS_SIZE);
        playerIds && playerRemainCardSize && playerIds.forEach((id, index) => {
            this.scene.emit(Events.ON_PLAYER_REMAIN_CARD_COUNT, id, playerRemainCardSize);
        });


        /**
         * Get current player win rank. TLMNDL don't need to get player win rank
         */
    }
}

app.createComponent(BoardTLMNDL);