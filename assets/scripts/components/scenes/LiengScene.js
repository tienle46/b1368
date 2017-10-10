/**
 * Created by Thanh on 10/31/2016.
 */

import app from 'app';
import GameScene from 'GameScene';
import Events from 'GameEvents';
import Utils from 'GeneralUtils';
import LiengSlider from 'LiengSlider'

export default class LiengScene extends GameScene {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            /**
             * @type {cc.Node}
             */
            chooseBetSliderNode: LiengSlider
        });

        /**
         * @type {HorizontalBetPopup}
         * @private
         */
        this.isShowBetPopup = false;
        
        this._betPhaseDuration = 0;
        this._startBetPhaseTime = 0; // ms
    }

    onLoad() {
        super.onLoad();
        this._betPhaseDuration = 0;
        this._startBetPhaseTime = 0; // ms
    }

    onEnable() {
        this.board = this.boardNode.getComponent('BoardLieng');
        this.gameControls = this.gameControlsNode.getComponent('BaCayControls');
        this.playerPositions = this.playerPositionAnchorsNode.getComponent('FivePlayerPositions');

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
    
    
    /**
     * 
     * @param {any} currentValue accepted value on the board
     * @param {any} maxValue user's amount
     * @param {number} [timeout=20] 
     * @returns 
     * @memberof LiengScene
     */
    showChooseBetSlider(currentValue, maxValue) {
        // let maxValue = this.board.minBet * 5;
        let divisor = this.board.minBet
        let boardValue = this.board.totalBetAmount
        let minValue = currentValue
        let userMoney = this.board.gamePlayers.me.balance
        
        if(maxValue < minValue) {
            app.system.showToast(app.res.string('game_not_enough_balance_to_bet'));
            return;
        }
        
        this.chooseBetSliderNode.show({
            divisor,
            boardValue,
            minValue,
            userMoney
        });
    }

    hideChooseBetSlider() {
        this.chooseBetSliderNode.hide();
    }

    _onClickChooseBetButton() {
        let amount = this.chooseBetSliderNode.getCurrentValue()
        amount && this.emit(Events.ON_PLAYER_CHANGED_BET, amount);
    }
}

app.createComponent(LiengScene);