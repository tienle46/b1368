/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import game from 'game';
import { utils, GameUtils } from 'utils';
import { Keywords } from 'core';
import { Events } from 'events';
import BoardCardTurnBase from 'BoardCardTurnBase';
import PlayerPhom from 'PlayerPhom';
import Phom from 'Phom';
import PhomList from 'PhomList';
import CardList from 'CardList';
import Card from 'Card';
import ArrayUtils from "../../../utils/ArrayUtils";

export default class BoardPhom extends BoardCardTurnBase {

    constructor() {
        super();

        this.winRank = 0;
        this.handCardSize = PlayerPhom.DEFAULT_HAND_CARD_COUNT;
        this.lastPlayedCard = null;
        this.allPhomList = null;
    }

    onLoad() {
        super.onLoad();
        this.allPhomList = []; //new PhomList();
    }

    onEnable() {
        this.renderer = this.node.getComponent('BoardPhomRenderer');
        super.onEnable();
    }

    get gameType() {
        return app.const.game.GAME_TYPE_PHOM;
    }

    getAllBoardPhomList(){
        return this.allPhomList.map(phom => phom.renderComponent || phom);
    }

    _reset() {
        super._reset();
        this.winRank = 0;
        this.allPhomList.length = 0;
    }

    _onPlayerPlayedCards(playerId, playedCards, srcCardList, isItMe){
        app.system.audioManager.play(app.system.audioManager.DANH_BAI);
        playedCards && playedCards.length > 0 && (this.lastPlayedCard = playedCards[0])
        //This don't call super, this event will be handle on player instead
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
        let allEatenCards = utils.getValue(data, "eatenCards");

        if (!ArrayUtils.isEmpty(currentBoardPlayedCardSize)) {
            let generalPlayedCardIndex = 0;

            playerIds && playerIds.forEach((playerId, i) => {
                let player = this.scene.gamePlayers.findPlayer(playerId);
                let playedCardLength = currentBoardPlayedCardSize[i];

                if (player) {
                    //Set played cards
                    let cards = currentBoardPlayedCards.slice(generalPlayedCardIndex, generalPlayedCardIndex + playedCardLength);
                    player.setPlayedCards(GameUtils.convertBytesToCards(cards));
                }

                generalPlayedCardIndex += playedCardLength;
            });
        }

        if (!ArrayUtils.isEmpty(currentBoardEatenPlayers)) {
            let eatenCardsIndex = 0;
            currentBoardEatenPlayers.forEach((eatenId, i) => {

                let player = this.scene.gamePlayers.findPlayer(eatenId);
                let eatenCardLength = currentBoardEatenCardSize[i];

                if (player != null) {
                    let eatenCardBytes = currentBoardEatenCards.slice(eatenCardsIndex, eatenCardsIndex + eatenCardLength);
                    player.setEatenCards(GameUtils.convertBytesToCards(eatenCardBytes));
                }

                eatenCardsIndex += eatenCardLength;
            });
        }

        if (!ArrayUtils.isEmpty(currentBoardPhomsSize)) {
            let currentAllPhoms = [];
            let phomListCardIndex = 0;

            currentBoardPhomsSize && currentBoardPhomsSize.forEach((phomSize, i) => {
                let phomCardBytes = currentBoardPhomsCards.slice(phomListCardIndex, phomListCardIndex + phomSize);
                let phom = new Phom(GameUtils.convertBytesToCards(phomCardBytes));
                currentAllPhoms.push(phom);
                phomListCardIndex += phomSize;
            });

            let phomPlayerCount = 0;
            playerIds && playerIds.forEach((playerId, i) => {

                let player = this.scene.gamePlayers.findPlayer(playerId);
                if (player) {

                    let playerPhomList = new PhomList();
                    let phomCount = currentNumberOfPhomByPlayerId[i];
                    for (let j = 0; j < phomCount; j++) {

                        let phom = currentAllPhoms[j + phomPlayerCount];
                        phom.setOwner(player.id);
                        playerPhomList.add(phom.clone());
                        this.allPhomList.push(phom.clone());
                    }

                    phomPlayerCount += phomCount;

                    let eatenCards = GameUtils.convertBytesToCards(utils.getValue(allEatenCards, `${playerId}`, []));
                    /**
                     * _loadGamePlayData call after all renderer is call onEnable
                     */
                    player.renderer.setCurrentPhom(playerPhomList, eatenCards);
                }
            });
        }

        let lastPlayedTurn = utils.getValue(data, Keywords.LAST_MOVE_PLAYER_ID);
        if (lastPlayedTurn) {
            let playedPlayer = this.scene.gamePlayers.findPlayer(lastPlayedTurn);
            if(playedPlayer){
                let playerPlayedCards = playedPlayer.getPlayedCards();
                if (playerPlayedCards.length > 0) {
                    this.lastPlayedCard = playerPlayedCards[playerPlayedCards.length - 1];
                }
            }
        }

    }

