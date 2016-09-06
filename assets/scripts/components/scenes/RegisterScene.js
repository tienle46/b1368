import BaseScene from "BaseScene";
import game from 'game';

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
        // this.userNameEditBox = cc.find('center/userNameEditBox');
        console.log(this.userNameEditBox);
        // console.log(this.node.find('userNameEditBox'));
    }

    handleRegistryAction() {
        // console.log(this.userNameEditBox, this.userPasswordEditBox);
        super.addPopup();
        this.test();
    }
}
game.createComponent(RegisterScene);