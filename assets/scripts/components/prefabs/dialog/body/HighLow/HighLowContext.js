import app from 'app';
import Utils from 'GeneralUtils';

export default class HighLowContext {
    constructor() {
        this.jackpotValues = []
        this.betValues = []
        this.duration = null
        this.isLoadedConfig = false
        this.isStart = true
        this.popup = null;

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

    loadConfig(data) {
        this.jackpotValues = data.jackpotValues;
        this.betValues = data.bets;
        this.duration = data.duration;
        this.isLoadedConfig = true;
        if(data.playing){
            this.popup && this.popup.playSpinCard(data.cards, 0)
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
        this.sendGetPlay(1000)
    }

    _onReceivedPlay(data) {
        if (this.isStart) {
            this.isStart = false
            this.popup && this.popup.playSpinCard(data.cards, 0)
        }
        this.popup && this.popup.playSpinCard(data.cards)
    }

    _onReceivedEnd(data) {

    }
    _onReceivedConfig(data) {
        // warn('config', data);
        this.loadConfig(data);
    }

}