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

export default class PlayerBaCay extends PlayerCardBetTurn {

    static get DEFAULT_HAND_CARD_COUNT() {
        return 3
    };

    constructor(board, user) {
        super(board, user);

        this.betAmount = 0;
    }

    _addGlobalListener() {
        super._addGlobalListener();

        this.board.scene.on(Events.ON_CLICK_BET_BUTTON, this._onPlayerBet, this);
        this.board.scene.on(Events.ON_CLICK_DOWN_BUTTON, this._onPlayerDownCard, this);
        this.board.scene.on(Events.ON_CLICK_REVEAL_BUTTON, this._onPlayerRevealCard, this);
        this.board.scene.on(Events.HANDLE_PLAYER_BET, this._handlePlayerBet, this);
        this.board.scene.on(Events.HANDLE_PLAYER_DOWN_CARD, this._handlePlayerDown, this);
        this.board.scene.on(Events.ON_GAME_STATE, this._onGameState, this);
        this.board.scene.on(Events.ADD_BET_TO_MASTER, this._onAddBetToMaster, this);
        this.board.scene.on(Events.ON_PLAYER_BACAY_CHANGE_BET, this._onPlayerChangeBet, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();

        this.board.scene.off(Events.ON_CLICK_BET_BUTTON, this._onPlayerBet, this);
        this.board.scene.off(Events.ON_CLICK_DOWN_BUTTON, this._onPlayerDownCard, this);
        this.board.scene.off(Events.ON_CLICK_REVEAL_BUTTON, this._onPlayerRevealCard, this);
        this.board.scene.off(Events.HANDLE_PLAYER_BET, this._handlePlayerBet, this);
        this.board.scene.off(Events.HANDLE_PLAYER_DOWN_CARD, this._handlePlayerDown, this);
        this.board.scene.off(Events.ON_GAME_STATE, this._onGameState, this);
        this.board.scene.off(Events.ADD_BET_TO_MASTER, this._onAddBetToMaster, this);
        this.board.scene.off(Events.ON_PLAYER_BACAY_CHANGE_BET, this._onPlayerChangeBet, this);
    }

    _onPlayerChangeBet(betAmount){
        if (betAmount <= 0 || this.board.scene.gameState != app.const.game.state.STATE_BET || !BaCayUtils.checkBetValue(betAmount, this)) {
            //Show message && play sound invalid
            return;
        }

        app.service.send({cmd: app.commands.PLAYER_BET, data: {[app.keywords.PLAYER_BET_AMOUNT]: 10}, room: this.board.room});
    }

    _onAddBetToMaster(amount, player){
        if(this.isMaster && amount){
            this.setBetAmount(this.betAmount + amount);
            this.renderer.showAddBetToMasterAnimation(amount);
        }
    }

    _handlePlayerBet(playerId, data){
        if(this.id != playerId) return;

        let uBet = utils.getValue(data, app.keywords.PLAYER_BET_AMOUNT);
        let addToMasterBestAmount = uBet - this.betAmount;

        this.emit(Events.ADD_BET_TO_MASTER, addToMasterBestAmount, this);
        this.setBetAmount(uBet);
    }

    setBetAmount(betAmount){

        if(!utils.isNumber(betAmount)){
            betAmount = 0;
        }

        this.betAmount = betAmount;
        this.renderer.showBetAmount(this.betAmount);
    }

    _handlePlayerDown(playerId, data){
        if(this.id != playerId) return;

        this.renderer.revealAllCards();
    }

    _onPlayerBet(){
        if (!this.isItMe() || !this.board.scene.gamePlayers.master) return;
        this.board.scene.showChooseBetSlider(this.betAmount);
    }

    _onPlayerDownCard(){
        if(this.isItMe()){
            app.service.send({cmd: app.commands.PLAYER_DOWN_CARD, data: {}, room: this.board.room});
        }
    }

    _onPlayerRevealCard(){
        if(this.isItMe()){
            this.renderer.revealAllCards();
        }
    }

    createFakeCards(size = 0) {
        super.createFakeCards(0);
    }

    onEnable() {
        super.onEnable(this.getComponent('PlayerBaCayRenderer'));
    }

    _onGameRejoin(data) {
        super._onGameRejoin(data);
        if (this.isPlaying() && !this.scene.isEnding() && !this.isItMe()) {
            let cards = Array(PlayerBaCay.DEFAULT_HAND_CARD_COUNT).fill(0).map(value => {return Card.from(value)});
            this.setCards(cards, false);
        }
    }

    _onGameState(state, data, isJustJoined){
        this._onGameStateBet();

        if(!this.isItMe()) return;

        if(state == app.const.game.state.STATE_BET){
            this.scene.emit(Events.SHOW_BACAY_BET_CONTROLS);
        }else if(state == app.const.game.state.STATE_DOWN) {
            this.scene.hideChooseBetSlider();
            this.scene.emit(Events.SHOW_DOWN_CARD_CONTROLS);
        }
    }

    _onGameStateBet(){
        if(this.isPlaying() && !this.isMaster){
            this.setBetAmount(this.board.minBet);
            this._onAddBetToMaster(this.board.minBet, this);
        }
    }

    onGameReset(){
        super.onGameReset();
        this.setBetAmount(0);
    }
}

app.createComponent(PlayerBaCay);
