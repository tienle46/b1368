var app = require('app');
import AlertPopupRub from 'AlertPopupRub';
import BaseScene from 'BaseScene';
import PromptPopupRub from 'PromptPopupRub';

export default class EntranceScene extends BaseScene {

    constructor() {

        super();

        this.loginButton = {
            default: null,
            type: cc.Button
        };

        this.registerButton = {
            default: null,
            type: cc.Button
        };

        this.playNowButton = {
            default: null,
            type: cc.Button
        };

        this.facebookButton = {
            default: null,
            type: cc.Button
        };

    }

    // use this for initialization
    onLoad() {
        super.onLoad();

        console.log("on load EntranceScene");
    }

    handleLoginAction() {
        this.showLoading();

        app.service.connect((success) => {
            log("success: " + success);
            if (success) {
                app.service.requestAuthen('anhlavip', "hhmmss24", false, true, (error, result) => {
                    error = JSON.parse(error);
                    if (result) {
                        log(app.context.getMe());
                        this.hideLoading();
                        this.changeScene('DashboardScene');
                    }
                    if (error) {
                        this.addPopup(app.getMessageFromServer(error.p.ec));
                    }
                });
            }
        });
    }

    handleRegisterButton() {
        this.showLoading();
        this.changeScene('RegisterScene');
    }

    handlePlayNowButton() {
        this.showLoading();
        app.service.connect((success) => {
            log("success: " + success);
            if (success) {
                app.service.requestAuthen(this._generateUserName("ysad12", app.DEVICE_ID, 0, 5), this._generateUserName("yz212", app.DEVICE_ID, 0, 6), false, true, (error, result) => {
                    error = JSON.parse(error);
                    if (result) {
                        this.hideLoading();
                        this.changeScene('DashboardScene');
                    }

                    if (error) {
                        this.addPopup(app.getMessageFromServer(error.p.ec));
                    }
                });
            }
        });
    }

    test() {
        console.debug(this.prom.getVal());
    }

    handleFacebookLoginAction() {
        // AlertPopupRub.show(this.node, "Chức năng đang cập nhật!");
        this.prom = new PromptPopupRub(this.node, { green: this.test }, null, this);
        this.prom.init();
    }

    _generateUserName(key, deviceId, count, maxCall) {
        if (count < maxCall) {
            let code2 = `${this._javaHashcode(deviceId)}${key}xintaocho`;
            return this._generateUserName(key, code2, count + 1, maxCall);
        }
        return `p${Math.abs(this._javaHashcode(deviceId))}`;
    }

    _javaHashcode(str) {
        let hash = 0;

        try {
            if (str.length == 0) return hash;
            for (let i = 0; i < str.length; i++) {
                let char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        } catch (e) {
            throw new Error('hashCode: ' + e);
        }
    }
}

app.createComponent(EntranceScene);