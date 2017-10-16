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
            betSlider: LiengSlider
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
    showChooseBetSlider(currentValue, userMoney) {
        if(this.betSlider.node.active == true)
            return
            
        // let maxValue = this.board.minBet * 5;
        let divisor = this.board.minBet * 2
        let boardValue = this.board.totalBetAmount
        let minValue = currentValue || divisor
        
        if(userMoney < divisor) {
            app.system.showToast(app.res.string('game_not_enough_balance_to_bet'));
            return;
        }
            
        this.betSlider.show({
            divisor,
            boardValue,
            minValue,
            userMoney
        });
    }

    hideChooseBetSlider() {
        this.betSlider.hide();
    }

    getChoosenBetAmount() {
        return this.betSlider.getCurrentValue()
    }
    
    setSliderValues(value) {
        this.betSlider.setValues(value)
    }
}

app.createComponent(LiengScene);