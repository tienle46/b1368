/**
 * Created by Thanh on 10/31/2016.
 */

import app from 'app';
import GameScene from 'GameScene';
import Events from 'Events';
import HorizontalBetPopup from 'HorizontalBetPopup';
import BaCayUtils from "../../game/games/bacay/BaCayUtils";

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
         * @type {HorizontalBetPopup}
         * @private
         */
        this._betPopup = null;
    }

    onLoad() {
        super.onLoad();
    }

    onEnable() {
        this.board = this.boardNode.getComponent('BoardBaCay');
        this.gameControls = this.gameControlsNode.getComponent('BaCayControls');
        this.playerPositions = this.playerPositionAnchorsNode.getComponent('BaCayPlayerPositions');
        this.gameResultPopup = this.gameResultPopupNode.getComponent('GameResultPopup');
        this._betPopup = this.chooseBetSliderNode.getComponent('HorizontalBetPopup');

        super.onEnable();

        this.on(Events.ON_CLICK_CHOOSE_BET_BUTTON, this._onClickChooseBetButton, this);
    }

    showCuocBienPopup(maxValue, cb) {

        if(maxValue < this.board.minBet) {
            app.system.showToast(app.res.string('game_not_enough_balance_to_cuoc_bien'));
            return;
        }

        this._betPopup && this._betPopup.show({
            minValue: this.board.minBet,
            maxValue,
            currentValue: 0,
            timeout: 10,
            cb,
            title: app.res.string('game_bacay_cuoc_bien')
        });
    }

    showChooseBetSlider(currentValue) {
        // let maxValue = this.board.minBet * 5;
        let minValue = this.board.minBet;
        let maxValue = BaCayUtils.calculateMaxPlayerBet(this.gamePlayers.me, this.gamePlayers.master);

        if(maxValue < minValue) {
            app.system.showToast(app.res.string('game_not_enough_balance_to_bet'));
            return;
        }

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
}

app.createComponent(BaCayScene);