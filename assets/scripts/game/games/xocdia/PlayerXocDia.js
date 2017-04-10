import app from 'app';
import Events from 'Events';
import PlayerCardBetTurn from 'PlayerCardBetTurn';

export default class PlayerXocDia extends PlayerCardBetTurn {

    constructor(board, user) {
        super(board, user);

        this.betAmount = 0;
        this.hucList = null;
        this.biHucList = null;
        this.pendingCuocBiens = null;
        this.pendingBiCuocBiens = null;
        this.currentCuocBien = 0;
        this.balanceAvailable = 0;

        this.betData = []; // used to save currently in-phase-betted data of this user, because client's connection will be occured while betting, it is more neccessary when save betData on its event emitter `XOCDIA_ON_PLAYER_BET`;
    }

    _addGlobalListener() {
        super._addGlobalListener();

        this.scene.on(Events.ON_GAME_STATE, this._onGameState, this);
        this.scene.on(Events.XOCDIA_ON_PLAYER_BET, this._onPlayerBet, this);
        this.scene.on(Events.XOCDIA_ON_PLAYER_CANCELBET, this._onPlayerCancelBet, this);
        this.scene.on(Events.XOCDIA_ON_DISTRIBUTE_CHIP, this._onDistributeChip, this);
        this.scene.on(Events.XOCDIA_ON_PLAYER_RUN_MONEY_BALANCE_CHANGE_ANIM, this._onPlayerChangeMoneyAnim, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();

        this.scene.off(Events.ON_GAME_STATE, this._onGameState, this);
        this.scene.off(Events.XOCDIA_ON_PLAYER_BET, this._onPlayerBet, this);
        this.scene.off(Events.XOCDIA_ON_PLAYER_CANCELBET, this._onPlayerCancelBet, this);
        this.scene.off(Events.XOCDIA_ON_DISTRIBUTE_CHIP, this._onDistributeChip, this);
        this.scene.off(Events.XOCDIA_ON_PLAYER_RUN_MONEY_BALANCE_CHANGE_ANIM, this._onPlayerChangeMoneyAnim, this);
    }

    onLoad() {
        super.onLoad();
        this.hucList = {};
        this.biHucList = {};
        this.pendingCuocBiens = {};
        this.pendingBiCuocBiens = {};
    }

    onEnable() {
        super.onEnable(this.getComponent('PlayerXocDiaRenderer'));

        this.balanceAvailable = this.balance;
    }

    _setBalance(balance) {
        this.balanceAvailable = balance;

        super._setBalance(balance);
    }

    onGameReset() {
        super.onGameReset();
        this.betData = [];
    }


    onGameEnding(data) {
        super.onGameEnding(data);
        this.renderer.stopAllAnimation();
    }


    _onPlayerBet(data) {
        // if (!this.isItMe() || !this.board.scene.gamePlayers.master) return;
        if (data.playerId != this.id) return;

        let { playerId, betsList, isSuccess, err, isReplace } = data;
        let prevList = this.betData;
        this.betData = isReplace ? betsList : [...this.betData, ...betsList];

        if (isSuccess) {
            let { myPos, isItMe } = this._getPosBasedOnWorldSpace(playerId);
            
            app.system.audioManager.play(app.system.audioManager.XOCDIA_MOVING_CHIPS);
            this.scene.emit(Events.XOCDIA_ON_PLAYER_TOSSCHIP_ANIMATION, { myPos, betsList, isItMe, playerId, isReplace, prevList });
        } else {
            //TODO
            app.system.showToast(err);
        }

    }

    _onPlayerCancelBet(data) {
        if (data.playerId != this.id) return;
        let betsList = this.betData;
        let { playerId, isSuccess, err } = data;
        if (isSuccess) {
            let isItMe = this.scene.gamePlayers.isItMe(playerId);
            let myPos = this.scene.gamePlayers.playerPositions.getPlayerAnchorByPlayerId(playerId, isItMe);

            this.scene.emit(Events.XOCDIA_ON_PLAYER_CANCEL_BET_SUCCESS, { myPos, isItMe, betsList, playerId });
            this.betData = [];
        } else {
             app.system.showToast(err);
        }
    }

    _onDistributeChip(data) {
        let { playingPlayerIds, bets, dots } = data;
        let playerIdIndex = playingPlayerIds.findIndex(id => id == this.id);

        if (playerIdIndex !== undefined) {
            let playerId = this.id;
            let isItMe = this.scene.gamePlayers.isItMe(playerId);
            let { myPos } = this._getPosBasedOnWorldSpace(playerId);
            let betData = bets[playerIdIndex];
            // user will be get chip after dealer got it
            setTimeout(() => {
                this.scene.emit(Events.XOCDIA_ON_PLAYER_RECEIVE_CHIP_ANIMATION, { userPos: myPos, playerId, betData, dots, isItMe });
            }, 500);
        }
        return;
    }

    _onPlayerChangeMoneyAnim(data) {
        let { playerId, balance } = data;
        if (playerId !== this.id)
            return;
        this.renderer.startPlusBalanceAnimation(balance);
    }

    _onGameRejoin(data) {
        super._onGameRejoin(data);
    }

    _onGameState(state, data, isJustJoined) {
        if (state == app.const.game.state.STATE_BET) {
            this.isItMe() && this.renderer.hidePlayerComponentOnBetting();
        }

        if (state == app.const.game.state.BOARD_STATE_SHAKE) {
            this.isItMe() && this.renderer.showPlayerComponentOnShake();
        }
    }

    _onGameStateBet() {}

    changePlayerBalance(amount) {
        this.setPlayerBalance(this.balanceAvailable + Number(amount));
    }

    setPlayerBalance(amount) {
        this.balanceAvailable = Number(amount);
        this.renderer.setBalance(this.balanceAvailable);
    }

    loadPlayerBalance() {
        this.balanceAvailable = app.context.getMeBalance();
        this.renderer.setBalance(this.balanceAvailable);
    }
}

app.createComponent(PlayerXocDia);