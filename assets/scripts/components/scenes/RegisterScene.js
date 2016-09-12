var BaseScene = require('BaseScene');
var game = require('game');

const CAPTCHA_LENGTH = 4;
const MINIMUM_USERNAME = 6;
const MINIMUM_PASSWORD = 6;


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
        game.service.connect((success) => {
            let username = this.userNameEditBox.string.trim();
            let password = this.userPasswordEditBox.string.trim();

            if (success) {
                game.service.register(username, password, (error, result) => {
                    error = JSON.parse(error);
                    if (error) {
                        console.debug('Login error:');
                        this.addPopup(game.getMessageFromServer(error.c));
                    }
                    if (result.length) {
                        console.debug(`Logged in as ${game.context.getMe().name}`);
                    }
                })
            }
        })
    }

    generateRandomString() {
        this.captchaLabel.string = Math.random().toString(36).slice(2, 6); // genarate from [2, 6] to avoid "0.xxx" in string
    }

    _a(username, password) {

    }

    _isValidUserInputs(username, password) {

    }

    _isValidInput(str) {
        // minimum: 6, a-zA-Z0-9, without space
        // /\s/.test(str) => true if str contains space

        return (str.match(/[a-z]/) && str.match(/[A-Z]/) && str.match(/[0-9]/) && !/\s/.test(str) && str.length >= 6) || false;
    }

}
game.createComponent(RegisterScene);