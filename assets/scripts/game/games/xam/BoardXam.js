/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import game from 'game';
import {utils, GameUtils} from 'utils';
import {Keywords} from 'core';
import {Events} from 'events';
import BoardCardTurnBase from 'BoardCardTurnBase';
import PlayerXam from 'PlayerXam';
import TLMNUtils from 'TLMNUtils';
import Card from 'Card';
import BoardXamRenderer from 'BoardXamRenderer';

export default class BoardXam extends BoardCardTurnBase {

    constructor() {
        super();

        this.winRank = 0;
        this.handCardSize = PlayerXam.DEFAULT_HAND_CARD_COUNT;
    }

    onEnable(){
        this.renderer = this.node.getComponent('BoardXamRenderer');
        super.onEnable();
    }

    get gameType() {
        return app.const.game.GAME_TYPE_XAM;
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
                playerIds && new Array(playerIds.length).fill(PlayerXam.DEFAULT_HAND_CARD_COUNT));

            playerIds && playerRemainCardSizes && playerIds.forEach((id, index) => {
                this.scene.emit(Events.ON_PLAYER_REMAIN_CARD_COUNT, id, playerRemainCardSizes[index]);
            });
        }

        /**
         * Get bao xam player data
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
                this.renderer.cleanDeckCards();
                this._startEndBoardTimeLine(remainTime);
            }
        }), 500);
    }

    _getGameResultIconPaths(playerIds, data) {
        let thoiData = this._getThoiData(data);
        let congPlayerIds = this._getTreoPlayers(data);

        let iconMaps = {};

        congPlayerIds && congPlayerIds.forEach(id => {
            iconMaps[id] = 'game/images/ingame_cong';
        });

        return iconMaps;
    }

    _getGameResultInfos(playerIds = [], playerHandCards, data) {
        let thoiData = this._getThoiData(data);
        let treoPlayerIds = this._getTreoPlayers(data);

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
                    case app.const.game.XAM_WIN_TYPE_THANG_XAM:
                        resultIconPaths[id] = 'game/images/ingame_an_trang';
                        break;
                    case app.const.game.XAM_WIN_TYPE_DEN_XAM:
                        resultIconPaths[id] = 'game/images/ingame_dut_ba_bich';
                        break;
                    case app.const.game.XAM_WIN_TYPE_DEN_THOI_HEO:
                        resultIconPaths[id] = 'game/images/ingame_lung';
                        break;
                    default:
                        resultIconPaths[id] = 'game/images/ingame_thang';
                }
            }else{
                resultIconPaths[id] = 'game/images/ingame_thua';
            }
        });

        treoPlayerIds && treoPlayerIds.forEach(id => resultIconPaths[id] = 'game/images/ingame_cong');

        /**
         * Get game result detail info
         * @type {Array}
         */
        let gameResultInfos = {};
        playerIds.map(id => {
            let handCard = playerHandCards[id];
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

    _getTreoPlayers(data) {
        return utils.getValue(data, Keywords.CONG_PLAYER_LIST, []);
    }

//     @Override
//     public void showWinLoseInfo(byte winType, byte rankType, byte rank) {
//     // show icon chien thang cho thang nhat
//     showWinDrawLoseIcon(winType, rankType, rank);
//
//     if (winType == GameWin.GENERAL_WIN_TYPE_NORMAL) {
//     if (rank != GameRank.GAME_RANK_FIRST && getHandCards().size() == getBoardXam().getDefaultHandCardsSize()) {
//     // truong hop thang thua binh thuong ma bi treo
// ((UIPlayerXam) getUIPlayer()).showTreoAvatar(true);
// }
// }
//
// showInfo(getWinLoseString(winType, GameConstant.gameRankTypes[GameContext.getInstance().getGameID()], rank), 5000);
// }
//
// @Override
// public String getWinLoseString(byte wintype, byte rankType, byte rank) {
//     String retString = "";
//
//     if (wintype == GameWin.XAM_WIN_TYPE_DEN_XAM) {
//         if (isDenXam) {
//             return GameWin.getXamSpecialString(wintype);
//         }
//     }
//
//     if (wintype == GameWin.XAM_WIN_TYPE_THANG_XAM) {
//         if (isThangXam) {
//             return GameWin.getXamSpecialString(wintype);
//         }
//     }
//
//     if (wintype == GameWin.XAM_WIN_TYPE_DEN_THOI_HEO) {
//         if (isDenThoiHeo) {
//             return GameWin.getXamSpecialString(wintype);
//         }
//     }
//
//     if (wintype == GameWin.GENERAL_WIN_TYPE_NORMAL) {
//         if (getRank() != GameRank.GAME_RANK_FIRST) {
//             if (getHandCards().size() > 0 && getHandCards().size() != getBoardXam().getDefaultHandCardsSize()) {
//                 // truong hop thang thua binh thuong ma bi thua la'
//                 return LanguageManager.getString(R.string.la, getHandCards().size());
//             }
//         }
//     }
//
//     return retString;
// }

}

app.createComponent(BoardXam);