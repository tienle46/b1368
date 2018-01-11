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
        this.startTime = null;

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
    
    _onReceivedConfig(data) {
        // warn('config', data);
        this.loadConfig(data);
    }

    _onReceivedStart(data) {
        let betValue = this.popup && this.popup.betValue
        this.sendGetPlay(betValue)
    }

    _onReceivedPlay(data) {
        // data.card = 5
        // data.card = 4 + Math.floor(Math.random()*52)
        if (!this.playing) {
            // data.card = 9
            // data.card = 4 + Math.floor(Math.random()*52)
            this._setStartGame(data.card)
        } else {
            this.popup && this.popup.onReceivedPlay(data.card)
        }
    }

    _onReceivedEnd(data) {
        this.playing = false
        this.startTime = null
        this.popup && this.popup.onReceivedEnd()
    }
    
    loadConfig(data) {
        this.duration = data.duration;
        this.isLoadedConfig = true;
        this.jackpotValues = data.jackpotValues;
        // fake
        // this.jackpotValues = [1000, 2000, 3000, 4000, 5000];
        this.betValues = data.bets;
        this.popup && this.popup.loadConfig()
        if (data.playing) {
            this._setStartGame(data.card)
        }
    }

    _setStartGame(cardValue) {
        this.playing = true
        this.startTime = this.now()
        this.popup && this.popup.onReceivedStart(cardValue)
    }
    
    now() {
        let time = new Date();
        return time.getTime();
    }

    getRemainingTime() {
        let now = this.now();
        let playingTime = 0
        playingTime = this.startTime && this.now() - this.startTime
        let remainingTimeInSecond = this.duration - (playingTime / 1000);
        return this.formatTime(remainingTimeInSecond);
    }

    formatTime(time) {
        // console.warn('time', time);

        let minute = Math.floor(time / 60);
        let second = Math.floor(time % 60);

        return minute + ":" + second;
    }

}