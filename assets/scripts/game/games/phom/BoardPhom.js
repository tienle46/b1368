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
import BoardPhomRenderer from 'BoardPhomRenderer';
import Phom from 'Phom';
import CardList from 'CardList';
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
        this.allPhomList = [];//new PhomList();
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

        console.log("cllear on reset board phom")
        this.allPhomList = [];//.clear();
    }

    _onPlayerPlayedCards(playedCards, srcCardList, isItMe) {
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

        if (!ArrayUtils.isEmpty(currentBoardPhomsSize)) {
            let currentAllPhoms = [];
            let phomListCardIndex = 0;

            currentBoardPhomsSize && currentBoardPhomsSize.forEach((phomSize, i) => {
                let phomCardBytes = currentBoardPhomsCards.slice(phomListCardIndex, phomListCardIndex + phomSize);
                let phom = new Phom(GameUtils.convertToBytes(phomCardBytes));
                currentAllPhoms.push(phom);
                phomListCardIndex += phomSize;
            });

            let phomPlayerCount = 0;
            playerIds && playerIds.forEach((playerId, i) => {

                let player = this.scene.gamePlayers.findPlayer(playerId);
                if (player) {

                    let phomCount = currentNumberOfPhomByPlayerId[i];
                    for (let j = 0; j < phomCount; j++) {

                        let phom = currentAllPhoms[j + phomPlayerCount];
                        let processingPhom = player.renderer.downPhomList[j];

                        if(!phom || !processingPhom) continue;

                        processingPhom.setCards(phom.cards);
                        processingPhom.setOwner(player.id);

                        this.allPhomList.push(processingPhom.clone());
                    }

                    phomPlayerCount += phomCount;
                }
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

        let lastPlayedTurn = utils.getValue(data, Keywords.LAST_MOVE_PLAYER_ID);
        if (lastPlayedTurn) {

            let playedPlayer = this.scene.gamePlayers.findPlayer(lastPlayedTurn);

            if(playedPlayer && playedPlayer.playedCards.length > 0){
                this.lastPlayedCard = playedPlayer.playedCards[playedPlayer.playedCards.length - 1];
            }
        }
    }

    swapPlayedCards() {
        let lastMovePlayer = this.getLastMovePlayer();

        if (lastMovePlayer) {
            let i = 4;
            while (i-- >= 0) {
                let nextPlayer = this.scene.gamePlayers.getNextNeighbour(lastMovePlayer.id);
                if (nextPlayer == null || nextPlayer.equals(lastMovePlayer)) break;

                if (nextPlayer.playedCards.length > lastMovePlayer.playedCards.length) {
                    let changeCard = nextPlayer.playedCards[nextPlayer.playedCards.length - 1];
                    nextPlayer.renderer.playedCardList.transferTo(lastMovePlayer.renderer.playedCardList, [changeCard]);
                    break;
                }
            }
        }
    }

    deHighLightPhomList(){
        this.allPhomList.forEach(phom => phom.cleanHighlight());
    }

    _setDeckFakeCard(fakeCount = 16) {
        if (fakeCount > 0 || this.getTotalPlayedCardsSize() < 16) {
            this.renderer.fillDeckFakeCards();
        } else {
            this.renderer.cleanDeckCards();
        }
    }

    getTotalPlayedCardsSize() {
        let totalPlayedCard = this.scene.gamePlayers.players.reduce((total, player) => {
            return total += player.renderer.playedCardList.cards.length;
        }, 0);

        console.log("totalPlayedCard: ", totalPlayedCard);
        
        return totalPlayedCard;
    }

    onBoardPlaying(data, isJustJoined){

        super.onBoardPlaying(data, isJustJoined);

        if(isJustJoined){
            this._setDeckFakeCard();
        }
    }

    onBoardStarting(data, isJustJoined) {
        super.onBoardStarting();
        this._setDeckFakeCard(16);
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
            if (remainTime > 0 && this.scene.isEnding()) {
                this.renderer.cleanDeckCards();
                this._startEndBoardTimeLine(remainTime);
            }
        }), CardList.TRANSFER_CARD_DURATION * 1000);
    }

    _getGameResultInfos(playerIds = [], playerHandCards, data) {
        /**
         * Get game result icon
         * @type {Array}
         */
        let resultIconPaths = {};
        /**
         * Get game result detail info
         * @type {Array}
         */
        let gameResultInfos = {};

        let winType = utils.getValue(data, Keywords.WIN_TYPE);
        let playersWinRanks = utils.getValue(data, Keywords.GAME_LIST_WIN);
        let rank = utils.getValue(data, Keywords.GAME_RANK_WIN);
        playerIds.forEach((id, i) => {
            let isMom = playerHandCards[id].length == 9;
            var playersWinRank = playersWinRanks[i];

            if (playersWinRank == app.const.game.rank.GAME_RANK_FIRST) {
                switch (winType) {
                    case app.const.game.PHOM_WIN_TYPE_U_THUONG:
                        resultIconPaths[id] = 'game/images/ingame_phom_u';
                        break;
                    case app.const.game.PHOM_WIN_TYPE_U_DEN:
                        resultIconPaths[id] = 'game/images/ingame_phom_u_den';
                        break;
                    case app.const.game.PHOM_WIN_TYPE_U_KHAN:
                        resultIconPaths[id] = 'game/images/ingame_phom_u_khan';
                        break;
                    case app.const.game.PHOM_WIN_TYPE_U_TRON:
                        resultIconPaths[id] = 'game/images/ingame_phom_u_tron';
                        break;
                    case app.const.game.PHOM_WIN_TYPE_U_PHOM_KIN:
                        resultIconPaths[id] = 'game/images/ingame_phom_u_phom_kin';
                        break;
                    default:
                        resultIconPaths[id] = 'game/images/ingame_thang';
                }
            } else {
                if(isMom){
                    resultIconPaths[id] = 'game/images/ingame_phom_mom';
                }else{
                    switch (playersWinRank) {
                        case app.const.game.GAME_RANK_SECOND:
                            resultIconPaths[id] = 'game/images/ingame_nhi';
                            break;
                        case app.const.game.GAME_RANK_THIRD:
                            resultIconPaths[id] = 'game/images/ingame_ba';
                            break;
                        case app.const.game.GAME_RANK_FOURTH:
                            resultIconPaths[id] = 'game/images/ingame_bet';
                            break;
                        default:
                            resultIconPaths[id] = 'game/images/ingame_thua';
                    }
                }
            }

            let player = this.scene.gamePlayers.findPlayer(id);
            if(player){
                let handCards = playerHandCards[id];
                let point = handCards.reduce((value, card) => value += card.rank, 0);
                gameResultInfos[id] = isMom && winType != app.const.game.GENERAL_WIN_TYPE_NORMAL ? "" : `${point} điểm`;
            } else{
                gameResultInfos[id] = "";
            }

        });

        return {gameResultInfos, resultIconPaths};
    }

    _cleanTurnRoutineData(playerId){
        super._cleanTurnRoutineData(playerId, false);
    }

}

app.createComponent(BoardPhom);