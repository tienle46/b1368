/**
 * Created by Thanh on 9/5/2016.
 */

import app from 'app';
import game from 'game';
import Card from 'Card';
import Events from 'Events';
import GameUtils from 'GameUtils';
import BaCayUtils from 'BaCayUtils';
import CardList from 'CardList';
import PlayerCardBetTurn from 'PlayerCardBetTurn';
import utils from "../../../utils/Utils";
import GameAnim from "../../components/anim/GameAnim";

export default class PlayerBaCay extends PlayerCardBetTurn {

    constructor(board, user) {
        super(board, user);

        this.betAmount = 0;
        this.hucList = null;
        this.biHucList = null;
        this.pendingCuocBiens = null;
        this.pendingBiCuocBiens = null;
        this.currentCuocBien = 0;
        this.gopGaValue = 0;
    }

    _addGlobalListener() {
        super._addGlobalListener();

        this.scene.on(Events.ON_CLICK_BET_BUTTON, this._onPlayerBet, this);
        this.scene.on(Events.ON_CLICK_DOWN_BUTTON, this._onPlayerDownCard, this);
        this.scene.on(Events.ON_CLICK_REVEAL_BUTTON, this._onPlayerRevealCard, this);
        this.scene.on(Events.HANDLE_PLAYER_BET, this._handlePlayerBet, this);
        this.scene.on(Events.HANDLE_PLAYER_DOWN_CARD, this._handlePlayerDown, this);
        this.scene.on(Events.ON_GAME_STATE, this._onGameState, this);
        this.scene.on(Events.ADD_BET_TO_MASTER, this._onAddBetToMaster, this);
        this.scene.on(Events.ON_PLAYER_BACAY_CHANGE_BET, this._onPlayerChangeBet, this);
        this.scene.on(Events.HANDLE_PLAYER_CUOC_BIEN, this._onPlayerCuocBien, this);
        this.scene.on(Events.HANDLE_PLAYER_ACCEPT_CUOC_BIEN, this._onPlayerAcceptCuocBien, this);
        this.scene.on(Events.SHOW_GAME_ENDING_INFO, this._onShowGameEndingInfo, this);
        this.scene.on(Events.ON_PLAYER_BACAY_GOP_GA, this._onPlayerGopGa, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();

        this.scene.off(Events.ON_CLICK_BET_BUTTON, this._onPlayerBet, this);
        this.scene.off(Events.ON_CLICK_DOWN_BUTTON, this._onPlayerDownCard, this);
        this.scene.off(Events.ON_CLICK_REVEAL_BUTTON, this._onPlayerRevealCard, this);
        this.scene.off(Events.HANDLE_PLAYER_BET, this._handlePlayerBet, this);
        this.scene.off(Events.HANDLE_PLAYER_DOWN_CARD, this._handlePlayerDown, this);
        this.scene.off(Events.ON_GAME_STATE, this._onGameState, this);
        this.scene.off(Events.ADD_BET_TO_MASTER, this._onAddBetToMaster, this);
        this.scene.off(Events.ON_PLAYER_BACAY_CHANGE_BET, this._onPlayerChangeBet, this);
        this.scene.off(Events.HANDLE_PLAYER_CUOC_BIEN, this._onPlayerCuocBien, this);
        this.scene.off(Events.HANDLE_PLAYER_ACCEPT_CUOC_BIEN, this._onPlayerAcceptCuocBien, this);
        this.scene.off(Events.SHOW_GAME_ENDING_INFO, this._onShowGameEndingInfo, this);
        this.scene.off(Events.ON_PLAYER_BACAY_GOP_GA, this._onPlayerGopGa, this);
    }

    _onPlayerGopGa(playerId, gopGaValue){
        if(playerId != this.id || gopGaValue <= 0) return;

        this.renderer.visibleGopGaIcon()
    }

    _onShowGameEndingInfo(playerId, { name = "", text = null, iconPath = "", balanceChanged = NaN, info = "", cards = [], isWinner = false } = {}){
        if(playerId != this.id || !this.isPlaying()) return;


        if(balanceChanged > 0){
            isWinner = true;
        }

        this.renderer.showAction(info);
        this.renderer.startPlusBalanceAnimation(balanceChanged, isWinner);
        this.setCards(cards, true);
    }

    getExcludeCuocBienPlayers() {
        return utils.getAllKeys(this.pendingCuocBiens, this.hucList, this.biHucList);
    }

    _onPlayerChangeBet(betAmount) {

        if (!this.isItMe() || betAmount <= 0 || this.board.scene.gameState != app.const.game.state.STATE_BET || !BaCayUtils.checkBetValue(betAmount, this)) {
            //Show message && play sound invalid
            return;
        }

        app.service.send({
            cmd: app.commands.PLAYER_BET,
            data: {
                [app.keywords.PLAYER_BET_AMOUNT]: betAmount
            },
            room: this.board.room
        });
    }

    _onAddBetToMaster(amount, player) {

        if (this.isMaster && amount) {
            this.setBetAmount(this.betAmount + amount);
            this.renderer.showAddBetToMasterAnimation(amount, player);
        }
    }

    _handlePlayerBet(playerId, data) {
        if (this.id != playerId) return;

        let uBet = utils.getValue(data, app.keywords.PLAYER_BET_AMOUNT);
        let addToMasterBestAmount = uBet - this.betAmount;

        this.scene.emit(Events.ADD_BET_TO_MASTER, addToMasterBestAmount, this);
        this.renderer.playBetAnimation(uBet);
        this.setBetAmount(uBet);
    }

    setBetAmount(betAmount = 0) {

        if (!utils.isNumber(betAmount)) betAmount = 0;

        this.betAmount = betAmount;
        this.renderer.showBetAmount(this.betAmount);
    }

    _handlePlayerDown(playerId, data) {
        if (this.id != playerId) return;
        let message = BaCayUtils.createPlayerHandCardInfo([...this.renderer.cardList.cards]);

        this.renderer.showAction(message);
        this.renderer.revealAllCards();

        if (this.isItMe()) {
            this.scene.emit(Events.SHOW_DOWN_CARD_CONTROLS, false);
        }
    }

    _onPlayerBet() {
        if (!this.isItMe() || !this.board.scene.gamePlayers.master) return;
        this.board.scene.showChooseBetSlider(this.betAmount, 10);
    }

    _onPlayerDownCard() {
        if (this.isItMe()) {
            app.service.send({ cmd: app.commands.PLAYER_DOWN_CARD, data: {}, room: this.board.room });
        }
    }

    _onPlayerRevealCard() {
        if (this.isItMe()) {
            this.renderer.revealAllCards();
        }
    }

    createFakeCards(size = 0) {
        super.createFakeCards(0);
    }

    onLoad() {
        super.onLoad();
        this.hucList = {};
        this.biHucList = {};
        this.pendingCuocBiens = {};
        this.pendingBiCuocBiens = {};
    }

    onEnable() {
        super.onEnable(this.getComponent('PlayerBaCayRenderer'));
    }

    _onGameRejoin(data) {
        super._onGameRejoin(data);
        // if (this.isPlaying() && !this.scene.isEnding() && !this.isItMe()) {
        //     let cards = Array(PlayerBaCay.DEFAULT_HAND_CARD_COUNT).fill(0).map(value => {return Card.from(value)});
        //     this.setCards(cards, false);
        // }

        if (data && data.hasOwnProperty(app.keywords.BACAY_BI_HUC_PLAYER_ID)) {
            // danh sach bi huc chua nhung thang huc minh
            let biHucPlayerId = utils.getValue(app.keywords.BACAY_BI_HUC_PLAYER_ID);
            let gaHucPlayerId = utils.getValue(app.keywords.BACAY_GA_HUC_PLAYER_LIST);
            let hucAmount = utils.getValue(app.keywords.BACAY_HUC_VALUE);

            for (let i = 0; i < biHucPlayerId.length; i++) {
                let biHucPlayer = this.scene.gamePlayers.findPlayer(biHucPlayerId[i]);
                let gaHucPlayer = this.scene.gamePlayers.findPlayer(gaHucPlayerId[i]);
                if (biHucPlayer == null || gaHucPlayer == null) {
                    continue;
                }

                let hucValue = hucAmount[i];

                if (this.equals(gaHucPlayer)) {
                    if (hucValue > 0) {
                        // minh di ga huc thang khac
                        this.hucList[biHucPlayer.user.name] = hucValue;

                        biHucPlayer._updateCuocBienValue(hucValue);
                        gaHucPlayer._updateCuocBienValue(hucValue);
                    } else {
                        this.pendingCuocBiens[biHucPlayer.user.name] = -1 * hucValue;
                    }
                } else if (this.equals(biHucPlayer)) {
                    // thang khac ga huc minh
                    this.biHucList[gaHucPlayer.user.name] = hucValue;

                    biHucPlayer._updateCuocBienValue(hucValue);
                    gaHucPlayer._updateCuocBienValue(hucValue);
                }
            }
        }
    }

    _onGameState(state, data, isJustJoined){

        if(state == app.const.game.state.STATE_BET && this.scene.gamePlayers.isMePlaying()) {
            this._onGameStateBet();
            !this.isItMe() && this.isPlaying() && this.renderer.showCuocBienBtn();
        }else{
            this.renderer.showCuocBienBtn(false);
            this.scene.hideChooseBetSlider();
        }

        if(!this.isItMe() || !this.isPlaying() || !this.scene.gamePlayers.isMePlaying()) return;

        if(state == app.const.game.state.STATE_BET){
            if(!this.isMaster && this.isPlaying() && this.scene.gamePlayers.isMePlaying()){
                this.scene.emit(Events.SHOW_BACAY_BET_CONTROLS);
                this.scene.showChooseBetSlider(this.betAmount);
            }
        }else if(state == app.const.game.state.STATE_DOWN) {
            if(this.isPlaying()) {
                this.scene.emit(Events.SHOW_DOWN_CARD_CONTROLS);
            }
        }
    }

    _onGameStateBet() {
        if (this.isPlaying() && !this.isMaster) {
            this.renderer.playBetAnimation(this.board.minBet);
            this.setBetAmount(this.board.minBet);
            this.scene.emit(Events.ADD_BET_TO_MASTER, this.board.minBet, this);
        }
    }

    onGameReset(){
        super.onGameReset();
        this.hucList = {};
        this.biHucList = {};
        this.pendingCuocBiens = {};
        this.pendingBiCuocBiens = {};
        this.currentCuocBien = 0;
        this.gopGaValue = 0;
        this.setBetAmount(0);
        this.renderer.hideCuocBienValue();
    }

    _onGameMasterChanged(playerId, player){
        if(this.id != playerId || !this.scene.isEnding()) return;

        this.showChangeMasterAnimation()
    }

    onGameEnding(){
        super.onGameEnding();

        this.renderer.stopAllAnimation();
    }

    onClickCuocBienBtn(){
        let mePlayer = this.scene.gamePlayers.me;

        let {checkResult, msg} = BaCayUtils.checkCuocBienWithPlayer(mePlayer, this);
        if(!checkResult){
            if(msg.length == 0) msg = app.res.string('game_bacay_khong_the_cuoc_bien');
            app.system.showToast(msg);
            this.renderer.showCuocBienBtn(false);
            return;
        }

        let maxCuocBienValue = BaCayUtils.calculateMaxCuocBien(mePlayer, this);
        if (maxCuocBienValue > 0) {
            this.scene.showCuocBienPopup(maxCuocBienValue, (cuocValue) => {
                let { valid, msg } = BaCayUtils.validateCuocBienValue(cuocValue, this.scene.gamePlayers.me, this);
                if (valid) {
                    app.service.send({
                        cmd: app.commands.BACAY_PLAYER_GA_HUC,
                        room: this.board.room,
                        data: {
                            [app.keywords.BACAY_BI_HUC_PLAYER_ID]: [this.id],
                            [app.keywords.BACAY_HUC_VALUE]: [cuocValue]
                        }
                    });

                    mePlayer.pendingCuocBiens[this.user.name] = cuocValue;
                    this.renderer.showCuocBienBtn(false);
                } else {
                    //     SoundUtil.playSound(SoundConstant.INVALID_SELECTION);
                    //     return;
                }
            });
        }
    }

    _onPlayerCuocBien(gaHucPlayerId, data) {
        if (!this.isItMe() || this.id == gaHucPlayerId) return;

        let gaHucPlayer = this.scene.gamePlayers.findPlayer(gaHucPlayerId);
        if(!gaHucPlayer) return;

        let mePlayer = this.scene.gamePlayers.me;
        let requestPlayerName = gaHucPlayer.user.name;
        let requestMoney = utils.getValue(data, app.keywords.BACAY_HUC_VALUE);
        let denyCb = () => delete mePlayer.pendingBiCuocBiens[requestPlayerName];
        let okCallback = () => {
            let {valid, msg} = gaHucPlayer && BaCayUtils.validateAcceptCuocBienValue(requestMoney, this, gaHucPlayer);

            if(valid){
                app.service.send({
                    cmd: app.commands.BACAY_PLAYER_HUC_ACCEPTED,
                    room: this.board.room,
                    data: {
                        [app.keywords.BACAY_BI_HUC_PLAYER_ID]: this.scene.gamePlayers.me.id,
                        [app.keywords.BACAY_GA_HUC_PLAYER_ID]: gaHucPlayerId
                    }
                });
            }else{
                msg.length > 0 && app.system.info(msg);
            }
        };

        mePlayer.pendingBiCuocBiens[requestPlayerName] = requestMoney;
        app.system.confirm(
            app.res.string('game_bacay_ask_to_accept_cuoc_bien', {player: requestPlayerName, value: requestMoney}),
            denyCb,
            okCallback
        );
    }

    _updateCuocBienValue(value){
        if(!utils.isNumber(value)) return;

        this.currentCuocBien += value;
        this.renderer.showCuocBienBtn(false);
        if(this.isItMe()){
            this.renderer.showCuocBienValue(this.currentCuocBien);
        }else{
            this.renderer.showCuocBienValue(value);
        }
    }

    _onPlayerAcceptCuocBien(gaHucPlayerId, biHucPlayerId, data){
        if(!this.isItMe()) return;

        let gaHucPlayer = this.scene.gamePlayers.findPlayer(gaHucPlayerId);
        let biHucPlayer = this.scene.gamePlayers.findPlayer(biHucPlayerId);
        if (!biHucPlayer || !gaHucPlayer) return;

        let hucValue;
        let biHucName = biHucPlayer.user.name;
        let gaHucName = gaHucPlayer.user.name;

        if (gaHucPlayer.isItMe() && gaHucPlayer.pendingCuocBiens.hasOwnProperty(biHucName)) {
            // Truong hop minh la thang ga huc
            hucValue = gaHucPlayer.pendingCuocBiens[biHucName];
            delete gaHucPlayer.pendingCuocBiens[biHucName];
            gaHucPlayer.hucList[biHucName] = hucValue;
            //TODO notify huc
        }

        if (biHucPlayer.isItMe() && biHucPlayer.pendingBiCuocBiens.hasOwnProperty(gaHucName)) {
            hucValue = biHucPlayer.pendingBiCuocBiens[gaHucName];
            biHucPlayer.biHucList[gaHucName] = hucValue;
            delete biHucPlayer.pendingBiCuocBiens[gaHucName];
            //TODO notify bi huc
        }

        biHucPlayer._updateCuocBienValue(hucValue);
        gaHucPlayer._updateCuocBienValue(hucValue);

        gaHucPlayer.renderer.showCuocBienBtn(false);
        biHucPlayer.renderer.showCuocBienBtn(false);
    }
}

PlayerBaCay.DEFAULT_HAND_CARD_COUNT = 3

app.createComponent(PlayerBaCay);
