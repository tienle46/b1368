/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import game from 'game';
import { utils, GameUtils } from 'utils';
import { Keywords } from 'core';
import { Events } from 'events';
import BoardCardBetTurn from 'BoardCardBetTurn';
import PlayerBaCay from 'PlayerBaCay';
import BoardBaCayRenderer from 'BoardBaCayRenderer';
import BaCayUtils from "./BaCayUtils";

export default class BoardBaCay extends BoardCardBetTurn {

    constructor() {
        super();

        this.winRank = 0;
        this.handCardSize = PlayerBaCay.DEFAULT_HAND_CARD_COUNT;
    }

    onLoad() {
        super.onLoad();
    }

    onEnable() {
        /**
         * @type {BoardBaCayRenderer}
         */
        this.renderer = this.node.getComponent('BoardBaCayRenderer');
        super.onEnable();
    }

    get gameType() {
        return app.const.game.GAME_TYPE_XAM;
    }

    _reset() {
        super._reset();
        this.winRank = 0;
    }

    handleGameStateChange(boardState, data, isJustJoined) {
        super.handleGameStateChange(boardState, data);

        this.stopTimeLine();

        let message;
        if (boardState == app.const.game.state.STATE_BET) {
            message = app.res.string('game_bet_time');

            console.log("ON_GAME_STATE_STARTING--- ")
            this.scene.emit(Events.ON_GAME_STATE_STARTING);
        } else if (boardState == app.const.game.state.STATE_DOWN) {
            message = app.res.string('game_down_card_time');
            this._handleBaCayDownCardPhrase(data);

        }

        let duration = utils.getValue(data, app.keywords.BOARD_PHASE_DURATION);
        duration && this.startTimeLine(duration, message ? message.toUpperCase() : '');
    }

    _handleBaCayDownCardPhrase(data) {

        console.log("_handleBaCayDownCardPhrase: ", data)

        let playerIds = utils.getValue(data, app.keywords.GAME_LIST_PLAYER);
        let handCardBytes = utils.getValue(data, app.keywords.GAME_LIST_CARD);
        if (playerIds && handCardBytes) {
            for (let i = 0; i < playerIds.length; i++) {
                let player = this.scene.gamePlayers.findPlayer(playerIds[i]);
                if (player) {
                    let cards = GameUtils.convertBytesToCards(handCardBytes.slice(i * 3, (i + 1) * 3));
                    player.setCards(cards, false);
                }
            }
        }
    }

    _loadGamePlayData(data) {
        super._loadGamePlayData({...data, masterIdOwner: true });

        let gamePhrase = utils.getValue(data, app.keywords.BOARD_STATE_KEYWORD);
        if (gamePhrase == app.const.game.state.STATE_DOWN) {
            this._handleBaCayDownCardPhrase(data);
        }

        /**
         * Load player down card & player bet amount
         */
        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER, []);
        let downPlayerIds = utils.getValue(data, app.keywords.GAME_LIST_DOWN);
        let betAmounts = utils.getValue(data, app.keywords.GAME_LIST_BET);
        let bCards = utils.getValue(data, app.keywords.GAME_LIST_CARD);

        for (let i = 0; i < playerIds.length; i++) {
            let player = this.scene.gamePlayers.findPlayer(playerIds[i]);
            if (player != null) {
                if (betAmounts) {
                    player.setBetAmount(betAmounts[i]);
                }

                // let cardBytes = bCards ? bCards.slice(i * 3, (i + 1) * 3) : [0, 0, 0];
                // player.setCards(GameUtils.convertBytesToCards(cardBytes));

                if (downPlayerIds) {
                    player.isDown = downPlayerIds[i];

                    console.log("player.isDown: ", player.id, player.isDown);

                    if (player.isDown) {
                        player.renderer.revealAllCards();
                    }
                }
            }
        }

    }

    _getPlayerHandCards(playerIds) {
        let result = {};
        playerIds.forEach(id => {
            let player = this.scene.gamePlayers.findPlayer(id);
            result[id] = player ? [...player.getCards()] : [];
        });

        return result;
    }

    onBoardEnding(data) {
        console.log("onGameEnding Board");

        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER, []);
        let playingPlayerIds = this.scene.gamePlayers.filterPlayingPlayer(playerIds);
        let playerInfos = this.scene.gamePlayers.getBasicPlayerInfo(playerIds);

        let balanceChangeAmounts = this._getPlayerBalanceChangeAmounts(playerIds, data);
        let playerHandCards = this._getPlayerHandCards(playerIds, data);
        let { resultTexts, gameResultInfos, resultIconPaths } = this._getGameResultInfos(playerIds, playerHandCards, data);

        super.onBoardEnding(data);

        let models = playerIds.filter(playerId => (playingPlayerIds.indexOf(playerId) >= 0)).map(playerId => {
            return {
                name: playerInfos[playerId].name,
                balanceChanged: balanceChangeAmounts[playerId],
                iconPath: resultIconPaths[playerId],
                info: gameResultInfos[playerId],
                cards: playerHandCards[playerId],
                text: resultTexts[playerId]
            }
        });

        setTimeout(() => this.scene.showGameResult(models, (shownTime) => {
            let remainTime = this.timelineRemain - shownTime;
            if (remainTime > 0 && this.scene.isEnding()) {
                this._startEndBoardTimeLine(remainTime);
            }
        }), 500);
    }

    _getGameResultInfos(playerIds = [], playerHandCards, data) {

        let winType = utils.getValue(data, Keywords.WIN_TYPE);
        let playersWinRanks = utils.getValue(data, Keywords.GAME_LIST_WIN);
        let playersCardCounts = utils.getValue(data, Keywords.GAME_LIST_PLAYER_CARDS_SIZE);

        /**
         * Get game result icon
         * @type {Array}
         */
        let resultTexts = {};
        let resultIconPaths = {};
        let gameResultInfos = {};
        playerIds.forEach((id, i) => {
            let resultText;
            if (playersWinRanks[i] == app.const.game.rank.GAME_RANK_FIRST) {
                resultText = app.res.string('game_thang');
            } else {
                if (winType == app.const.game.GENERAL_WIN_TYPE_NORMAL) {
                    let cardCount = playersCardCounts && playersCardCounts[i];

                    if (cardCount == PlayerBaCay.DEFAULT_HAND_CARD_COUNT) {
                        resultText = app.res.string('game_sam_treo');
                    }
                }

                if (!resultText) resultText = app.res.string('game_thua');
            }

            gameResultInfos[id] = BaCayUtils.createPlayerHandCardInfo(playerHandCards[id]);
            resultTexts[id] = resultText;
        })

        return { resultTexts, gameResultInfos, resultIconPaths };
    }
}

app.createComponent(BoardBaCay);