/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import game from 'game';
import {utils, GameUtils} from 'utils';
import {Keywords} from 'core';
import {Events} from 'events';
import BoardCardTurnBase from 'BoardCardTurnBase';
import PlayerPhom from 'PlayerPhom';
import TLMNUtils from 'TLMNUtils';
import Card from 'Card';
import CardList from 'CardList';
import BoardPhomRenderer from 'BoardPhomRenderer';
import PhomList from 'PhomList';
import Phom from 'Phom';

export default class BoardPhom extends BoardCardTurnBase {

    constructor() {
        super();

        this.winRank = 0;
        this.handCardSize = PlayerPhom.DEFAULT_HAND_CARD_COUNT;
        this.lastPlayedCard = null;
        this.downPhomList = null;
    }

    onLoad() {
        super.onLoad();
        this.downPhomList = new PhomList();
    }

    onEnable() {
        this.renderer = this.node.getComponent(BoardPhomRenderer.name);
        super.onEnable();
    }

    get gameType() {
        return app.const.game.GAME_TYPE_PHOM;
    }

    _reset() {
        super._reset();
        this.winRank = 0;
        this.downPhomList.clear();
    }

    _onPlayerPlayedCards(playedCards, srcCardList, isItMe){
        //DO nothing, thic event will be handle on player instead
    }

    _getPlayerHandCardLists() {
        let handCards = super._getPlayerHandCardLists();
        handCards.length > 0 && handCards[0].setMaxCard(PlayerPhom.DEFAULT_HAND_CARD_COUNT + 1);
    }

    _loadGamePlayData(data) {
        super._loadGamePlayData(data);

        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER);
        if (utils.isEmpty(playerIds)) return;

        let currentBoardPhomsSize = utils.getValue(data, Keywords.GAME_PHOM_PHOM_SIZE);
        let currentBoardPhomsCards = utils.getValue(data, Keywords.GAME_PHOM_PHOM_CARDS);
        let currentBoardPlayedCardSize = utils.getValue(data, Keywords.GAME_PHOM_PLAYED_CARD_SIZE);
        let currentBoardPlayedCards = utils.getValue(data, Keywords.GAME_PHOM_PLAYED_CARDS);
        let currentNumberOfPhomByPlayerId = utils.getValue(data, Keywords.GAME_PHOM_PHOM_PLAYER_ID);
        let currentBoardEatenCards = utils.getValue(data, Keywords.GAME_PHOM_EATEN_CARDS);
        let currentBoardEatenCardSize = utils.getValue(data, Keywords.GAME_PHOM_EATEN_CARD_SIZE);
        let currentBoardEatenPlayers = utils.getValue(data, Keywords.GAME_PHOM_EATEN_PLAYERS);

        if (!utils.isEmptyArray(currentBoardPlayedCardSize)) {
            let generalPlayedCardIndex = 0;

            playerIds && playerIds.forEach((playerId, i) => {
                let player = this.scene.gamePlayers.findPlayer(playerId);
                if (player) {
                    //Set played cards
                    let cards = currentBoardPlayedCards.slice(generalPlayedCardIndex, generalPlayedCardIndex + currentBoardPlayedCardSize[i]);
                    player.setPlayedCards(cards);
                    generalPlayedCardIndex += currentBoardPlayedCardSize[i];
                }
            });
        }

        if (!utils.isEmptyArray(currentBoardPhomsSize)) {
            let allPhomList = new PhomList();
            let phomListCardIndex = 0;

            currentBoardPhomsCards && currentBoardPhomsCards.forEach((phomSize, i) => {
                let phomCards = currentBoardPhomsCards.slice(phomListCardIndex, phomListCardIndex + phomSize);
                let phom = new Phom(GameUtils.convertToBytes(phomCards));
                allPhomList.add(phom);
                phomListCardIndex += phomSize;
            });

            let phomPlayerCount = 0;
            playerIds && playerIds.forEach((playerId, i) => {

                let player = this.scene.gamePlayers.findPlayer(playerId);
                if (player) {

                    let phomCount = currentNumberOfPhomByPlayerId[i];
                    for (let j = 0; j < phomCount; j++) {

                        let phom = allPhomList.getPhomAt(j + phomPlayerCount);
                        let processingPhom = pl.downPhomList.getPhomAt(j);

                        processingPhom.setCards(phom);
                        processingPhom.setOwner(pl.id);

                        this.downPhomList.add(processingPhom);

                    }

                    phomPlayerCount += phomCount;
                }
            });
        }

