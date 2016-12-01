/**
 * Created by Thanh on 10/31/2016.
 */

import app from 'app';
import GameScene from 'GameScene';
import Events from 'Events';

export default class BaCayScene extends GameScene {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            /**
             * @type {cc.Node}
             */
            chooseBetSliderNode: cc.Node
        }

        /**
         * @type {BetSlider}
         * @private
         */
        this._betSlider = null;
    }

    onLoad(){
        super.onLoad();
    }

    onEnable(){
        this.board = this.boardNode.getComponent('BoardBaCay');
        this.gameControls = this.gameControlsNode.getComponent('BaCayControls');
        this.playerPositions = this.playerPositionAnchorsNode.getComponent('SixPlayerPositions');
        this.gameResultPopup = this.gameResultPopupNode.getComponent('GameResultPopup');
        this._betSlider = this.chooseBetSliderNode.getComponent('BetSlider');

        super.onEnable();

        this.on(Events.ON_CLICK_CHOOSE_BET_BUTTON, this._onClickChooseBetButton, this);
    }

    showChooseBetSlider(currentValue){
        let maxValue = this.board.minBet * 5;
        let minBet = this.board.minBet;
        this._betSlider && this._betSlider.show(minBet, maxValue, currentValue);
    }

    hideChooseBetSlider(){
        this._betSlider && this._betSlider.hide();
    }

    _onClickChooseBetButton(){
        let amount = this._betSlider.getAmountNumber();
        this.emit(Events.ON_PLAYER_BACAY_CHANGE_BET, amount);
    }
}

app.createComponent(BaCayScene);

