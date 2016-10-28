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
import TLMNUtils from 'TLMNUtils';
import Card from 'Card';
import CardList from 'CardList';

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

    _reset() {
        super._reset();
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
            this.renderer.addToDeck(cards);
        }

        /**
         * Get remain player card size
         */
        if(this.isPlaying()){
            let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER);
            let playerRemainCardSizes = utils.getValue(data, Keywords.GAME_LIST_PLAYER_CARDS_SIZE,
                playerIds && new Array(playerIds.length).fill(PlayerTLMNDL.DEFAULT_HAND_CARD_COUNT));

            playerIds && playerRemainCardSizes && playerIds.forEach((id, index) => {
                this.scene.emit(Events.ON_PLAYER_REMAIN_CARD_COUNT, id, playerRemainCardSizes[index]);
            });
        }

        /**
         * Get current player win rank. TLMNDL don't need to get player win rank
         */
    }

    onBoardEnding(data) {

        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER, []);
        let playingPlayerIds = this.scene.gamePlayers.filterPlayingPlayer(playerIds);
        let playerInfos = this.scene.gamePlayers.getBasicPlayerInfo(playerIds);

        let balanceChangeAmounts = this._getPlayerBalanceChangeAmounts(playerIds, data);
        let playerHandCards = this._getPlayerHandCards(playerIds, data);
        let {gameResultInfos, resultIconPaths} = this._getGameResultInfos(playerIds, playerHandCards, data);

        super.onBoardEnding(data);

        let models = playerIds.filter(playerId => (playingPlayerIds.indexOf(playerId) >= 0)).map(playerId => {
            return {
                name: playerInfos[playerId].name,
                balanceChanged: balanceChangeAmounts[playerId],
                iconPath: resultIconPaths[playerId],
                info: gameResultInfos[playerId],
                cards: playerHandCards[playerId]
            }
        });

        setTimeout(() => this.scene.showGameResult(models, (shownTime) => {
            let remainTime = this.timelineRemain - shownTime;
            if(remainTime > 0 && this.scene.isEnding()){
                this._startEndBoardTimeLine(remainTime);
            }
        }), 1000);
    }

    _getGameResultIconPaths(playerIds, data) {
        let thoiData = this._getThoiData(data);
        let congPlayerIds = this._getCongPlayers(data);

        let iconMaps = {};

        congPlayerIds && congPlayerIds.forEach(id => {
            iconMaps[id] = 'game/images/ingame_cong';
        });

        return iconMaps;
    }

    _getGameResultInfos(playerIds = [], playerHandCards, data) {
        let thoiData = this._getThoiData(data);
        let congPlayerIds = this._getCongPlayers(data);

        /**
         * Get game result icon
         * @type {Array}
         */
        let resultIconPaths = {};
        let winType = utils.getValue(data, Keywords.WIN_TYPE);
        let playersWinRanks = utils.getValue(data, Keywords.GAME_LIST_WIN);
        playerIds.forEach((id, i) => {
            if (playersWinRanks[i] == app.const.game.rank.GAME_RANK_FIRST) {
                switch (winType) {
                    case app.const.game.TLMN_WIN_TYPE_AN_TRANG:
                        resultIconPaths[id] = 'game/images/ingame_an_trang';
                        break;
                    case app.const.game.TLMN_WIN_TYPE_DUT_BA_BICH:
                        resultIconPaths[id] = 'game/images/ingame_dut_ba_bich';
                        break;
                    case app.const.game.TLMN_WIN_TYPE_LUNG:
                        resultIconPaths[id] = 'game/images/ingame_lung';
                        break;
                    default:
                        resultIconPaths[id] = 'game/images/ingame_thang';
                }
            } else {
                switch (winType) {
                    case app.const.game.TLMN_WIN_TYPE_THOI_BA_BICH:
                        if (GameUtils.containsCard(playerHandCards[id], Card.from(Card.RANK_BA, Card.SUIT_BICH)))
                            resultIconPaths[id] = 'game/images/ingame_thoi_ba_bich';
                        break;
                    default:
                        resultIconPaths[id] = 'game/images/ingame_thua';
                }
            }
        });

        congPlayerIds && congPlayerIds.forEach(id => resultIconPaths[id] = 'game/images/ingame_cong');

        /**
         * Get game result detail info
         * @type {Array}
         */
        let gameResultInfos = {};
        playerIds.map(id => {
            var handCard = playerHandCards[id];
            gameResultInfos[id] = handCard && handCard.length > 0 ? `${handCard.length} lá` : "";
        });

        Object.keys(thoiData).forEach(id => {
            let {types, counts} = thoiData[id];

            if (types && types.length > 0) {
                let str = `${app.res.string('game_thoi')} `;

                types.forEach((type, i) => {
                    let typeName = TLMNUtils.getTLMNThoiString(type);
                    let subfix = i < types.length - 1 ? ', ' : '';

                    str += `${counts[i]} ${typeName}${subfix}`;
                });

                gameResultInfos[id] = str + (!utils.isEmpty(gameResultInfos[id]) ? `, ${gameResultInfos[id]}` : '');
            }
        });

        return {gameResultInfos: gameResultInfos, resultIconPaths: resultIconPaths};
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
                let counts = thoiTypeCountArray.slice(thoiTypeArrayIndex, thoiTypeArrayIndex + typeCount);

                thoiData[id] = {types: types, counts: counts};

                thoiTypeArrayIndex += typeCount;
            });

        }

        return thoiData;
    }

    _getCongPlayers(data) {
        return utils.getValue(data, Keywords.CONG_PLAYER_LIST, []);
    }

}

app.createComponent(BoardTLMNDL);