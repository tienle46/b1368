
import app from 'app';
import BaseScene from 'BaseScene';

export default class RegisterScene extends BaseScene {
    constructor() {
        super();

        this.properties = {
            resetCaptcha: cc.Node,
            userNameEditBox: cc.EditBox,
            userPasswordEditBox: cc.EditBox,
            userCaptchaEditBox: cc.EditBox,
        };
    }

    onLoad() {
        super.onLoad();
        this.captchaLabel = this.resetCaptcha.getChildByName('label').getComponent(cc.Label);
        this.generateRandomString();
    }

    handleRegistryAction() {
        let username = this.userNameEditBox.string.trim();
        let password = this.userPasswordEditBox.string.trim();

        if (this._isValidUserInputs(username, password)) {
            this.loginToDashboard(username, password, true);
        } else {
            this.hideLoading();
            if (!this._isValidUsernameInput(username)) {
                app.system.showErrorToast(app.getMessageFromServer("LOGIN_ERROR_USERNAME_NOT_VALID"));
            } else if (!this._isValidPasswordInput(password)) {
                app.system.showErrorToast(app.getMessageFromServer("LOGIN_ERROR_PASSWORD_NOT_VALID"));
            } else if (!this._isValidCaptcha()) {
                app.system.showErrorToast(app.getMessageFromServer("LOGIN_ERROR_CAPTCHA_NOT_VALID"));
            }
        }
    }

    generateRandomString() {
        this.captchaLabel.string = this._generateRandomString(app.config.MINIMUM_PASSWORD); // genarate from [2, 6] to avoid "0.xxx" in string
    }

    back() {
        this.changeScene(app.const.scene.ENTRANCE_SCENE);
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
        // minimum: 6, must have atleast a-z||A-Z|0-9, without space
        // /\s/.test(str) => true if str contains space
        return str.length <= 16 && /[a-zA-Z0-9]{5,}/.test(str) && /[a-zA-Z]/.test(str) && /[0-9]/.test(str) && !/\s/.test(str) && str.length >= app.config.MINIMUM_PASSWORD;
    }

    _isValidUsernameInput(str) {
        // minimum: 5, a-zA-Z0-9, without space
        // /\s/.test(str) => true if str contains space
        return str.length <= 21 && /[a-zA-Z0-9]{6,}/.test(str) && !/\s/.test(str);
    }

    _isValidCaptcha() {
        return this.userCaptchaEditBox.string === this.captchaLabel.string;
    }
}

app.createComponent(RegisterScene);