    swapPlayedCards() {
        let lastMovePlayer = this.getLastMovePlayer();
        let nextPlayer = lastMovePlayer;
        if (lastMovePlayer) {
            let i = 5;
            while (i-- >= 0) {
                nextPlayer = this.scene.gamePlayers.getNextNeighbour(nextPlayer.id);
                if (nextPlayer == null || nextPlayer.id == lastMovePlayer.id) {
                    break;
                }

                let playerPlayedCards = nextPlayer.getPlayedCards();
                if (playerPlayedCards.length > lastMovePlayer.getPlayedCards().length) {
                    let changeCard = playerPlayedCards[playerPlayedCards.length - 1];
                    nextPlayer.renderer.playedCardList.transferTo(lastMovePlayer.renderer.playedCardList, [changeCard]);
                    break;
                }
            }
        }
    }

    deHighLightPhomList() {
        this.allPhomList.forEach(phom => phom.cleanHighlight());
    }

    _setDeckFakeCard(fakeCount = 16) {

        if (fakeCount > 0 || this.getTotalPlayedCardsSize() < 16) {
            this.renderer.fillDeckFakeCards(fakeCount);
        } else {
            this.renderer.cleanDeckCards();
        }
    }

    getTotalPlayedCardsSize() {
        let totalPlayedCard = this.scene.gamePlayers.players.reduce((total, player) => {
            return total += player.renderer.playedCardList.cards.length;
        }, 0);

        return totalPlayedCard;
    }

    onBoardPlaying(data, isJustJoined) {
        super.onBoardPlaying(data, isJustJoined);

        this.meDealCards = []

        if (isJustJoined) {
            this._setDeckFakeCard();
        }
    }

    onBoardStarting(data, isJustJoined) {
        super.onBoardStarting();
        this._setDeckFakeCard();
    }

    onBoardEnding(data) {

        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER, []);
        let playingPlayerIds = this.scene.gamePlayers.filterPlayingPlayer(playerIds);
        let playerInfos = this.scene.gamePlayers.getBasicPlayerInfo(playerIds);
        let balanceChangeAmounts = this._getPlayerBalanceChangeAmounts(playerIds, data);

        let playerHandCards = this._getPlayerHandCards(playerIds, data);
        let { gameResultInfos, resultTexts, winnerFlags, points } = this._getGameResultInfos(playerIds, playerHandCards, data);

        super.onBoardEnding(data);

        playingPlayerIds.forEach(playerId => {
            let player = this.scene.gamePlayers.findPlayer(playerId);
            player && player.showEndGameInfo({
                name: playerInfos[playerId].name,
                balanceChanged: balanceChangeAmounts[playerId],
                text: resultTexts[playerId],
                info: gameResultInfos[playerId],
                cards: GameUtils.sortCardAscByRankFirstSuitLast(playerHandCards[playerId]),
                isWinner: winnerFlags[playerId],
                point: points[playerId]
            })
        })

