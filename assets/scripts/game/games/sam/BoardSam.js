/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import game from 'game';
import {utils, GameUtils} from 'utils';
import {Keywords} from 'core';
import {Events} from 'events';
import BoardCardTurnBase from 'BoardCardTurnBase';
import PlayerSam from 'PlayerSam';
import TLMNUtils from 'TLMNUtils';
import Card from 'Card';
import BoardSamRenderer from 'BoardSamRenderer';

export default class BoardSam extends BoardCardTurnBase {

    constructor() {
        super();

        this.winRank = 0;
        this.handCardSize = PlayerSam.DEFAULT_HAND_CARD_COUNT;
    }

    onEnable() {
        /**
         * @type {BoardSamRenderer}
         */
        this.renderer = this.node.getComponent('BoardSamRenderer');
        super.onEnable();
    }

    get gameType() {
        return app.const.game.GAME_TYPE_XAM;
    }

    _reset() {
        super._reset();
        this.winRank = 0;
    }

    onGameStatePreChange(boardState, data) {
        super.onGameStatePreChange(boardState, data);

        if (boardState == app.const.game.state.STATE_BAO_XAM) {
            let duration = utils.getValue(data, app.keywords.BOARD_PHASE_DURATION);
            duration && this.startTimeLine(duration, app.res.string('game_sam_bao_sam'));
        }
    }

    _handleBoardTurnBaseTruePlay(...args){
        super._handleBoardTurnBaseTruePlay(...args);

        this.stopTimeLine();
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
        if (this.isPlaying()) {
            let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER);
            let playerRemainCardSizes = utils.getValue(data, Keywords.GAME_LIST_PLAYER_CARDS_SIZE,
                playerIds && new Array(playerIds.length).fill(PlayerSam.DEFAULT_HAND_CARD_COUNT));

            playerIds && playerRemainCardSizes && playerIds.forEach((id, index) => {
                this.scene.emit(Events.ON_PLAYER_REMAIN_CARD_COUNT, id, playerRemainCardSizes[index]);
            });
        }

        /**
         * Get bao sam player data
         */

        if (this.scene.gameState != app.const.game.state.BOARD_STATE_BAO_XAM) {
            let baoXamPlayerId = GameUtils.getPlayerId(data);
            baoXamPlayerId && this.scene.emit(Events.ON_PLAYER_BAO_XAM, baoXamPlayerId);
        } else {
            let currentBaoXamStatus = utils.getValue(data, Keywords.IS_BAO_XAM);
            let currentBaoXamPlayerIds = utils.getValue(data, Keywords.BAO_XAM_SUCCESS_PLAYER_ID);

            currentBaoXamPlayerIds && currentBaoXamStatus && currentBaoXamPlayerIds.forEach((baoXamPlayerId, i) => {
                let sentBaoXamValue = currentBaoXamStatus[i] ? 1 : 0;
                baoXamPlayerId && this.scene.emit(Events.ON_PLAYER_BAO_XAM, sentBaoXamValue, sentBaoXamValue);
            })
        }

        /**
         * get player bao 1 data
         */
        let currentBaoUPlayerIds = utils.getValue(data, Keywords.XAM_BAO_1_PLAYER_ID);
        currentBaoUPlayerIds && currentBaoUPlayerIds.forEach(playerId => this.scene.emit(Events.ON_PLAYER_BAO_1, playerId))
    }

    onBoardEnding(data) {

        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER, []);
        let playingPlayerIds = this.scene.gamePlayers.filterPlayingPlayer(playerIds);
        let playerInfos = this.scene.gamePlayers.getBasicPlayerInfo(playerIds);

        let balanceChangeAmounts = this._getPlayerBalanceChangeAmounts(playerIds, data);
        let playerHandCards = this._getPlayerHandCards(playerIds, data);
        let {resultTexts, gameResultInfos, winnerFlags} = this._getGameResultInfos(playerIds, playerHandCards, data);

        super.onBoardEnding(data);

        let models = playerIds.filter(playerId => (playingPlayerIds.indexOf(playerId) >= 0)).map(playerId => {
            return {
                name: playerInfos[playerId].name,
                balanceChanged: balanceChangeAmounts[playerId],
                isWinner: winnerFlags[playerId],
                info: gameResultInfos[playerId],
                cards: playerHandCards[playerId],
                text: resultTexts[playerId]
            }
        });

        setTimeout(() => this.scene.showGameResult(models, (shownTime) => {
            let remainTime = this.timelineRemain - shownTime;
            if (remainTime > 0 && this.scene.isEnding()) {
                this.renderer.cleanDeckCards();
                this._startEndBoardTimeLine(remainTime);
            }
        }), 500);
    }

    _getGameResultInfos(playerIds = [], playerHandCards, data) {

        let winType = utils.getValue(data, Keywords.WIN_TYPE);
        let playersWinRanks = utils.getValue(data, Keywords.GAME_LIST_WIN);
        let playersCardCounts = utils.getValue(data, Keywords.GAME_LIST_PLAYER_CARDS_SIZE);
        let denOrThangXamPlayerId = utils.getValue(data, app.keywords.PLAYER_ID);

        /**
         * Get game result icon
         * @type {Array}
         */
        let resultTexts = {};
        let winnerFlags = {};
        let gameResultInfos = {};
        playerIds.forEach((id, i) => {
            let resultText;
            if (id == denOrThangXamPlayerId) {
                switch (winType) {
                    case app.const.game.XAM_WIN_TYPE_THANG_XAM:
                        resultText = app.res.string('game_sam_thang_sam');
                        winnerFlags[id] = true;
                        break;
                    case app.const.game.XAM_WIN_TYPE_DEN_XAM:
                        resultText = app.res.string('game_sam_den_sam');
                        winnerFlags[id] = false;
                        break;
                    case app.const.game.XAM_WIN_TYPE_DEN_THOI_HEO:
                        resultText = app.res.string('game_sam_den_thoi_heo');
                        winnerFlags[id] = false;
                        break;
                    default:
                        winnerFlags[id] = false;
                }
            } else {
                if (playersWinRanks[i] == app.const.game.rank.GAME_RANK_FIRST) {
                    resultText = app.res.string('game_thang');
                    winnerFlags[id] = true;
                } else {
                    if (winType == app.const.game.GENERAL_WIN_TYPE_NORMAL) {
                        let cardCount = playersCardCounts && playersCardCounts[i];

                        if (cardCount == PlayerSam.DEFAULT_HAND_CARD_COUNT) {
                            resultText = app.res.string('game_sam_treo');
                        }
                    }

                    if (!resultText) resultText = app.res.string('game_thua');
                    winnerFlags[id] = false;
                }

                /**
                 * Get game result detail info
                 * @type {Array}
                 */

                if (!denOrThangXamPlayerId) {
                    let handCard = playerHandCards[id];
                    gameResultInfos[id] = handCard && handCard.length > 0 ? app.res.string('game_result_card_count', {count: handCard.length}) : "";
                }
            }

            resultTexts[id] = resultText;
        });

        return {resultTexts, gameResultInfos, winnerFlags};
    }
}

app.createComponent(BoardSam);