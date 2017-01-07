/**
 * Created by Thanh on 10/31/2016.
 */

import app from 'app';
import GameScene from 'GameScene';
import Events from 'Events';
import HorizontalBetPopup from 'HorizontalBetPopup';

export default class XocDiaScene extends GameScene {
    constructor() {
        super();

        this.properties = {
            ...this.properties
        }

        /**
         * @type {HorizontalBetPopup}
         * @private
         */
        this._betPopup = null;
    }

    onLoad() {
        super.onLoad();
    }

    onEnable() {
        this.board = this.boardNode.getComponent('BoardXocDia');
        this.gameControls = this.gameControlsNode.getComponent('XocDiaControls');
        this.playerPositions = this.playerPositionAnchorsNode.getComponent('NinePlayerPositions');
        // this.gameResultPopup = this.gameResultPopupNode.getComponent('GameResultPopup');

        super.onEnable();

        this.on(Events.ON_CLICK_CHOOSE_BET_BUTTON, this._onClickChooseBetButton, this);
    }

    showCuocBienPopup(maxValue, cb) {
        this._betPopup && this._betPopup.show({
            minValue: 0,
            maxValue,
            currentValue: 0,
            timeout: 10,
            cb,
            title: app.res.string('game_bacay_cuoc_bien')
        });
    }

    showChooseBetSlider(currentValue) {
        let maxValue = this.board.minBet * 5;
        let minValue = this.board.minBet;
        this._betPopup && this._betPopup.show({
            submitOnHide: true,
            minValue,
            maxValue,
            currentValue,
            cb: (betValue) => {
                this._onClickChooseBetButton(betValue);
            }
        });
    }

    hideChooseBetSlider() {
        this._betPopup && this._betPopup.hide();
    }

    _onClickChooseBetButton(value) {
        let amount = value || this._betPopup.getAmountNumber();
        this.emit(Events.ON_PLAYER_BACAY_CHANGE_BET, amount);
    }

    enoughPlayerToStartGame() {
        return this.gamePlayers.players.length > 0;
    }
}

app.createComponent(XocDiaScene);