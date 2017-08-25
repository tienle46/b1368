/**
 * Created by Thanh on 10/31/2016.
 */

import app from 'app';
import GameScene from 'GameScene';
import Events from 'GameEvents';
import Utils from 'GeneralUtils';

export default class LiengScene extends GameScene {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            /**
             * @type {cc.Node}
             */
            chooseBetSliderNode: cc.Node,
            testPlayerNode: cc.Node
        });

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
        this.board = this.boardNode.getComponent('BoardLieng');
        this.gameControls = this.gameControlsNode.getComponent('BaCayControls');
        this.playerPositions = this.playerPositionAnchorsNode.getComponent('FivePlayerPositions');
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
    

    showChooseBetSlider(currentValue, maxValue, timeout = 20) {
        // let maxValue = this.board.minBet * 5;

        let minValue = this.board.minBet;

        if(maxValue < minValue) {
            app.system.showToast(app.res.string('game_not_enough_balance_to_bet'));
            return;
        }
        
        if(maxValue < currentValue) {
            maxValue = currentValue;
        }
        
        minValue = currentValue;
        
        this._betPopup && this._betPopup.show({
            minValue,
            maxValue,
            currentValue,
            timeout,
            cb: this._onClickChooseBetButton,
            ctx: this,
            title: app.res.string('game_bet_time')
        });
    }

    hideChooseBetSlider() {
        this._betPopup && this._betPopup.hide();
    }

    _onClickChooseBetButton(value) {
        let amount = value || this._betPopup.getAmountNumber()
        this.emit(Events.ON_PLAYER_CHANGED_BET, amount);
    }
}

app.createComponent(LiengScene);