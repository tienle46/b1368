/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import game from 'game';
import { utils, GameUtils } from 'utils';
import { Keywords } from 'core';
import { Events } from 'events';
import BoardCardTurnBase from 'BoardCardTurnBase';
import PlayerTLMNDL from 'PlayerTLMNDL';
import TLMNUtils from 'TLMNUtils';
import Card from 'Card';
import CardList from 'CardList';
import BoardTLMNDLRenderer from 'BoardTLMNDLRenderer';
import ArrayUtils from "../../../utils/ArrayUtils";

export default class BoardTLMNDL extends BoardCardTurnBase {

    constructor() {
        super();

        this.winRank = 0;
        this.handCardSize = PlayerTLMNDL.DEFAULT_HAND_CARD_COUNT;
    }

    onEnable() {
        /**
         * @type {BoardTLMNDLRenderer}
         */
        this.renderer = this.node.getComponent('BoardTLMNDLRenderer');
        super.onEnable();
    }

    get gameType() {
        return app.const.game.GAME_TYPE_TIENLEN;
    }

    _reset() {
        super._reset();
        this.winRank = 0;
    }

    onGameStatePreChange(boardState, data) {
        super.onGameStatePreChange(boardState, data);
    }


    onBoardStarting(data, isJustJoined){
        super.onBoardStarting(data, isJustJoined)

        //TODO need to check why isJustJoined is false (undefined)
        this._loadRemainCardCount(data)
    }

    onBoardPlaying(data, isJustJoined){
        super.onBoardPlaying(data, isJustJoined)

        if(isJustJoined && this.isPlaying()) {
            this._loadRemainCardCount(data)
        }
    }

    _loadRemainCardCount(data){
        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER)
        let playerRemainCardSizes = utils.getValue(data, Keywords.GAME_LIST_PLAYER_CARDS_SIZE, []);
        if(playerIds && playerRemainCardSizes && playerIds.length == playerRemainCardSizes.length){
            playerIds.forEach((id, index) => {
                this.scene.emit(Events.ON_PLAYER_REMAIN_CARD_COUNT, id, playerRemainCardSizes[index]);
            });
        }
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
         * Get current player win rank. TLMNDL don't need to get player win rank
         */
    }

    onBoardEnding(data) {

        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER, []);
        let playingPlayerIds = this.scene.gamePlayers.filterPlayingPlayer(playerIds);
        let playerInfos = this.scene.gamePlayers.getBasicPlayerInfo(playerIds);

        let balanceChangeAmounts = this._getPlayerBalanceChangeAmounts(playerIds, data);
        let playerHandCards = this._getPlayerHandCards(playerIds, data);
        let { gameResultInfos, resultTexts, winnerFlags } = this._getGameResultInfos(playerIds, playerHandCards, data);

        super.onBoardEnding(data);

        let models = playerIds.filter(playerId => (playingPlayerIds.indexOf(playerId) >= 0)).map(playerId => {
            return {
                name: playerInfos[playerId].name,
                balanceChanged: balanceChangeAmounts[playerId],
                text: resultTexts[playerId],
                info: gameResultInfos[playerId],
                cards: playerHandCards[playerId],
                isWinner: winnerFlags[playerId]
            };
        });

        setTimeout(() => this.scene.showGameResult(models, (shownTime) => {
            let remainTime = this.timelineRemain - shownTime;
            if (remainTime > 0 && this.scene.isEnding()) {
                this.renderer.cleanDeckCards();
                if(this.scene.gamePlayers.players.length > 1){
                    this._startEndBoardTimeLine(remainTime);
                }
            }
        }), 500);
    }

    _getGameResultInfos(playerIds = [], playerHandCards, data) {
        let thoiData = this._getThoiData(data);
        let congPlayerIds = this._getCongPlayers(data);

        /**
         * Get game result icon
         * @type {Array}
         */
        let resultIconPaths = {};
        let resultTexts = {};
        let winnerFlags = {};

        let winType = utils.getValue(data, Keywords.WIN_TYPE);
        let playersWinRanks = utils.getValue(data, Keywords.GAME_LIST_WIN);
        playerIds.forEach((id, i) => {
            let resultText = ''
            if (playersWinRanks[i] == app.const.game.rank.GAME_RANK_FIRST) {
                switch (winType) {
                    case app.const.game.TLMN_WIN_TYPE_AN_TRANG:
                        resultText = app.res.string('game_tlmn_an_trang');
                        break;
                    case app.const.game.TLMN_WIN_TYPE_DUT_BA_BICH:
                        resultText = app.res.string('game_tlmn_dut_ba_bich');
                        break;
                    case app.const.game.TLMN_WIN_TYPE_LUNG:
                        resultText = app.res.string('game_tlmn_lung');
                        break;
                    default:
                        resultText = app.res.string('game_thang');
                }
                winnerFlags[id] = true;
            } else {
                switch (winType) {
                    case app.const.game.TLMN_WIN_TYPE_THOI_BA_BICH:
                        // if (GameUtils.containsCard(playerHandCards[id], Card.from(Card.RANK_BA, Card.SUIT_BICH)))
                        if (ArrayUtils.contains(playerHandCards[id], Card.from(Card.RANK_BA, Card.SUIT_BICH)))
                            resultText = app.res.string('game_tlmn_thoi_ba_bich');
                        break;
                    default:
                        resultText = app.res.string('game_thua');
                }
                winnerFlags[id] = false;
            }

            resultTexts[id] = resultText;
        });

        congPlayerIds && congPlayerIds.forEach(id => resultTexts[id] = app.res.string('game_tlmn_cong'));

        /**
         * Get game result detail info
         * @type {Array}
         */
        let gameResultInfos = {};
        playerIds.map(id => {
            var handCard = playerHandCards[id];
            gameResultInfos[id] = handCard && handCard.length > 0 ? app.res.string('game_tlmn_card_count', {count: handCard.length}) : "";
        });

        Object.keys(thoiData).forEach(id => {
            let { types, counts } = thoiData[id];

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

        return { gameResultInfos, resultTexts, winnerFlags};
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

                thoiData[id] = { types: types, counts: counts };

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