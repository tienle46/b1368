import app from 'app';
import Utils from 'GeneralUtils';

export default class HighLowContext {
    constructor() {
        this.jackpotValues = []
        this.betValues = []
        this.duration = null
        this.isLoadedConfig = false
        this.playing = false
        this.popup = null;
        this.startTime = 0;

        this._registerEventListeners();

        this.sendGetConfig();
    }

    sendGetConfig() {
        app.service.send({
            cmd: app.commands.MINIGAME_CAO_THAP_CONFIG
        })
    }

    sendStart(bet) {
        const sendObject = {
            cmd: app.commands.MINIGAME_CAO_THAP_START,
            data: {
                bet
            }
        }
        app.service.send(sendObject)
    }

    sendGetPlay(bet, predict) {
        const sendObject = {
            cmd: app.commands.MINIGAME_CAO_THAP_PLAY,
            data: {
                bet,
                predict
            }
        }
        app.service.send(sendObject)
    }

    sendEnd(bet) {
        app.service.send({
            cmd: app.commands.MINIGAME_CAO_THAP_END,
            data: {
                bet
            }
        })
    }
    
    now() {
        var time = new Date();
        return time.getTime();
    }
    
    getRemainingTime() {
        var now = this.now();
        console.warn('now', now, 'startTime', this.startTime);
        
        var remainingTimeInSecond = this.duration - ((this.now() - this.startTime) / 1000);
        return this.formatTime(remainingTimeInSecond);
    }
    
    formatTime(time) {
                console.warn('time', time);

        var minute = Math.floor(time / 60);
        var second = Math.floor(time - minute * 60);
        
        return minute + ":" + second;
    }

    loadConfig(data) {
        this.jackpotValues = data.jackpotValues;
        this.duration = data.duration;
        this.isLoadedConfig = true;
        this.betValues = data.bets;
        this.popup && this.popup.loadConfig(this.betValues, this.duration, this.jackpotValues)
        if (data.playing) {
            this._setStartGame(data.card)
        }
    }


    _registerEventListeners() {
        app.system.addListener(app.commands.MINIGAME_CAO_THAP_START, this._onReceivedStart, this);
        app.system.addListener(app.commands.MINIGAME_CAO_THAP_PLAY, this._onReceivedPlay, this);
        app.system.addListener(app.commands.MINIGAME_CAO_THAP_END, this._onReceivedEnd, this);
        app.system.addListener(app.commands.MINIGAME_CAO_THAP_CONFIG, this._onReceivedConfig, this);
    }

    _removeEventListeners() {
        app.system.removeListener(app.commands.MINIGAME_CAO_THAP_START, this._onReceivedStart, this);
        app.system.removeListener(app.commands.MINIGAME_CAO_THAP_PLAY, this._onReceivedPlay, this);
        app.system.removeListener(app.commands.MINIGAME_CAO_THAP_END, this._onReceivedEnd, this);
        app.system.removeListener(app.commands.MINIGAME_CAO_THAP_CONFIG, this._onReceivedConfig, this);
    }

    _onReceivedStart(data) {
        let betValue = this.popup && this.popup.betValue
        this.sendGetPlay(betValue)
    }

    _onReceivedPlay(data) {
        if (!this.playing) {
            this._setStartGame(data.card)
        } else {
            this.popup && this.popup.onReceivedPlay(data.card)
        }
    }

    _onReceivedEnd(data) {
        this.playing = false
        this.popup && this.popup.onReceivedEnd()
    }
    _onReceivedConfig(data) {
        // warn('config', data);
        this.loadConfig(data);
    }

    _setStartGame(cardValue) {
        this.playing = true
        this.startTime = this.now()
        this.popup && this.popup.onReceivedStart(cardValue)
    }

}