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
import GameAnim from "../../components/anim/GameAnim";

export default class BoardBaCay extends BoardCardBetTurn {

    constructor() {
        super();

        this.winRank = 0;
        this.handCardSize = PlayerBaCay.DEFAULT_HAND_CARD_COUNT;
        this.totalGopGaValue = 0;
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

        this.scene.on(Events.SHOW_GOP_GA_NODE, this._showGopGa, this);
        this.scene.on(Events.ON_PLAYER_BACAY_GOP_GA, this._onPlayerGopGa, this);
        this.scene.on(Events.ON_GAME_MASTER_CHANGED, this._onGameMasterChanged, this);
    }

    get gameType() {
        return app.const.game.GAME_TYPE_XAM;
    }

    _reset() {
        super._reset();
        this.winRank = 0;
        this.setTotalGopGaValue(0);
        this._showGopGa(false);
    }

    setTotalGopGaValue(value){
        this.totalGopGaValue = value;
        this.renderer.setGopGaLabelValue(value);
    }

    startTimeLine(duration, message){
        if(utils.isEmpty(message)){
            switch (this.scene.gameState){
                case app.const.game.state.READY:
                    message = app.res.string('game_start');
                    break;
                case app.const.game.state.STATE_BET:
                    message = app.res.string('game_bet');
                    break;
                case app.const.game.state.STATE_DOWN:
                    message = app.res.string('game_down_card');
                    break;
            }
        }
        super.startTimeLine(duration, message);
    }

    onGameStatePreChange(boardState, data, isJustJoined) {
        super.onGameStatePreChange(boardState, data);

        this.stopTimeLine();

        let message;
        if (boardState == app.const.game.state.STATE_BET) {
            message = app.res.string('game_bet_time');
            this.scene.emit(Events.ON_GAME_STATE_STARTING);
        } else if (boardState == app.const.game.state.STATE_DOWN) {
            message = app.res.string('game_down_card_time');
            this._handleBaCayDownCardPhrase(data);
        }

        let duration = utils.getValue(data, app.keywords.BOARD_PHASE_DURATION);
        duration && this.startTimeLine(duration, message ? message.toUpperCase() : '');
    }

    onBoardStarting(...args){
        super.onBoardStarting(...args);

        this._showGopGa(true);
    }

    _handleBaCayDownCardPhrase(data) {

        this._showGopGa(false);

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
        super._loadGamePlayData({...data, masterIdOwner: true});

        let gamePhrase = utils.getValue(data, app.keywords.BOARD_STATE_KEYWORD);
        if(gamePhrase == app.const.game.state.STATE_DOWN) {
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

        this._showGopGa(false);

        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER, []);
        let playingPlayerIds = this.scene.gamePlayers.filterPlayingPlayer(playerIds);
        let playerInfos = this.scene.gamePlayers.getBasicPlayerInfo(playerIds);

        let balanceChangeAmounts = this._getPlayerBalanceChangeAmounts(playerIds, data);
        let playerHandCards = this._getPlayerHandCards(playerIds, data);
        let {resultTexts, gameResultInfos, resultIconPaths} = this._getGameResultInfos(playerIds, playerHandCards, data);

        super.onBoardEnding(data);

        let models = playerIds.filter(playerId => (playingPlayerIds.indexOf(playerId) >= 0)).map(playerId => {
            let model = {
                name: playerInfos[playerId].name,
                balanceChanged: balanceChangeAmounts[playerId],
                iconPath: resultIconPaths[playerId],
                info: gameResultInfos[playerId],
                cards: playerHandCards[playerId],
                text: resultTexts[playerId]
            }

            this.scene.emit(Events.SHOW_GAME_ENDING_INFO, playerId, model);

            return model;
        });

        // setTimeout(() => this.scene.showGameResult(models, (shownTime) => {
        //     let remainTime = this.timelineRemain - shownTime;
        //     if (remainTime > 0 && this.scene.isEnding()) {
        //         this._startEndBoardTimeLine(remainTime);
        //     }
        // }), 500);
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

        return {resultTexts, gameResultInfos, resultIconPaths};
    }

    onClickGopGaButton(){

        console.log("on click gop ga")

        this._shouldToGopGa() && app.service.send({
            cmd: app.commands.BACAY_PLAYER_GOP_GA,
            data: {
                [Keywords.BA_CAY_GOP_GA_VALUE]: this.minBet * 3
            },
            room: this.scene.room
        });
    }

    _shouldToGopGa(){

        console.log("on click gop ga: ", this.scene.gamePlayers.isMePlaying())

        if(!this.scene.gamePlayers.isMePlaying()){
            return false;
        }

        if(this.scene.gamePlayers.me.gopGaValue > 0){
            return false;
        }

        return true;

        //TODO verify gop ga
    }

    _showGopGa(visible){
        this.renderer.setVisibleGopGaComponent(visible);
    }

    _addToGopGaValue(player, gopGaValue){
        player.gopGaValue = gopGaValue;
        this.setTotalGopGaValue(this.totalGopGaValue += gopGaValue);
        this.renderer.setGopGaLabelValue(this.totalGopGaValue);
        player.isItMe() && this.renderer.disableGopGaValue();
    }

    _onPlayerGopGa(playerId, gopGaValue){

        console.log("_onPlayerGopGa: ", playerId);

        let gopGaPlayer = this.scene.gamePlayers.findPlayer(playerId);
        if(gopGaPlayer){
            console.log("gopGaPlayer: ", gopGaPlayer);
            GameAnim.flyTo({fromNode: gopGaPlayer.node, toNode: this.renderer.gopGaCoinNode, amount: 3, prefab: this.renderer.chipPrefab});
            this._addToGopGaValue(gopGaPlayer, gopGaValue);

            if(gopGaPlayer.isItMe()){
                this.renderer.disableGopGaButton();
            }
        }
    }

    _onGameMasterChanged(oldMaster, newMaster){
        oldMaster && app.system.showToast(app.res.string('game_change_master_to_player', {playerName: newMaster.user.name}))
    }


}

app.createComponent(BoardBaCay);