        // let models = playerIds.filter(playerId => (playingPlayerIds.indexOf(playerId) >= 0)).map(playerId => {
        //     return {
        //         name: playerInfos[playerId].name,
        //         balanceChanged: balanceChangeAmounts[playerId],
        //         text: resultTexts[playerId],
        //         info: gameResultInfos[playerId],
        //         cards: playerHandCards[playerId],
        //         isWinner: winnerFlags[playerId],
        //         point: points[playerId]
        //     }
        // });
        //
        // models.sort((model1, model2) => model1.point - model2.point)
        // for (let i = 1; i < models.length; i++) {
        //     let model = models[i];
        //     if(model.isWinner){
        //         ArrayUtils.swap(models, i, 0)
        //         break
        //     }
        // }
        //
        // setTimeout(() => this.scene.showGameResult(models, (shownTime) => {
        //     this.renderer.cleanDeckCards()
        //     this.scene.emit(Events.CLEAN_GAME_AFTER_SHOW_RESULT);
        //
        //     let remainTime = this.timelineRemain - shownTime;
        //     if (remainTime > 0 && this.scene.isEnding()) {
        //         if(this.scene.gamePlayers.players.length > 1){
        //             this._startEndBoardTimeLine(remainTime);
        //         }
        //     }
        //
        // }), CardList.TRANSFER_CARD_DURATION * 1000);
    }

    _getGameResultInfos(playerIds = [], playerHandCards, data) {

        let resultTexts = {};
        let gameResultInfos = {};
        let winnerFlags = {};
        let points = {};

        let winType = utils.getValue(data, Keywords.WIN_TYPE);
        let playersWinRanks = utils.getValue(data, Keywords.GAME_LIST_WIN);
        let rank = utils.getValue(data, Keywords.GAME_RANK_WIN);
        let isU =   winType == app.const.game.PHOM_WIN_TYPE_U_THUONG ||
                    winType == app.const.game.PHOM_WIN_TYPE_U_DEN ||
                    winType == app.const.game.PHOM_WIN_TYPE_U_KHAN ||
                    winType == app.const.game.PHOM_WIN_TYPE_U_TRON ||
                    winType == app.const.game.PHOM_WIN_TYPE_U_PHOM_KIN

        playerIds.forEach((id, i) => {
            let isMom = playerHandCards[id].length == 9;
            let playersWinRank = playersWinRanks[i];
            let resultText = '';

            if (playersWinRank == app.const.game.rank.GAME_RANK_FIRST) {
                switch (winType) {
                    case app.const.game.PHOM_WIN_TYPE_U_THUONG:
                        resultText = 'phom-u';
                        break;
                    case app.const.game.PHOM_WIN_TYPE_U_DEN:
                        resultText = 'phom-u-den';
                        break;
                    case app.const.game.PHOM_WIN_TYPE_U_KHAN:
                        resultText = 'phom-u-khan';
                        break;
                    case app.const.game.PHOM_WIN_TYPE_U_TRON:
                        resultText = 'phom-u-tron';
                        break;
                    case app.const.game.PHOM_WIN_TYPE_U_PHOM_KIN:
                        resultText = 'phom-u';
                        break;
                    default:
                        resultText = winType > 0 ? 'thang' : 'nhat';
                        //resultText = 'thang';
                }

                winnerFlags[id] = true;

            } else {
                if(isU){
                    resultText = 'thua'
                } else if (isMom) {
                    resultText = winType > 0 ? 'thua' : 'phom-mom';
                } else {
                    switch (playersWinRank) {
                        case app.const.game.rank.GAME_RANK_SECOND:
                            resultText = 'nhi';
                            break;
                        case app.const.game.rank.GAME_RANK_THIRD:
                            resultText = 'ba';
                            break;
                        case app.const.game.rank.GAME_RANK_FOURTH:
                            resultText = 'bet';
                            break;
                        default:
                            resultText = 'thua';
                    }
                }

                winnerFlags[id] = false;
            }

            if (this.scene.gamePlayers.findPlayer(id)) {
                let handCards = playerHandCards[id];
                let point = handCards.reduce((value, card) => value += card.rank, 0);
                if(isMom && winType != app.const.game.GENERAL_WIN_TYPE_NORMAL){
                    gameResultInfos[id] = "";
                }else{
                    points[id] = point;
                    gameResultInfos[id] = point == 0 ? "" : app.res.string('game_point', { point });
                }
            } else {
                resultText = "";
            }

            resultTexts[id] = resultText;
            points[id] === undefined && (points[id] = 1000);

        });

        return { gameResultInfos, resultTexts, winnerFlags, points};
    }

    _cleanTurnRoutineData(playerId) {
        super._cleanTurnRoutineData(playerId, false);
    }

}

app.createComponent(BoardPhom);