        if (!utils.isEmptyArray(currentBoardEatenPlayers)) {
            let eatenCardsIndex = 0;
            currentBoardEatenPlayers.forEach((eatenId, i) => {

                let cardSize = currentBoardEatenCardSize[i];
                let player = this.scene.gamePlayers.findPlayer(eatenId);

                if (pl != null) {
                    let eatenCardBytes = currentBoardEatenCards.slice(eatenCardsIndex, eatenCardsIndex + cardSize);
                    player.setEatenCards(GameUtils.convertBytesToCards(eatenCardBytes));
                }

                eatenCardsIndex += cardSize;
            });
        }

        if (this.scene.isPlaying()) {
            this._setDeckFakeCard();
        }

        let lastPlayedTurn = utils.getValue(data, Keywords.LAST_MOVE_PLAYER_ID);
        if(lastPlayedTurn){
            let playedPlayer = this.scene.gamePlayers.findPlayer(lastPlayedTurn);
            playedPlayer && playedPlayer.playedCards.length > 0 && (this.lastPlayedCard = playedPlayer.playedCards[playedPlayer.playedCards.length - 1]);
        }
    }

    _setDeckFakeCard(){
        if (this.getTotalPlayedCardsSize() < 16) {
            this.renderer.deckCards.fillFakeCards();
        } else {
            this.renderer.cleanDeckCards();
        }
    }

    getTotalPlayedCardsSize() {
        return this.scene.gamePlayers.players.reduce((pre, player) => {
            return total += pl.playedCards.size();
        }, 0);
    }

    onBoardPlaying(data, isJustJoined){
        super.onBoardPlaying();

        if(isJustJoined && this.scene.gameState == game.state.PLAY_FAKED) {
            this._setDeckFakeCard();
        }
    }

    onBoardEnding(data) {
        super.onBoardEnding(data);
        //
        // let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER, []);
        // let playingPlayerIds = this.scene.gamePlayers.filterPlayingPlayer(playerIds);
        // let playerInfos = this.scene.gamePlayers.getBasicPlayerInfo(playerIds);
        //
        // let balanceChangeAmounts = this._getPlayerBalanceChangeAmounts(playerIds, data);
        // let playerHandCards = this._getPlayerHandCards(playerIds, data);
        // let {gameResultInfos, resultIconPaths} = this._getGameResultInfos(playerIds, playerHandCards, data);
        //
        // super.onBoardEnding(data);
        //
        // let models = playerIds.filter(playerId => (playingPlayerIds.indexOf(playerId) >= 0)).map(playerId => {
        //     return {
        //         name: playerInfos[playerId].name,
        //         balanceChanged: balanceChangeAmounts[playerId],
        //         iconPath: resultIconPaths[playerId],
        //         info: gameResultInfos[playerId],
        //         cards: playerHandCards[playerId]
        //     }
        // });
        //
        // setTimeout(() => this.scene.showGameResult(models, (shownTime) => {
        //     let remainTime = this.timelineRemain - shownTime;
        //     if (remainTime > 0 && this.scene.isEnding()) {
        //         this.renderer.cleanDeckCards();
        //         this._startEndBoardTimeLine(remainTime);
        //     }
        // }), 500);
    }

    // _getGameResultIconPaths(playerIds, data) {
    //     let thoiData = this._getThoiData(data);
    //     let congPlayerIds = this._getCongPlayers(data);
    //
    //     let iconMaps = {};
    //
    //     congPlayerIds && congPlayerIds.forEach(id => {
    //         iconMaps[id] = 'game/images/ingame_cong';
    //     });
    //
    //     return iconMaps;
    // }
    //
    // _getGameResultInfos(playerIds = [], playerHandCards, data) {
    //     let thoiData = this._getThoiData(data);
    //     let congPlayerIds = this._getCongPlayers(data);
    //
    //     /**
    //      * Get game result icon
    //      * @type {Array}
    //      */
    //     let resultIconPaths = {};
    //     let winType = utils.getValue(data, Keywords.WIN_TYPE);
    //     let playersWinRanks = utils.getValue(data, Keywords.GAME_LIST_WIN);
    //     playerIds.forEach((id, i) => {
    //         if (playersWinRanks[i] == app.const.game.rank.GAME_RANK_FIRST) {
    //             switch (winType) {
    //                 case app.const.game.TLMN_WIN_TYPE_AN_TRANG:
    //                     resultIconPaths[id] = 'game/images/ingame_an_trang';
    //                     break;
    //                 case app.const.game.TLMN_WIN_TYPE_DUT_BA_BICH:
    //                     resultIconPaths[id] = 'game/images/ingame_dut_ba_bich';
    //                     break;
    //                 case app.const.game.TLMN_WIN_TYPE_LUNG:
    //                     resultIconPaths[id] = 'game/images/ingame_lung';
    //                     break;
    //                 default:
    //                     resultIconPaths[id] = 'game/images/ingame_thang';
    //             }
    //         } else {
    //             switch (winType) {
    //                 case app.const.game.TLMN_WIN_TYPE_THOI_BA_BICH:
    //                     if (GameUtils.containsCard(playerHandCards[id], Card.from(Card.RANK_BA, Card.SUIT_BICH)))
    //                         resultIconPaths[id] = 'game/images/ingame_thoi_ba_bich';
    //                     break;
    //                 default:
    //                     resultIconPaths[id] = 'game/images/ingame_thua';
    //             }
    //         }
    //     });
    //
    //     congPlayerIds && congPlayerIds.forEach(id => resultIconPaths[id] = 'game/images/ingame_cong');
    //
    //     /**
    //      * Get game result detail info
    //      * @type {Array}
    //      */
    //     let gameResultInfos = {};
    //     playerIds.map(id => {
    //         var handCard = playerHandCards[id];
    //         gameResultInfos[id] = handCard && handCard.length > 0 ? `${handCard.length} lá` : "";
    //     });
    //
    //     Object.keys(thoiData).forEach(id => {
    //         let {types, counts} = thoiData[id];
    //
    //         if (types && types.length > 0) {
    //             let str = `${app.res.string('game_thoi')} `;
    //
    //             types.forEach((type, i) => {
    //                 let typeName = TLMNUtils.getTLMNThoiString(type);
    //                 let subfix = i < types.length - 1 ? ', ' : '';
    //
    //                 str += `${counts[i]} ${typeName}${subfix}`;
    //             });
    //
    //             gameResultInfos[id] = str + (!utils.isEmpty(gameResultInfos[id]) ? `, ${gameResultInfos[id]}` : '');
    //         }
    //     });
    //
    //     return {gameResultInfos: gameResultInfos, resultIconPaths: resultIconPaths};
    // }
    //
    // _getThoiData(data) {
    //     let thoiData = {};
    //
    //     let thoiPlayerIds = utils.getValue(data, Keywords.THOI_PLAYER_LIST);
    //     if (thoiPlayerIds) {
    //
    //         let thoiTypeArrayIndex = 0;
    //         const thoiPlayerTypesCount = utils.getValue(data, Keywords.THOI_PLAYER_TYPES_COUNT);
    //         const thoiTypesArray = utils.getValue(data, Keywords.THOI_TYPES_ARRAY);
    //         const thoiTypeCountArray = utils.getValue(data, Keywords.THOI_TYPE_COUNT);
    //
    //         thoiPlayerIds && thoiTypesArray && thoiPlayerIds.forEach((id, index) => {
    //             let typeCount = thoiPlayerTypesCount[index];
    //
    //             let types = thoiTypesArray.slice(thoiTypeArrayIndex, thoiTypeArrayIndex + typeCount);
    //             let counts = thoiTypeCountArray.slice(thoiTypeArrayIndex, thoiTypeArrayIndex + typeCount);
    //
    //             thoiData[id] = {types: types, counts: counts};
    //
    //             thoiTypeArrayIndex += typeCount;
    //         });
    //
    //     }
    //
    //     return thoiData;
    // }
    //
    // _getCongPlayers(data) {
    //     return utils.getValue(data, Keywords.CONG_PLAYER_LIST, []);
    // }

}

app.createComponent(BoardPhom);