import app from 'app';
import game from 'game';
import Card from 'Card';
import Events from 'Events';
import GameUtils from 'GameUtils';
import BaCayUtils from 'BaCayUtils';
import CardList from 'CardList';
import PlayerCardBetTurn from 'PlayerCardBetTurn';
import utils from "../../../utils/Utils";

export default class PlayerXocDia extends PlayerCardBetTurn {

    static get DEFAULT_HAND_CARD_COUNT() {
        return 3;
    }

    constructor(board, user) {
        super(board, user);

        this.betAmount = 0;
        this.hucList = null;
        this.biHucList = null;
        this.pendingCuocBiens = null;
        this.pendingBiCuocBiens = null;
        this.currentCuocBien = 0;

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
    }

    _onDistributeChip(data) {
        let { playingPlayerIds, bets, playerResults, dots } = data;
        let winner = playerResults.find(result => result === 1);

        if (winner) {
            let playerWinerIndex = playerResults.findIndex(result => result === 1);
            let playerId = playingPlayerIds[playerWinerIndex];
            if (!playerId || playerId != this.id)
                return;
            // remove it for other user
            playerResults[playerWinerIndex] = undefined;

            let { myPos } = this._getPosBasedOnWorldSpace(playerId);
            let userPos = myPos;
            let previousDataTypes = bets[playerWinerIndex];

            // user will be get chip after dealer got it
            setTimeout(() => {
                this.scene.emit(Events.XOCDIA_ON_PLAYER_RECEIVE_CHIP_ANIMATION, { userPos, previousDataTypes, dots });
            }, 500);
        }
        return;
    }

    _onPlayerChangeMoneyAnim(data) {
        let { playerId, balance } = data;
        if (playerId !== this.id)
            return;
        console.debug('_onPlayerChangeMoneyAnim', playerId, balance);
        this.renderer.startPlusBalanceAnimation(balance);
    }

    _onGameRejoin(data) {
        super._onGameRejoin(data);
        // if (this.isPlaying() && !this.scene.isEnding() && !this.isItMe()) {
        //     let cards = Array(PlayerBaCay.DEFAULT_HAND_CARD_COUNT).fill(0).map(value => {return Card.from(value)});
        //     this.setCards(cards, false);
        // }

        // if (data && data.hasOwnProperty(app.keywords.BACAY_BI_HUC_PLAYER_ID)) {
        //     // danh sach bi huc chua nhung thang huc minh
        //     let biHucPlayerId = utils.getValue(app.keywords.BACAY_BI_HUC_PLAYER_ID);
        //     let gaHucPlayerId = utils.getValue(app.keywords.BACAY_GA_HUC_PLAYER_LIST);
        //     let hucAmount = utils.getValue(app.keywords.BACAY_HUC_VALUE);

        //     for (let i = 0; i < biHucPlayerId.length; i++) {
        //         let biHucPlayer = this.scene.gamePlayers.findPlayer(biHucPlayerId[i]);
        //         let gaHucPlayer = this.scene.gamePlayers.findPlayer(gaHucPlayerId[i]);
        //         if (biHucPlayer == null || gaHucPlayer == null) {
        //             continue;
        //         }

        //         let hucValue = hucAmount[i];

        //         if (this.equals(gaHucPlayer)) {
        //             if (hucValue > 0) {
        //                 // minh di ga huc thang khac
        //                 this.hucList[biHucPlayer.user.name] = hucValue;

        //                 biHucPlayer._updateCuocBienValue(hucValue);
        //                 gaHucPlayer._updateCuocBienValue(hucValue);
        //             } else {
        //                 this.pendingCuocBiens[biHucPlayer.user.name] = -1 * hucValue;
        //             }
        //         } else if (this.equals(biHucPlayer)) {
        //             // thang khac ga huc minh
        //             this.biHucList[gaHucPlayer.user.name] = hucValue;

        //             biHucPlayer._updateCuocBienValue(hucValue);
        //             gaHucPlayer._updateCuocBienValue(hucValue);
        //         }
        //     }
        // }

    }

    _onGameState(state, data, isJustJoined) {
        // if (state == app.const.game.state.STATE_BET) {
        //     this._onGameStateBet();
        //     !this.isItMe() && this.scene.gamePlayers.isMePlaying() && this.renderer.showCuocBienBtn();
        // } else {
        //     this.renderer.showCuocBienBtn(false);
        //     this.scene.hideChooseBetSlider();
        // }

        // if (!this.isItMe() || !this.isPlaying() || !this.scene.gamePlayers.isMePlaying()) return;

        // if (state == app.const.game.state.STATE_BET) {
        //     if (!this.isMaster) {
        //         this.scene.emit(Events.SHOW_BACAY_BET_CONTROLS);
        //         this.scene.showChooseBetSlider(this.betAmount);
        //     }
        // } else if (state == app.const.game.state.STATE_DOWN) {
        //     this.scene.emit(Events.SHOW_DOWN_CARD_CONTROLS);
        // }
    }

    _onGameStateBet() {
        debug('_onGameStateBet PlayerXocDia')
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
        this.betData = [...this.betData, ...betsList];

        if (isSuccess) {
            let { myPos, isItMe } = this._getPosBasedOnWorldSpace(playerId);
            this.scene.emit(Events.XOCDIA_ON_PLAYER_TOSSCHIP_ANIMATION, { myPos, betsList, isItMe, playerId, isReplace });
        } else {
            console.error('PlayerXocDia.js > _onPlayerBet', err);
        }

    }

    _getPosBasedOnWorldSpace(playerId) {
        let isItMe = this.scene.gamePlayers.isItMe(playerId);
        let myPos = this.scene.gamePlayers.playerPositions.getPlayerAnchorByPlayerId(playerId, isItMe);
        let node = this.node.parent ? this.node.parent : this.node;
        myPos = node.convertToWorldSpaceAR(myPos);

        return { myPos, isItMe };
    }

    _onPlayerCancelBet(data) {
        if (data.playerId != this.id) return;
        let betsList = this.betData;
        let { playerId, isSuccess, err } = data;
        if (isSuccess) {
            let myPos = this.scene.gamePlayers.playerPositions.getPlayerAnchorByPlayerId(playerId, isItMe);
            let isItMe = this.scene.gamePlayers.isItMe(playerId);

            this.scene.emit(Events.XOCDIA_ON_PLAYER_CANCEL_BET_SUCCESS, { myPos, isItMe, betsList });
            this.betData = [];
        } else {
            console.error('PlayerXocDia.js > _onPlayerCancelBet', err);
        }
    }

}

app.createComponent(PlayerXocDia);