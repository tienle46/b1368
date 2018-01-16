import app from 'app';
import Utils from 'GeneralUtils';

export default class HighLowContext {
    constructor() {
        this.jackpotValues = []
        this.betValues = []
        this.spinInterval = 0
        this.subInterval = 0
        this.lastSpinTime = 0
        this.duration = null
        this.isLoadedConfig = false
        this.playing = false
        this.popup = null;
        this.startTime = null;

        this._registerEventListeners();

        // let fakeData = {
        //     jackpotValues: [1000, 2000, 3000, 4000, 5000],
        //     bets: [1000, 10000, 50000, 100000, 500000],
        //     duration: 60
        // }// fake
        // this._onReceivedConfig(fakeData) // fake
        // this.sendGetConfig();// forfake
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
        console.log('sendObject======', sendObject)
        // let data = {
        //     error: {
        //         code: '8'
        //     }
        // } //fakeErrorCode
        // this._onReceivedPlay(data)//fakeErrorCode
        app.service.send(sendObject)//forfakeErrorCode
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
        app.system.addListener(app.commands.MINIGAME_CAO_THAP_SYNC, this._onReceivedSync, this);
    }

    _removeEventListeners() {
        app.system.removeListener(app.commands.MINIGAME_CAO_THAP_START, this._onReceivedStart, this);
        app.system.removeListener(app.commands.MINIGAME_CAO_THAP_PLAY, this._onReceivedPlay, this);
        app.system.removeListener(app.commands.MINIGAME_CAO_THAP_END, this._onReceivedEnd, this);
        app.system.removeListener(app.commands.MINIGAME_CAO_THAP_CONFIG, this._onReceivedConfig, this);
        app.system.removeListener(app.commands.MINIGAME_CAO_THAP_SYNC, this._onReceivedSync, this);
    }

    _onReceivedConfig(data) {
        warn('dataConfig======', data);
        this.loadConfig(data);
    }

    _onReceivedSync(data) {
        // console.log('dataSync======', data)
        // this.jackpotValues = Object.values(data.betToJackpot)
        this._analystJackpotAndBetValues(data.betToJackpot)
        this.popup && this.popup.updateBetAndJackpotValues()
    }

    loadConfig(data) {
        // console.log('dataConfig======', data)
        this.spinInterval = data.spinInterval || 0
        this.subInterval = data.subInterval || 0
        this.duration = data.duration;
        this.tempDuration = this.duration
        if (data.remainTime) {
            this.tempDuration = data.remainTime
        }
        this._analystJackpotAndBetValues(data.betToJackpot)

        this.isLoadedConfig = true;
        this.popup && this.popup.loadConfig()
        if(data.bet) {
            this._handleHistoryBet(data.bet)
        }
        if (data.playing) {
            this._setStartGame(data, 0)
        }
    }

    _analystJackpotAndBetValues(betToJackpotObj) {
        this.betValues = Object.keys(betToJackpotObj).map(item => Number(item))
        this.jackpotValues = Object.values(betToJackpotObj)
    }

    _handleHistoryBet(betValue) {
        const index = this.betValues.indexOf(betValue)
        const jackpotValue = this.jackpotValues[index]
        this.popup && this.popup.setHistoryBetAndJackpotValue(betValue, jackpotValue, index)
    }

    _onReceivedStart(data) {
        if (data.error) {
            this.popup && this.popup.showError(data.error);
            return;
        }
        this._setStartGame(data)
    }

    _onReceivedPlay(data) {
        // data.card = 4 + Math.floor(Math.random()*52)
        // data.card = 5
        // data.card = 9
        if (data.error) {
            this.popup && this.popup.showError(data.error);
            return;
        }
        if (!this.playing) {
            // data.card = 9
            // data.card = 4 + Math.floor(Math.random()*52)
            this._setStartGame(data)
        } else {
            this.popup && this.popup.onReceivedPlay(data)
        }
    }

    _onReceivedEnd(data) {
        console.warn('dataEnd======', data)
        if (data.error) {
            this.popup && this.popup.showError(data.error);
            return;
        }
        this.playing = false
        this.startTime = null
        this.tempDuration = this.duration
        this.popup && this.popup.onReceivedEnd()
    }

    _setStartGame(data, duration = 1) {
        this.playing = true
        this.setStartTime()
        this.popup && this.popup.onReceivedStart(data, duration)
    }

    setStartTime() {
        this.startTime = this.now()
    }

    now() {
        let time = new Date();
        return time.getTime();
    }

    getRemainingTime() {
        let now = this.now();
        let playingTime = 0
        playingTime = this.startTime && this.now() - this.startTime
        let remainingTimeInSecond = this.tempDuration - (playingTime / 1000);
        let result = 0
        if (remainingTimeInSecond > 0) {
            result = remainingTimeInSecond
        }
        return this.formatTime(result);
    }

    formatTime(time) {

        let minute = Math.floor(time / 60);
        let second = Math.floor(time % 60);
        let result = minute + ":" + second;
        return Utils.timeFormat(result, 'm:s', 'mm:ss')
    }

}