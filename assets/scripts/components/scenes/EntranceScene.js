var app = require('app');
var BaseScene = require("BaseScene");
var Fingerprint2 = require('fingerprinter');

import AlertPopupRub from 'AlertPopupRub';
import LoaderRub from 'LoaderRub';

class EntranceScene extends BaseScene {

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
    }

    handleLoginAction() {
        this.showLoading();
        app.service.connect((success) => {
            log("success: " + success);
            if (success) {
                new Fingerprint2().get((deviceId) => {
                    app.service.requestAuthen('crush1', "1234nm", false, true, (error, result) => {
                        error = JSON.parse(error);
                        if (result) {
                            console.log(app.context.getMe());
                            this.hideLoading();
                            this.changeScene('DashboardScene');
                        }

                        if (error) {
                            this.addPopup(app.getMessageFromServer(error.p.ec));
                        }
                    });
                });
            }
        });
    }

    handleRegisterButton() {
        this.changeScene('RegisterScene');
    }

    handlePlayNowButton() {
        // app.service.connect((success) => {
        //     log("success: " + success);
        //     if (success) {
        //         app.service.login("crush1", "1234nm", (error, result) => {
        //             if (result) {
        //                 // log(`Logged in as ${app.context.getMe().name}`)

        //                 // if(app.context.getMe()){
        //                 //     let ListTableScene = require('ListTableScene');
        //                 //     new ListTableScene()._createRoom(app.const.gameCode.TLMNDL, 1, 2)
        //                 // }else{
        //                 this.node.runAction(cc.sequence(
        //                     cc.fadeOut(0.5),
        //                     cc.callFunc(function() {
        //                         cc.director.loadScene('DashboardScene');
        //                     })
        //                 ));
        //                 // }

        //             }

        //             if (error) {
        //                 log("Login error: ")
        //                 log(error)
        //             }
        //         });
        //     }
        // });
        app.service.connect((success) => {
            log("success: " + success);
            if (success) {
                new Fingerprint2().get((deviceId) => {
                    app.service.requestAuthen(this._generateUserName("ysad12", deviceId, 0, 5), this._generateUserName("yz212", deviceId, 0, 6), false, true, (error, result) => {
                        error = JSON.parse(error);
                        if (result) {
                            this.changeScene('DashboardScene');
                        }

                        if (error) {
                            this.addPopup(app.getMessageFromServer(error.p.ec));
                        }
                    });
                });
            }
        });
    }

    handleFacebookLoginAction() {
        AlertPopupRub.show(this.node, "Chức năng đang cập nhật!");
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