var BaseScene = require('BaseScene');
var game = require('game');

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
    }

    handleRegistryAction() {
        let username = this.userNameEditBox.string.trim();
        let password = this.userPasswordEditBox.string.trim();

        if (this._isValidUserInputs(username, password)) {
            game.service.connect((success) => {
                if (success) {
                    game.service.register(username, password, (error, result) => {
                        error = JSON.parse(error);
                        if (error) {
                            console.debug('Login error:');
                            this.addPopup(game.getMessageFromServer(error.c));
                        }
                        if (result) {
                            console.debug(result);
                            console.debug(`Logged in as ${game.context.getMe().name}`);
                            this.node.runAction(cc.sequence(
                                cc.fadeOut(0.5),
                                cc.callFunc(function() {
                                    cc.director.loadScene('DashboardScene');
                                })
                            ));
                        }
                    })
                }
            })
        } else {
            if (!this._isValidUsernameInput(username)) {
                this.addPopup(game.getMessageFromServer("LOGIN_ERROR_USERNAME_NOT_VALID"));
            } else if (!this._isValidPasswordInput(password)) {
                this.addPopup(game.getMessageFromServer("LOGIN_ERROR_PASSWORD_NOT_VALID"));
            } else if (!this._isValidCaptcha()) {
                this.addPopup(game.getMessageFromServer("LOGIN_ERROR_CAPTCHA_NOT_VALID"));
            }
        }
    }

    generateRandomString() {
        this.captchaLabel.string = Math.random().toString(36).slice(2, 6); // genarate from [2, 6] to avoid "0.xxx" in string
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

        return new RegExp('/[a-zA-Z0-9]' + '{' + MINIMUM_USERNAME + ',}/').test(str) && !/\s/.test(str);
    }

    _isValidCaptcha() {
        return this.userCaptchaEditBox.string === this.captchaLabel.string;
    }
}

game.createComponent(RegisterScene);