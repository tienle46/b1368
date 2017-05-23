/**
 * Created by Thanh on 10/31/2016.
 */

import app from 'app';
import GameScene from 'GameScene';
import Events from 'Events';
import HorizontalBetPopup from 'HorizontalBetPopup';
import BaCayUtils from "../../game/games/bacay/BaCayUtils";
import Utils from 'Utils';

export default class BaCayScene extends GameScene {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            /**
             * @type {cc.Node}
             */
            chooseBetSliderNode: cc.Node,
            testPlayerNode: cc.Node
        }

        /**
         * @type {HorizontalBetPopup}
         * @private
         */
        this._betPopup = null;
        this.isShowBetPopup = false;
        this.isShowCuocBienPopup = false;
        
        this._betPhaseDuration = 0;
        this._startBetPhaseTime = 0; // ms
    }

    onLoad() {
        super.onLoad();
        this._betPhaseDuration = 0;
        this._startBetPhaseTime = 0; // ms
    }

    onEnable() {
        this.board = this.boardNode.getComponent('BoardBaCay');
        this.gameControls = this.gameControlsNode.getComponent('BaCayControls');
        this.playerPositions = this.playerPositionAnchorsNode.getComponent('BaCayPlayerPositions');
        this._betPopup = this.chooseBetSliderNode.getComponent('HorizontalBetPopup');

        super.onEnable();
        
        this.on(Events.ON_GAME_STATE_PRE_CHANGE, this._onGameStatePreChange, this, 0);
        this.on(Events.ON_CLICK_CHOOSE_BET_BUTTON, this._onClickChooseBetButton, this);
    }
    
    _onGameStatePreChange(boardState, data) {
        if(boardState === app.const.game.state.BOARD_STATE_BET) {
            this._betPhaseDuration = Utils.getValue(data, app.keywords.BOARD_PHASE_DURATION);
            this._startBetPhaseTime = new Date().getTime();
        }
        
        //TODO Process board state changed here
    }
    
    showCuocBienPopup(maxValue, cb) {
        this.isShowBetPopup = false
        this.isShowCuocBienPopup = true
        let remainTime = parseInt(this._betPhaseDuration - (new Date().getTime() - this._startBetPhaseTime)/1000 - 1);
        if(remainTime > 0) {
            if(maxValue < this.board.minBet) {
                app.system.showToast(app.res.string('game_not_enough_balance_to_cuoc_bien'));
                return;
            }

            this._betPopup && this._betPopup.show({
                minValue: this.board.minBet,
                maxValue,
                currentValue: 0,
                timeout: remainTime,
                cb,
            });
        }
        
    }

    showChooseBetSlider(currentValue, maxValue, timeout = 5) {
        // let maxValue = this.board.minBet * 5;


        this.isShowBetPopup = true
        this.isShowCuocBienPopup = false

        let minValue = this.board.minBet;

        if(maxValue < minValue) {
            app.system.showToast(app.res.string('game_not_enough_balance_to_bet'));
            return;
        }

        this._betPopup && this._betPopup.show({
            minValue,
            maxValue,
            currentValue,
            timeout,
            cb: (betValue) => {
                this.onHideChooseBetSlider()
                betValue !== undefined && this._onClickChooseBetButton(betValue);
            },
            title: app.res.string('game_bet_time')
        });
    }

    onHideChooseBetSlider(){
        this.isShowBetPopup = false
        this.isShowCuocBienPopup = false
        this.gamePlayers.me.handlePendingCuocBienRequests();
    }

    hideChooseBetSlider() {
        this._betPopup && this._betPopup.hide();
        this.onHideChooseBetSlider()
    }

    _onClickChooseBetButton(value) {
        let amount = value || this._betPopup.getAmountNumber();
        this.emit(Events.ON_PLAYER_BACAY_CHANGE_BET, amount);
    }
}

app.createComponent(BaCayScene);