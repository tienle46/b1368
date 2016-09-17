var game = require('game');
var BaseScene = require("BaseScene");
var Fingerprint2 = require('fingerprinter');

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
        this.changeScene('LoginScene');
    }

    handleRegisterButton() {
        this.changeScene('RegisterScene');
    }

    handlePlayNowButton() {
        // game.service.connect((success) => {
        //     console.debug("success: " + success);
        //     if (success) {
        //         game.service.login("crush1", "1234nm", (error, result) => {
        //             if (result) {
        //                 // console.debug(`Logged in as ${game.context.getMe().name}`)

        //                 // if(game.context.getMe()){
        //                 //     let ListTableScene = require('ListTableScene');
        //                 //     new ListTableScene()._createRoom(game.const.gameCode.TLMNDL, 1, 2)
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
        //                 console.debug("Login error: ")
        //                 console.debug(error)
        //             }
        //         });
        //     }
        // });
        game.service.connect((success) => {
            console.debug("success: " + success);
            if (success) {
                new Fingerprint2().get((deviceId) => {
                    game.service.requestAuthen(this._generateUserName("ysad12", deviceId, 0, 5), this._generateUserName("yz212", deviceId, 0, 6), false, true, (error, result) => {
                        error = JSON.parse(error);
                        if (result) {
                            this.changeScene('DashboardScene');
                        }

                        if (error) {
                            this.addPopup(game.getMessageFromServer(error.p.ec));
                        }
                    });
                });
            }
        });
    }

    handleFacebookLoginAction() {

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

game.createComponent(EntranceScene);