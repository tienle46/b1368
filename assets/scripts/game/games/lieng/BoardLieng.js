/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import { utils, GameUtils } from 'PackageUtils';
import { Keywords } from 'core';
import { Events } from 'events';
import BoardCardBetTurn from 'BoardCardBetTurn';
import PlayerBaCay from 'PlayerBaCay';
import LiengUtils from "LiengUtils";

export default class BoardLieng extends BoardCardBetTurn {

    constructor() {
        super();

        this.winRank = 0;
        this.handCardSize = PlayerBaCay.DEFAULT_HAND_CARD_COUNT;
        this.totalBetAmount = 0;
    }

    onLoad() {
        super.onLoad();
    }

    onEnable() {
        /**
         * @type {BoardLiengRenderer}
         */
        this.renderer = this.node.getComponent('BoardLiengRenderer');
        super.onEnable();

        this.scene.on('on.player.to', this._onPlayerTo, this);
        this.scene.on(Events.HANDLE_SKIP_TURN, this._handleSkipTurn, this);
    }

    get gameType() {
        return app.const.game.GAME_TYPE_XAM;
    }

    setTotalBetAmount(value){
        this.totalBetAmount = value;
        this.renderer.setTotalValue(value);
    }

    startTimeLine(duration, message){
        if(utils.isEmpty(message)){
            switch (this.scene.gameState){
                case app.const.game.state.READY:
                    message = app.res.string('game_start');
                    break;
                case app.const.game.state.BET_TURNING:
                    message = app.res.string('lieng_game_bet');
                    break;
            }
        }
        super.startTimeLine(duration, message);
    }

    onGameStatePreChange(boardState, data, isJustJoined) {
        super.onGameStatePreChange(boardState, data);

        this.stopTimeLine();
        let duration = utils.getValue(data, app.keywords.BOARD_PHASE_DURATION);
        duration && this.startTimeLine(duration);
    }
    
    onGameStateChanged(boardState, data, isJustJoined) {
        super.onGameStateChanged(boardState, data, isJustJoined);
        if(boardState == app.const.game.state.BET_TURNING && (!app.context.rejoiningGame || this.totalBetAmount == 0)) {
            this.scene.gamePlayers.players.forEach(player => player.playPlayerBet(this.minBet)) // prebet
        }
    }
            
    onBoardStarting(...args){
        super.onBoardStarting(...args);
    }
    
    
    onBoardEnding(data) {
        // console.warn('_onBoardEnding', data)
        
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
            // console.warn(model)
            
            this.scene.emit(Events.SHOW_GAME_ENDING_INFO, playerId, model);

            return model;
        });
    }
    
    /**
     * ~ minimum bet amount user has to bet per turn (used on slider and `Theo` btn)
     * 
     * @returns int
     * @memberof BoardLieng
     */
    acceptedAmount(){
        let accepted = Math.max.apply(Math, this.scene.gamePlayers.players.map((me) => me.betAmount))
        // accepted == board.minBet => the 1st round.
        // return accepted === this.minBet ? accepted * 2 : accepted
        return accepted
    }
    
    _loadGamePlayData(data) {
        // super._loadGamePlayData({...data, masterIdOwner: true});
        super._loadGamePlayData(Object.assign({}, data, {masterIdOwner: true}));
        // console.warn('_loadGamePlayData', data)
        
        let gamePhase = utils.getValue(data, app.keywords.BOARD_STATE_KEYWORD);
        
        if(gamePhase == app.const.game.state.BET_TURNING) {
            /**
             * Load player down card & player bet amount
             */
            let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER, []);
            let betAmounts = utils.getValue(data, app.keywords.GAME_LIST_BET);
            
            for (let i = 0; i < playerIds.length; i++) {
                let player = this.scene.gamePlayers.findPlayer(playerIds[i]);
                if (player != null) {
                    if (betAmounts) {
                        player.playPlayerBet(betAmounts[i], true);
                    }
                }
            }
        }
    }

    _getPlayerHandCards(playerIds = [], data = {}) {

        if(data[Keywords.GAME_LIST_CARD]){
            data[Keywords.GAME_LIST_PLAYER_CARDS_SIZE] = new Array(playerIds.length).fill(3)
            return super._getPlayerHandCards(playerIds, data);
        }else{
            let result = {};
            playerIds.forEach(id => {
                let player = this.scene.gamePlayers.findPlayer(id);
                result[id] = player ? [...player.getCards()] : [];
            });

            return result;
        }
    }
    
    _onPlayerTo (previousPlayerId, onTurnPlayerId, betAmount) {
        this.scene.gamePlayers.players.forEach(player => {
            if(!player.isPlaying())
                return;
            
            if(onTurnPlayerId == player.id) {
                player._timeDuration && player.startTimeLine(player._timeDuration)
            } else if(previousPlayerId == player.id){
                this.renderer.setTotalValue(this.totalBetAmount);
                
                player.playPlayerBet(betAmount, true)
                player.stopTimeLine()
            }
        });
    }
    
    _handleSkipTurn(data) {
        let onTurnPlayerId = utils.getValue(data, app.keywords.TURN_PLAYER_ID);
        let previousPlayerId = utils.getValue(data, app.keywords.PLAYER_ID);
        
        this.scene.gamePlayers.players.forEach(player => {
            if(!player.isPlaying())
                return;
            
            if(onTurnPlayerId == player.id) {
                player._timeDuration && player.startTimeLine(player._timeDuration)
            } else if(previousPlayerId == player.id){
                player.stopTimeLine()
                player.renderer.downAllCards()
                player.renderer.showAction(app.res.string('game_result_lieng_upbo'));
            }
        });
    }
    
    _reset() {
        super._reset();
        this.winRank = 0;
        this.setTotalBetAmount(0);

        this.scene.isShowBetPopup = false
        this.scene.isShowCuocBienPopup = false
    }
    
    _getGameResultInfos(playerIds = [], playerHandCards, data) {

        let playersWinRanks = utils.getValue(data, Keywords.GAME_LIST_WIN);
        let cardTypes = utils.getValue(data, Keywords.LIENG_CARD_TYPE);

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
                // if (winType == app.const.game.GENERAL_WIN_TYPE_NORMAL) {
                //     let cardCount = playersCardCounts && playersCardCounts[i];
                //
                //     if (cardCount == PlayerBaCay.DEFAULT_HAND_CARD_COUNT) {
                //         resultText = app.res.string('game_sam_treo');
                //     }
                // }

                if (!resultText) resultText = app.res.string('game_thua');
            }

            gameResultInfos[id] = LiengUtils.createPlayerHandCardInfo(playerHandCards[id], cardTypes[i]);
            resultTexts[id] = resultText;
        })

        return {resultTexts, gameResultInfos, resultIconPaths};
    }
}

app.createComponent(BoardLieng);