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

    onBoardEnding(data) {

        let playerNames = this.scene.gamePlayers.getPlayerNames();

        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER);

        let balanceChangeAmounts = this._getPlayerBalanceChangeAmounts(playerIds, data);
        let playerHandCards = this._getPlayerHandCards(playerIds, data);
        let gameResultInfos = this._getGameResultInfos(playerIds, data);
        let resultIconPaths = this._getGameResultIconPaths(playerIds, data);

        super.onBoardEnding(data);

        let models = Object.keys(playerNames).map(id => {
            return {
                playerName: playerNames[id],
                balanceChanged: balanceChangeAmounts[id],
                iconPath: resultIconPaths[id],
                info: gameResultInfos[id],
                cards: playerHandCards[id]
            }
        });

        this.scene.showGameResult(models);
    }

    _getGameResultIconPaths(playerIds, data){
        let thoiData = this._getThoiData(data);
        let congPlayerIds = this._getCongData(data);

        let iconMaps = {};

        congPlayerIds && congPlayerIds.forEach(id => {
            iconMaps[id] = 'game/images/ingame_bet';
        });

        return iconMaps;
    }

    _getGameResultInfos(playerIds = [], data){
        let thoiData = this._getThoiData(data);
        let congPlayerId = this._getCongData(data);

        return playerIds.map(id => 'Chưa có thông tin');
    }

    _getThoiData(data) {
        let thoiData = {};

        let thoiPlayerIds = utils.getValue(data, Keywords.THOI_PLAYER_LIST);
        if (thoiPlayerIds) {

            let thoiTypeArrayIndex = 0;
            const thoiPlayerTypesCount = utils.getValue(data, Keywords.THOI_PLAYER_TYPES_COUNT);
            const thoiTypesArray = utils.getValue(data, Keywords.THOI_TYPES_ARRAY);
            const thoiTypeCountArray = utils.getValue(data, Keywords.THOI_TYPE_COUNT);

            thoiPlayerIds && thoiTypesArray && thoiPlayerIds.forEach((id, index) => {
                let typeCount = thoiPlayerTypesCount[index];

                let types = thoiTypesArray.slice(thoiTypeArrayIndex, thoiTypeArrayIndex + typeCount);
                let counts = thoiTypeCountArray.slice(thoiTypeCountArray, thoiTypeArrayIndex, thoiTypeArrayIndex + typeCount);

                thoiData[id] = {types: types, counts: counts};

                thoiTypeArrayIndex += typeCount;
            });

        }
    }

    _getCongData(data) {
        return utils.getValue(data, Keywords.CONG_PLAYER_LIST, []);
    }

}

app.createComponent(BoardTLMNDL);