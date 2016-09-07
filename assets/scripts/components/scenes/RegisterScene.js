import BaseScene from "BaseScene";
var game = require('game');

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
    }

    onLoad() {
        super.onLoad();
    }

    handleRegistryAction() {
        // console.log(this.userNameEditBox, this.userPasswordEditBox);
        game.service.connect((success) => {
            let username = this.userNameEditBox.string.trim();
            let password = this.userPasswordEditBox.string.trim();
            console.log('success', success);
            if (success) {
                game.service.login(username, password, (error, result) => {
                    if (error) {
                        console.debug('Login error:');
                        console.log(error);
                        this.addPopup(game.getMessageFromServer(error.c));
                    }
                    if (result.length) {
                        console.debug(`Logged in as ${game.context.getMySelf().name}`);
                    }
                })
            }
        })
    }
}
game.createComponent(RegisterScene);