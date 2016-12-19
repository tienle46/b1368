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
    }

    _removeGlobalListener() {
        super._removeGlobalListener();

        this.scene.off(Events.ON_GAME_STATE, this._onGameState, this);
        this.scene.off(Events.XOCDIA_ON_PLAYER_BET, this._onPlayerBet, this);
        this.scene.off(Events.XOCDIA_ON_PLAYER_CANCELBET, this._onPlayerCancelBet, this);
        this.scene.off(Events.XOCDIA_ON_DISTRIBUTE_CHIP, this._onDistributeChip, this);
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

        // this.hucList = {};
        // this.biHucList = {};
        // this.pendingCuocBiens = {};
        // this.pendingBiCuocBiens = {};
        // this.currentCuocBien = 0;
        // this.setBetAmount(0);
        // this.renderer.hideCuocBienValue();
    }

    // _onGameMasterChanged(playerId, player) {
    //     if (this.id != playerId || !this.scene.isEnding()) return;

    //     this.showChangeMasterAnimation()
    // }

    onGameEnding() {
        super.onGameEnding();

        this.renderer.stopAllAnimation();
    }


    _onPlayerBet(data) {
        // if (!this.isItMe() || !this.board.scene.gamePlayers.master) return;
        if (data.playerId != this.id) return;

        let { playerId, betsList, isSuccess, err, isReplace } = data;
        this.betData = betsList;

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

    // getExcludeCuocBienPlayers() {
    //     return utils.getAllKeys(this.pendingCuocBiens, this.hucList, this.biHucList);
    // }

    // _onPlayerChangeBet(betAmount) {
    //     if (betAmount <= 0 || this.board.scene.gameState != app.const.game.state.STATE_BET || !BaCayUtils.checkBetValue(betAmount, this)) {
    //         //Show message && play sound invalid
    //         return;
    //     }

    //     app.service.send({
    //         cmd: app.commands.PLAYER_BET,
    //         data: {
    //             [app.keywords.PLAYER_BET_AMOUNT]: betAmount
    //         },
    //         room: this.board.room
    //     });
    // }

    // _onAddBetToMaster(amount, player) {

    //     if (this.isMaster && amount) {
    //         this.setBetAmount(this.betAmount + amount);
    //         this.renderer.showAddBetToMasterAnimation(amount, player);
    //     }
    // }

    // _handlePlayerBet(playerId, data) {
    //     if (this.id != playerId) return;

    //     let uBet = utils.getValue(data, app.keywords.PLAYER_BET_AMOUNT);
    //     let addToMasterBestAmount = uBet - this.betAmount;

    //     this.scene.emit(Events.ADD_BET_TO_MASTER, addToMasterBestAmount, this);
    //     this.setBetAmount(uBet);
    // }

    // setBetAmount(betAmount = 0) {

    //     if (!utils.isNumber(betAmount)) {
    //         betAmount = 0;
    //     }

    //     this.betAmount = betAmount;
    //     this.renderer.showBetAmount(this.betAmount);
    // }



    // _onPlayerDownCard() {
    //     if (this.isItMe()) {
    //         app.service.send({ cmd: app.commands.PLAYER_DOWN_CARD, data: {}, room: this.board.room });
    //     }
    // }

    // _onPlayerRevealCard() {
    //     if (this.isItMe()) {
    //         this.renderer.revealAllCards();
    //     }
    // }

    // createFakeCards(size = 0) {
    //     super.createFakeCards(0);
    // }

    // onClickCuocBienBtn() {
    //     let mePlayer = this.scene.gamePlayers.me;

    //     let { checkResult, msg } = BaCayUtils.checkCuocBienWithPlayer(mePlayer, this);
    //     if (!checkResult) {
    //         if (msg.length == 0) msg = app.res.string('game_bacay_khong_the_cuoc_bien');
    //         app.system.showToast(msg);
    //         this.renderer.showCuocBienBtn(false);
    //         return;
    //     }

    //     let maxCuocBienValue = BaCayUtils.calculateMaxCuocBien(mePlayer, this);
    //     if (maxCuocBienValue > 0) {
    //         this.scene.showCuocBienPopup(maxCuocBienValue, (cuocValue) => {
    //             let { valid, msg } = BaCayUtils.validateCuocBienValue(cuocValue, this.scene.gamePlayers.me, this);
    //             if (valid) {
    //                 app.service.send({
    //                     cmd: app.commands.BACAY_PLAYER_GA_HUC,
    //                     room: this.board.room,
    //                     data: {
    //                         [app.keywords.BACAY_BI_HUC_PLAYER_ID]: [this.id],
    //                         [app.keywords.BACAY_HUC_VALUE]: [cuocValue]
    //                     }
    //                 });

    //                 mePlayer.pendingCuocBiens[this.user.name] = cuocValue;
    //                 this.renderer.showCuocBienBtn(false);
    //             } else {
    //                 //     SoundUtil.playSound(SoundConstant.INVALID_SELECTION);
    //                 //     return;
    //             }
    //         });
    //     }
    // }

    // _onPlayerCuocBien(gaHucPlayerId, data) {
    //     if (!this.isItMe() || this.id == gaHucPlayerId) return;

    //     let gaHucPlayer = this.scene.gamePlayers.findPlayer(gaHucPlayerId);
    //     if (!gaHucPlayer) return;

    //     let mePlayer = this.scene.gamePlayers.me;
    //     let requestPlayerName = gaHucPlayer.user.name;
    //     let requestMoney = utils.getValue(data, app.keywords.BACAY_HUC_VALUE);
    //     let denyCb = () => delete mePlayer.pendingBiCuocBiens[requestPlayerName];
    //     let okCallback = () => {
    //         let { valid, msg } = gaHucPlayer && BaCayUtils.validateAcceptCuocBienValue(requestMoney, this, gaHucPlayer);

    //         if (valid) {
    //             app.service.send({
    //                 cmd: app.commands.BACAY_PLAYER_HUC_ACCEPTED,
    //                 room: this.board.room,
    //                 data: {
    //                     [app.keywords.BACAY_BI_HUC_PLAYER_ID]: this.scene.gamePlayers.me.id,
    //                     [app.keywords.BACAY_GA_HUC_PLAYER_ID]: gaHucPlayerId
    //                 }
    //             });
    //         } else {
    //             msg.length > 0 && app.system.info(msg);
    //         }
    //     };

    //     mePlayer.pendingBiCuocBiens[requestPlayerName] = requestMoney;
    //     app.system.confirm(
    //         app.res.string('game_bacay_ask_to_accept_cuoc_bien', { player: requestPlayerName, value: requestMoney }),
    //         denyCb,
    //         okCallback
    //     );
    // }

    // _updateCuocBienValue(value) {
    //     if (!utils.isNumber(value)) return;

    //     this.currentCuocBien += value;
    //     this.renderer.showCuocBienBtn(false);
    //     if (this.isItMe()) {
    //         this.renderer.showCuocBienValue(this.currentCuocBien);
    //     } else {
    //         this.renderer.showCuocBienValue(value);
    //     }
    // }

    // _onPlayerAcceptCuocBien(gaHucPlayerId, biHucPlayerId, data) {
    //     if (!this.isItMe()) return;

    //     console.log("_onPlayerAcceptCuocBien: ", gaHucPlayerId, biHucPlayerId);

    //     let gaHucPlayer = this.scene.gamePlayers.findPlayer(gaHucPlayerId);
    //     let biHucPlayer = this.scene.gamePlayers.findPlayer(biHucPlayerId);
    //     if (!biHucPlayer || !gaHucPlayer) return;

    //     let hucValue;
    //     let biHucName = biHucPlayer.user.name;
    //     let gaHucName = gaHucPlayer.user.name;

    //     if (gaHucPlayer.isItMe() && gaHucPlayer.pendingCuocBiens.hasOwnProperty(biHucName)) {
    //         // Truong hop minh la thang ga huc
    //         hucValue = gaHucPlayer.pendingCuocBiens[biHucName];
    //         delete gaHucPlayer.pendingCuocBiens[biHucName];
    //         gaHucPlayer.hucList[biHucName] = hucValue;
    //         //TODO notify huc
    //     }

    //     if (biHucPlayer.isItMe() && biHucPlayer.pendingBiCuocBiens.hasOwnProperty(gaHucName)) {
    //         hucValue = biHucPlayer.pendingBiCuocBiens[gaHucName];
    //         biHucPlayer.biHucList[gaHucName] = hucValue;
    //         delete biHucPlayer.pendingBiCuocBiens[gaHucName];
    //         //TODO notify bi huc
    //     }

    //     biHucPlayer._updateCuocBienValue(hucValue);
    //     gaHucPlayer._updateCuocBienValue(hucValue);

    //     gaHucPlayer.renderer.showCuocBienBtn(false);
    //     biHucPlayer.renderer.showCuocBienBtn(false);
    // }
}

app.createComponent(PlayerXocDia);