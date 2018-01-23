import app from 'app';
import SFS2X from 'SFS2X';
import Utils from 'GeneralUtils';
import Linking from 'Linking';
import MiniPokerErrorCode from "./MiniPokerErrorCode";

export default class MiniPokerContext {
    constructor () {
        this.jackpotValues = [];
        this.betValues = [];
        this.subInterval = 0;
        this.spinInterval = 0;
        this.curBetValue = 0;
        this.selectedBet = 0;
        this.lastSpinTime = 0;
        this.prizeConfig = null;
        this.enabled = true;
        this.isQuickSpin = false;

        this.resultQueue = [];

        this.isLoadedConfig = false;
        this.popup = null;

        this._registerEventListeners();

        this.sendGetConfig();
    }

    getCurJackpotMoney() {
        var curJackpot = this.jackpotValues[this.selectedBet] || 0;
        return curJackpot;
    }

    _registerEventListeners() {
        // this._removeEventListeners();

        app.system.addListener(app.commands.MINIGAME_MINI_POKER_GET_CONFIG, this._onReceivedConfig, this);
        app.system.addListener(app.commands.MINIGAME_MINI_POKER_SYNC_JACKPOT_VALUES, this._onReceivedJackpotSync, this);
        app.system.addListener(app.commands.MINIGAME_MINI_POKER_PLAY, this._onReceivedPlayResult, this);
        // app.system.addListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
    }

    _removeEventListeners() {
        app.system.removeListener(app.commands.MINIGAME_MINI_POKER_GET_CONFIG, this._onReceivedConfig, this);
        app.system.removeListener(app.commands.MINIGAME_MINI_POKER_SYNC_JACKPOT_VALUES, this._onReceivedJackpotSync, this);
        app.system.removeListener(app.commands.MINIGAME_MINI_POKER_PLAY, this._onReceivedPlayResult, this);
        // app.system.removeListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
    }

    _onReceivedConfig(data) {
        // warn('config', data);
        this.loadConfig(data);
    }

    _onReceivedJackpotSync(data) {
        // warn('Jackpot sync', data);

        this.jackpotValues = data.jackpotValues;
        this.popup && this.popup.updateJarMoneys();
    }

    _onReceivedPlayResult(data) {
        warn ('Result', data);
        if (data.results) {
            data.results.forEach(result => {
                this.resultQueue.push(result);
            });
        } else {
            this.resultQueue.push(data);
        }

        if (this.resultQueue.length > 0 && !this.popup.isSpinning) {
            this._displayResult();
        }
    }

    checkResultQueue() {
        if (this.resultQueue.length > 0) {
            this._displayResult();
            return true;
        }
        return false;
    }

    checkCurrentMoney() {
        if (app.context.getMeBalance() < this.curBetValue) {
            // this.popup && this.popup.showError({message: "Bạn không đủ tiền đẻ chơi tiếp."});
            this.popup && this.popup.disableAutoSpin();
            app.system.confirm(
                app.res.string("Bạn không đủ chip để chơi tiếp, nạp thêm nha."),
                null,
                this._showTopup
            );
            return false;
        }
        return true;
    }

    _showTopup() {
        app.visibilityManager.goTo(Linking.ACTION_TOPUP)
    }

    _displayResult() {
        warn('display result');
        var data = this.resultQueue.splice(0, 1)[0];

        if (data.error) {
            if (data.error.code === MiniPokerErrorCode.INACTIVE.code ||
                data.error.code === MiniPokerErrorCode.INITIATE_JACKPOT_FAIL.code)
            {
                this.popup && this.popup.disableMiniPoker();
            }
            this.popup && this.popup.showError(data.error);
            return;
        }

        this.updateLastSpinTime();
        var newBalance = data.ba;
        app.context.setBalance(newBalance);
        this.popup && this.popup.showResult(data);
    }

    _onUserVariablesUpdate(data) {
        // warn('user variable update', data);
        if (data.changedVars.indexOf(app.keywords.USER_VARIABLE_BALANCE)) {
            var newBalance = Utils.getVariable(data, app.keywords.USER_VARIABLE_BALANCE, app.context.getMeBalance());
            app.context.setBalance(newBalance);
        }

        // this.popup && this.popup.updateBalance();
    }

    sendSubscribe() {
        // warn('send subscribe');
        app.service.send({cmd: app.commands.MINIGAME_MINI_POKER_SUBSCRIBE});
    }

    sendGetConfig() {
        app.service.send({cmd: app.commands.MINIGAME_MINI_POKER_GET_CONFIG});
        // warn('send get config');
    }

    sendPlay(betAmount) {
        app.service.send({
            cmd: app.commands.MINIGAME_MINI_POKER_PLAY,
            data: {
                bet: betAmount,
                quickPlay: this.isQuickSpin
            }
        });
    }

    updateLastSpinTime() {
        this.lastSpinTime = this.getCurrentTime();
    }

    loadConfig(data) {
        this.jackpotValues = data.jackpotValues;
        this.betValues = data.bets;
        this.subInterval = data.subInterval;
        this.spinInterval = data.spinInterval + 200;
        this.quickSpinInterval = data.quickInterval + 200 || 1500;
        this.curBetValue = this.betValues[this.selectedBet];
        this.prizeConfig = data.prizeConfig;

        this.isLoadedConfig = true;

        if(this.popup) {
            this.popup.loadBetConfig();
            this.popup.updateJarMoneys();
        }
    }

    updateCurBet(selectedBetIdx) {
        this.selectedBet = selectedBetIdx;
        this.curBetValue = this.betValues[this.selectedBet];
    }

    getMaxAnimDuration() {
        if (this.isQuickSpin) {
            return this.quickSpinInterval / 1000;
        }
        return (this.spinInterval) / 1000;
    }

    getCurrentTime() {
        var date = new Date();
        return date.getTime();
    }

    getIdxForBet(bet) {
        for (var i = 0; i < this.betValues.length; i ++) {
            if (bet === this.betValues[i])
                return i;
        }
        return 0;
    }

    updateJackpotForIdx(newJackpotValue, idx) {
        this.jackpotValues[idx] = newJackpotValue;
    }
}