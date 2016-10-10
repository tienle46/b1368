'use strict';

var BaseScene = require('BaseScene');
var app = require('app');
var Fingerprint2 = require('fingerprinter');


const CAPTCHA_LENGTH = 4;
const MINIMUM_PASSWORD = 6;



export default class LoginScene extends BaseScene {
    constructor() {
        super();

        this.userNameEditBox = {
            default: null,
            type: cc.EditBox
        };

        this.userPasswordEditBox = {
            default: null,
            type: cc.EditBox
        };

        this.isRemember = false;
    }

    onLoad() {
        if (this.isRemember) {
            this._loginToDashboard();
        }
        this.userNameEditBox.string = "crush1";
        this.userPasswordEditBox.string = "1234nm";
    }

    handleLoginAction() {
        let username = this.userNameEditBox.string.trim();
        let password = this.userPasswordEditBox.string.trim();

        // if (this._isValidUserInputs(username, password)) {
        this._loginToDashboard(username, password);
        // } else {
        //     if (!this._isValidUsernameInput(username)) {
        //         this.addPopup(app.getMessageFromServer("LOGIN_ERROR_USERNAME_NOT_VALID"));
        //     } else if (!this._isValidPasswordInput(password)) {
        //         this.addPopup(app.getMessageFromServer("LOGIN_ERROR_PASSWORD_NOT_VALID"));
        //     }
        // }
    }

    back() { // back to EntranceScene
        this.changeScene('EntranceScene');
    }

    _loginToDashboard(username, password) {
        app.service.connect((success) => {
            if (success) {
                app.service.requestAuthen(username, password, false, false, (error, result) => {
                    error = JSON.parse(error);
                    if (error) {
                        log('Login error:');
                        this.addPopup(app.getMessageFromServer(error.p.ec));
                    }
                    if (result) {
                        log(result);
                        log(`Logged in as ${app.context.getMe().name}`);
                        this.changeScene('DashboardScene');
                    }
                });
            }
        });
    }

    _isValidUserInputs(username, password) {
        return this._isValidUsernameInput(username) && this._isValidPasswordInput(password);
    }

    _isValidPasswordInput(str) {
        // minimum: 6, must have atleast a-z|A-Z|0-9, without space
        // /\s/.test(str) => true if str contains space

        return /[a-z]/.test(str) && /[A-Z]/.test(str) && /[0-9]/.test(str) && !/\s/.test(str) && str.length >= MINIMUM_PASSWORD;
    }

    _isValidUsernameInput(str) {
        // minimum: 6, a-zA-Z0-9, without space
        // /\s/.test(str) => true if str contains space

        return /[a-zA-Z0-9]{6,}/.test(str) && !/\s/.test(str);
    }
}

app.createComponent(LoginScene);