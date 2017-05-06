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

        playingPlayerIds.forEach(playerId => {
            let player = this.scene.gamePlayers.findPlayer(playerId);
            player && player.showEndGameInfo({
                name: playerInfos[playerId].name,
                balanceChanged: balanceChangeAmounts[playerId],
                text: resultTexts[playerId],
                info: gameResultInfos[playerId],
                cards: GameUtils.sortCardAscByRankFirstSuitLast(playerHandCards[playerId]),
                isWinner: winnerFlags[playerId]
            })
        })

        // let models = playerIds.filter(playerId => (playingPlayerIds.indexOf(playerId) >= 0)).map(playerId => {
        //     return {
        //         name: playerInfos[playerId].name,
        //         balanceChanged: balanceChangeAmounts[playerId],
        //         text: resultTexts[playerId],
        //         info: gameResultInfos[playerId],
        //         cards: playerHandCards[playerId],
        //         isWinner: winnerFlags[playerId]
        //     };
        // });
        //
        // setTimeout(() => this.scene.showGameResult(models, (shownTime) => {
        //     let remainTime = this.timelineRemain - shownTime;
        //     if (remainTime > 0 && this.scene.isEnding()) {
        //         this.renderer.cleanDeckCards();
        //         if(this.scene.gamePlayers.players.length > 1){
        //             this._startEndBoardTimeLine(remainTime);
        //         }
        //     }
        // }), 500);
    }

    _getGameResultInfos(playerIds = [], playerHandCards, data) {
        let thoiData = this._getThoiData(data);
        let congPlayerIds = this._getCongPlayers(data);

        /**
         * Get game result icon
         * @type {Array}
         */
        let gameResultInfos = {};
        let resultTexts = {};
        let winnerFlags = {};

        let winType = utils.getValue(data, Keywords.WIN_TYPE);
        let playersWinRanks = utils.getValue(data, Keywords.GAME_LIST_WIN);
        let cardTypes = utils.getValue(data, Keywords.CARD_TYPES, []);
        playerIds.forEach((id, i) => {
            let resultText = ''
            let cardType = cardTypes[i];

            if (playersWinRanks[i] == app.const.game.rank.GAME_RANK_FIRST) {
                switch (winType) {
                    case app.const.game.TLMN_WIN_TYPE_AN_TRANG:
                        resultText = 'tlmn-an-trang'

                        if(cardType){
                            switch(cardType){
                                case app.const.game.TLMN_CARD_TYPE_SANH_RONG_DONG_HOA:
                                    gameResultInfos[id] = app.res.string('game_tlmn_sanh_rong_dong_hoa')
                                    break;
                                case app.const.game.TLMN_CARD_TYPE_SANH_RONG:
                                    gameResultInfos[id] = app.res.string('game_tlmn_sanh_rong')
                                    break;
                                case app.const.game.TLMN_CARD_TYPE_DONG_HOA:
                                    gameResultInfos[id] = app.res.string('game_tlmn_dong_hoa')
                                    break;
                                case app.const.game.TLMN_CARD_TYPE_SAU_DOI_THONG:
                                    gameResultInfos[id] = app.res.string('game_tlmn_sau_doi_thong')
                                    break;
                                case app.const.game.TLMN_CARD_TYPE_NAM_DOI_THONG:
                                    gameResultInfos[id] = app.res.string('game_tlmn_nam_doi_thong')
                                    break;
                                case app.const.game.TLMN_CARD_TYPE_SAU_DOI:
                                    gameResultInfos[id] = app.res.string('game_tlmn_sau_doi')
                                    break;
                                case app.const.game.TLMN_CARD_TYPE_BON_NHOM_BA:
                                    gameResultInfos[id] = app.res.string('game_tlmn_sam_co')
                                    break;
                                case app.const.game.TLMN_CARD_TYPE_TU_QUY_HEO:
                                    gameResultInfos[id] = app.res.string('game_tlmn_tu_quy_hai')
                                    break;
                            }
                        }

                        !gameResultInfos[id] && (gameResultInfos[id] = app.res.string('game_tlmn_an_trang'))

                        break;
                    case app.const.game.TLMN_WIN_TYPE_DUT_BA_BICH:
                        resultText = 'tlmn-dut-ba-bich'
                        break;
                    case app.const.game.TLMN_WIN_TYPE_LUNG:
                        resultText = 'tlmn-lung'
                        break;
                    default:
                        resultText = 'thang'
                }
                winnerFlags[id] = true;
            } else {
                switch (winType) {
                    case app.const.game.TLMN_WIN_TYPE_THOI_BA_BICH:
                        // if (GameUtils.containsCard(playerHandCards[id], Card.from(Card.RANK_BA, Card.SUIT_BICH)))
                        if (ArrayUtils.contains(playerHandCards[id], Card.from(Card.RANK_BA, Card.SUIT_BICH)))
                            resultText = 'tlmn-thoi-ba-bich'
                        break;
                    default:
                        resultText = 'thua'
                }
                winnerFlags[id] = false;
            }

            resultTexts[id] = resultText;
        });

        congPlayerIds && congPlayerIds.forEach(id => resultTexts[id] = 'tlmn-cong')

        /**
         * Get game result detail info
         * @type {Array}
         */
        playerIds.map(id => {
            var handCard = playerHandCards[id];
            !gameResultInfos[id] && (gameResultInfos[id] = handCard && handCard.length > 0 ? app.res.string('game_tlmn_card_count', {count: handCard.length}) : "");
        });

        Object.keys(thoiData).forEach(id => {
            let { types, counts } = thoiData[id];

            if (types && types.length > 0) {
                let str = `${app.res.string('game_thoi')} `;

                types.forEach((type, i) => {
                    let typeName = TLMNUtils.getTLMNThoiString(type);
                    let subfix = i < types.length - 1 ? ', ' : '';
                    let count = counts[i]

                    str += count > 0 ? `${counts[i]} ${typeName}${subfix}` : `${typeName}${subfix}`;
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