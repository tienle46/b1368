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
        this._duration = 0;
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

        this.scene.on(Events.ON_PLAYER_TO, this._onPlayerTo, this);
        this.scene.on(Events.HANDLE_SKIP_TURN, this._handleSkipTurn, this);
        this.scene.on(Events.ON_FIRST_PLAYER_TO, this._onShowToIcon, this);
    }

    get gameType() {
        return app.const.game.GAME_TYPE_XAM;
    }

    setTotalBetAmount(value){
        this.totalBetAmount = value;
        this.renderer.setTotalValue(value);
    }
    
    /**
     * @extending 
     * 
     * @param {any} data 
     * @param {any} isJustJoined 
     * @memberof BoardLieng <- BoardCard
     */
    onBoardPlaying(data, isJustJoined) {
        super.onBoardPlaying(data, isJustJoined)
        if(isJustJoined) {
            let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER, []);
            let playingPlayerIds = this.scene.gamePlayers.filterPlayingPlayer(playerIds);
            let onTurnPlayerId = utils.getValue(data, app.keywords.TURN_PLAYER_ID);
            let duration = utils.getValue(data, app.keywords.TURN_BASE_PLAYER_TURN_DURATION);
            
            playerIds.forEach((playerId, index) => {
                if((playingPlayerIds.indexOf(playerId) >= 0)) {
                    let player = this.scene.gamePlayers.findPlayer(playerId);
                    if(!player.isPlaying())
                        return
                    
                    player.createFakeCards()
                    player.renderer.betComponentAppearance(true)
                    if(onTurnPlayerId == playerId)
                        player.startTimeLine(duration)
                }
            });
        }
    }
    
    // /**
    //  * @extending 
    //  * 
    //  * @param {any} data 
    //  * @memberof BoardLieng <- BoardCard
    //  */
    // _dealCards(data) {
    //     this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(() => {
    //         super._dealCards(data)
    //     })))
    //     // let cardBytes = data[app.keywords.DEAL_CARD_LIST_KEYWORD] || [];
    //     // let dealCards = cardBytes.map(cardByte => Card.from(cardByte));
    //     // let playerHandCardLists = this.scene.gamePlayers.getPlayerHandCardLists();
    //     // playerHandCardLists.splice(0, 0, this.renderer.meDealCardList);
    //     // this.onDealCard(playerHandCardLists, dealCards, data);
    // }
    
    startTimeLine(duration, message){
        if(utils.isEmpty(message)){
            switch (this.scene.gameState){
                case app.const.game.state.READY:
                    message = app.res.string('game_start');
                    break;
            }
        }
        super.startTimeLine(duration, message);
        if(this.scene.gameState != app.const.game.state.READY) {
            this.renderer.hideTimeLine()
        }
    }

    onGameStatePreChange(boardState, data, isJustJoined) {
        super.onGameStatePreChange(boardState, data);

        this.stopTimeLine();
        let duration = utils.getValue(data, app.keywords.BOARD_PHASE_DURATION);
        duration && this.startTimeLine(duration);
    }
    
    onGameStateChanged(boardState, data, isJustJoined) {
        super.onGameStateChanged(boardState, data, isJustJoined);

        if(boardState == app.const.game.state.BET_TURNING && !isJustJoined) {
            this.scene.gamePlayers.players.forEach(player => player.playerGopGaA(this.minBet, this.renderer.totalAmoutNode)) // prebet
        }
    }
            
    onBoardStarting(...args){
        super.onBoardStarting(...args);
        this.renderer.setVisibleTotalAmountComponent(true)
    }
    
    
    onBoardEnding(data) {
        app.env.isBrowser() && console.warn('[BoardLieng] _onBoardEnding', data)
        
        let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER, []);
        let playingPlayerIds = this.scene.gamePlayers.filterPlayingPlayer(playerIds);
        let playerInfos = this.scene.gamePlayers.getBasicPlayerInfo(playerIds);
        let skips = utils.getValue(data, app.keywords.GAME_LIST_UP_BO)
        let betAmounts = utils.getValue(data, app.keywords.LIENG_BET_AMOUNT) || utils.getValue(data, app.keywords.LIENG_BET_AMOUNT)

        let balanceChangeAmounts = this._getPlayerBalanceChangeAmounts(playerIds, data);
        let playerHandCards = this._getPlayerHandCards(playerIds, data);
        let {resultTexts, gameResultInfos, resultIconPaths} = this._getGameResultInfos(playerIds, playerHandCards, data);
        super.onBoardEnding(data);
        
        let _needDownAllCardsOnBoard = false
        let playerDoesNotSkipCounter = 0
        
        playerIds.forEach((playerId, index) => {
            if(playingPlayerIds.indexOf(playerId) >= 0) {
                if(balanceChangeAmounts[playerId] && balanceChangeAmounts[playerId] > 0 && betAmounts && betAmounts[index]) {
                    balanceChangeAmounts[playerId] += betAmounts[index]
                }
                if(skips[index] != true)
                    playerDoesNotSkipCounter ++
            }
        });
        
        playerIds.forEach((playerId, index) => {
            if(this.scene.gamePlayers.isItMe(playerId) && skips[index] == true) {
                _needDownAllCardsOnBoard = playerDoesNotSkipCounter == 1
            }
        })
        
        playerIds.filter(playerId => (playingPlayerIds.indexOf(playerId) >= 0)).forEach((playerId, index) => {
            let model = {
                name: playerInfos[playerId].name,
                balanceChanged: balanceChangeAmounts[playerId],
                iconPath: resultIconPaths[playerId],
                info: gameResultInfos[playerId],
                cards: playerHandCards[playerId],
                text: resultTexts[playerId]
            }
            
            this.scene.emit(Events.SHOW_GAME_ENDING_INFO, playerId, model, _needDownAllCardsOnBoard || skips[index]);
        });
        
        this.scene.board.setTotalBetAmount(0);
    }
    
    /**
     * ~ minimum bet amount user has to bet per turn (used on slider and `Theo` btn)
     * 
     * @returns int
     * @memberof BoardLieng
     */
    acceptedAmount(){
        let accepted = Math.max.apply(Math, this.scene.gamePlayers.players.map((player) => player.betAmount))
        
        let meBalance = this.scene.gamePlayers.me.balance
        return accepted >= meBalance ? meBalance : accepted
    }
    
    _loadGamePlayData(data) {
        super._loadGamePlayData(Object.assign({}, data, {masterIdOwner: true}));
        // console.warn('_loadGamePlayData', data)
        
        let gamePhase = utils.getValue(data, app.keywords.BOARD_STATE_KEYWORD);
        
        this.renderer.setVisibleTotalAmountComponent(gamePhase === app.const.game.state.BET_TURNING)
        let firstBetId = data.firstBet
        if(firstBetId) {
            let duration = utils.getValue(data, app.keywords.TURN_BASE_PLAYER_TURN_DURATION)
            this._onShowToIcon(firstBetId, duration)
        }
        
        if(gamePhase == app.const.game.state.BET_TURNING) {
            /**
             * loadGameData player down card & player bet amount
             */
            let playerIds = utils.getValue(data, Keywords.GAME_LIST_PLAYER, []);
            let betAmounts = utils.getValue(data, app.keywords.GAME_LIST_BET);
            
            this.setTotalBetAmount(this.minBet * playerIds.length)
            
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
    
    _onShowToIcon(playerId, duration) {
        this._duration = duration;
        
        this.scene.gamePlayers.players.forEach(player => player.renderer.setVisibleTo(player.id == playerId));
    }
    
    _getPlayerHandCards(playerIds = [], data = {}) {

        if(data[Keywords.NEW_ALL_PLAYER_CARDS]){
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
    
    _onPlayerTo(previousPlayerId, onTurnPlayerId, betAmount) {
        this.scene.gamePlayers.players.forEach(player => {
            if(!player.isPlaying())
                return;
            
            if(onTurnPlayerId == player.id) {                
                this._duration && player.startTimeLine(this._duration)
            } else if(previousPlayerId == player.id){
                // this.renderer.setTotalValue(this.totalBetAmount);
                this.setTotalBetAmount(this.totalBetAmount)
                
                if(player.balance > betAmount)
                    betAmount -= this.minBet
                    
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
                this._duration && player.startTimeLine(this._duration)
            } else if(previousPlayerId == player.id){
                player.stopTimeLine()
                player.renderer.downAllCards()
                player.renderer.showAction('', false);
            }
        });
    }
    
    _reset() {
        super._reset();
        this.winRank = 0;
        this.setTotalBetAmount(0);
        this._duration = 0;
        
        this.renderer.setVisibleTotalAmountComponent(false)
        this.scene.isShowBetPopup = false
        this.scene.isShowCuocBienPopup = false
    }
    
    _getGameResultInfos(playerIds = [], playerHandCards, data) {

        let playersWinRanks = utils.getValue(data, Keywords.GAME_LIST_WIN);
        let cardTypes = utils.getValue(data, data[Keywords.LIENG_CARD_TYPE] ? Keywords.LIENG_CARD_TYPE : "ct");
        
        /**
         * Get game result icon
         * @type {Array}
         */
        let resultTexts = {};
        let resultIconPaths = {};
        let gameResultInfos = {};
        if(cardTypes && playersWinRanks)
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