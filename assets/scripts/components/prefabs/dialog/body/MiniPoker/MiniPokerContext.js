import app from 'app';
import SFS2X from 'SFS2X';
import Utils from 'GeneralUtils';

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
        if (data.error) {
            this.popup && this.popup.showError(data.error);
            return;
        }

        this.lastSpinTime = this.getCurrentTime();
        var newBalance = data.ba || app.context.getMeBalance();
        app.context.setBalance(newBalance);
        this.popup && this.popup.showResult(data);
    }

    _onUserVariablesUpdate(data) {
        // warn('user variable update', data);
        if (data.changedVars.indexOf(app.keywords.USER_VARIABLE_BALANCE)) {
            var newBalance = Utils.getVariable(data, app.keywords.USER_VARIABLE_BALANCE, app.context.getMeBalance());
            app.context.setBalance(newBalance);
        }

        this.popup && this.popup.updateBalance();
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
        // warn('Send play', betAmount);
        app.service.send({
            cmd: app.commands.MINIGAME_MINI_POKER_PLAY,
            data: {
                bet: betAmount
            }
        });
    }

    loadConfig(data) {
        this.jackpotValues = data.jackpotValues;
        this.betValues = data.bets;
        this.subInterval = data.subInterval;
        this.spinInterval = data.spinInterval + 100;
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

    getCurrentTime() {
        var date = new Date();
        return date.getTime();
    }
}