import app from 'app';
import Events from 'GameEvents';
import PlayerCardBetTurn from 'PlayerCardBetTurn';
import utils from "GeneralUtils";
import GameUtils from 'GameUtils';

export default class PlayerLieng extends PlayerCardBetTurn {

    constructor(board, user) {
        super(board, user);

        this.betAmount = 0;
        this.hucList = null;
        this._pendingCuocBienRequests = null;
        
        this._timeDuration = 0
    }

    _addGlobalListener() {
        super._addGlobalListener();

        this.scene.on(Events.ON_GAME_STATE, this._onGameState, this);
        this.scene.on(Events.ON_PLAYER_CHANGED_BET, this._onPlayerChangedBet, this);
        this.scene.on(Events.SHOW_GAME_ENDING_INFO, this._onShowGameEndingInfo, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();

        this.scene.off(Events.ON_GAME_STATE, this._onGameState, this);
        this.scene.off(Events.ON_PLAYER_CHANGED_BET, this._onPlayerChangedBet, this);
        this.scene.off(Events.SHOW_GAME_ENDING_INFO, this._onShowGameEndingInfo, this);
    }

    setBetAmount(betAmount = 0) {
        if (!utils.isNumber(betAmount)) betAmount = 0;
        this.betAmount = betAmount
        this.renderer.setBalance(GameUtils.getUserBalance(this.user) - this.betAmount)
        
        this.renderer.showBetAmount(this.betAmount)
    }
    
    onGamePlaying(data, isJustJoined) {
        if(!this.isItMe())
            return;

        super.onGamePlaying(data, isJustJoined);
        let gamePhase = utils.getValue(data, app.keywords.BOARD_STATE_KEYWORD);
        
        if(gamePhase == app.const.game.state.BET_TURNING) {
            let onTurnPlayerId = utils.getValue(data, app.keywords.TURN_PLAYER_ID);
            let duration = utils.getValue(data, app.keywords.TURN_BASE_PLAYER_TURN_DURATION);
            !this._timeDuration && (this._timeDuration = duration)
            let isFirstBet = data.isFirstBet || false
            if(isFirstBet) {
                this.scene.emit(Events.ON_FIRST_PLAYER_TO, onTurnPlayerId, duration)
            }
            onTurnPlayerId == this.id && duration && this.startTimeLine(this._timeDuration)
        }
    }
    
    createFakeCards(size = 0) {
        super.createFakeCards(3);
    }
    
    playPlayerBet(amount, isReplace = false) {
        if(this.isPlaying()) {
            this.renderer.playBetAnimation(amount);
            this.setBetAmount(isReplace ? amount : this.betAmount + amount);
            this.scene.board.setTotalBetAmount(this.scene.gamePlayers.players.reduce((a, b) => a + b.betAmount, 0));
        }
    }
    
    onLoad() {
        super.onLoad();
        this._timeDuration = 0
    }

    onEnable() {
        super.onEnable(this.getComponent('PlayerLiengRenderer'));
        this.renderer.betComponentAppearance(false);
    }
    
    onGameReset(){
        super.onGameReset();
        this._timeDuration = 0
        
        this.renderer.betComponentAppearance(false);
        this.setBetAmount(0);
    }
    
    onGameEnding(){
        super.onGameEnding();

        this.renderer.stopAllAnimation();
    }
    
    _onShowGameEndingInfo(playerId, { name = "", text = null, iconPath = "", balanceChanged = NaN, info = "", cards = [], isWinner = false } = {}){
        if(playerId != this.id || !this.isPlaying()) return;

        this.playSoundBaseOnBalanceChanged(balanceChanged);
        this.renderer.showAction(info);
        this.renderer.betComponentAppearance(false);
        this.renderer.startPlusBalanceAnimation(balanceChanged, true);
        
        cards.length > 0 && this.setCards(cards, true);
    }

    _onPlayerChangedBet(betAmount = 0) {
        if (!this.isItMe() || betAmount <= 0 || this.board.scene.gameState != app.const.game.state.BET_TURNING ) {
            //Show message && play sound invalid
            return;
        }

        betAmount > 0 && app.service.send({
            cmd: app.commands.PLAYER_PLAY_BET_TURN,
            data: {
                [app.keywords.PLAYER_BET_AMOUNT]: betAmount
            },
            room: this.scene.room
        });
    }

    _onGameRejoin(data) {
        super._onGameRejoin(data);
        if (this.isPlaying()) {
            this.renderer.betComponentAppearance(true)
        }
    }
    
    onGameStarting(data, isJustJoined) {
        super.onGameStarting(data, isJustJoined)
        this.renderer.betComponentAppearance(true);
    }
}

PlayerLieng.DEFAULT_HAND_CARD_COUNT = 3

app.createComponent(PlayerLieng);
