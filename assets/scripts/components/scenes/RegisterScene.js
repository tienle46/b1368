var BaseScene = require('BaseScene');
var app = require('app');
import SegmentControlRub from 'SegmentControlRub';

const CAPTCHA_LENGTH = 4;
const MINIMUM_PASSWORD = 6;
const MINIMUM_USERNAME = 6;

export default class RegisterScene extends BaseScene {
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

        this.userCaptchaEditBox = {
            default: null,
            type: cc.EditBox
        };

        this.resetCaptcha = cc.Node;
    }

    onLoad() {
        this.captchaLabel = this.resetCaptcha.getChildByName('label').getComponent(cc.Label);
        this.generateRandomString();
        this.userNameEditBox.string = `a${this._generateRandomString(9)}${1}`;
        this.userPasswordEditBox.string = `aA${this._generateRandomString(9)}${1}`;
    }

    handleRegistryAction() {
        let username = this.userNameEditBox.string.trim();
        let password = this.userPasswordEditBox.string.trim();

        if (this._isValidUserInputs(username, password)) {
            app.service.connect((success) => {
                if (success) {
                    app.service.requestAuthen(username, password, true, false, (error, result) => {
                        error = JSON.parse(error);
                        if (error) {
                            console.debug('Login error:');
                            this.addPopup(app.getMessageFromServer(error.p.ec));
                        }
                        if (result) {
                            console.debug(result);
                            console.debug(`Logged in as ${app.context.getMe().name}`);
                            this.changeScene('DashboardScene');
                        }
                    });
                }
            });
        } else {
            if (!this._isValidUsernameInput(username)) {
                this.addPopup(app.getMessageFromServer("LOGIN_ERROR_USERNAME_NOT_VALID"));
            } else if (!this._isValidPasswordInput(password)) {
                this.addPopup(app.getMessageFromServer("LOGIN_ERROR_PASSWORD_NOT_VALID"));
            } else if (!this._isValidCaptcha()) {
                this.addPopup(app.getMessageFromServer("LOGIN_ERROR_CAPTCHA_NOT_VALID"));
            }
        }
    }

    generateRandomString() {
        this.captchaLabel.string = this._generateRandomString(MINIMUM_PASSWORD); // genarate from [2, 6] to avoid "0.xxx" in string
    }

    back() { // back to EntranceScene
        // this.changeScene('EntranceScene');
        SegmentControlRub.show(this.node, [1, 1, 1]);
    }


    /**
     *  PRIVATE METHODS
     */

    _generateRandomString(number) {
        return Math.random().toString(36).slice(2, number);
    }

    _isValidUserInputs(username, password) {
        return this._isValidUsernameInput(username) && this._isValidPasswordInput(password) && this._isValidCaptcha();
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

    _isValidCaptcha() {
        return this.userCaptchaEditBox.string === this.captchaLabel.string;
    }
}

app.createComponent(RegisterScene);