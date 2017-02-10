import BaseScene from 'BaseScene';
import app from 'app';
import { isEmpty } from 'Utils';
import Base64 from 'Base64';

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

        this.checkBox = {
            default: null,
            type: cc.Toggle
        };

        this.b64 = new Base64();
    }

    onLoad() {
        super.onLoad();
    }

    onEnable() {
        super.onEnable();

        if (this._isSaved()) {
            let [username, password] = this._isSaved().split(':');

            // fix text dose not displayed when editbox.string is setted, in cc v1.4-rc
            this.userNameEditBox.stayOnTop = true;
            this.userNameEditBox.setFocus();
            this.userPasswordEditBox.stayOnTop = true;
            this.userPasswordEditBox.setFocus();

            this.userNameEditBox.string = username;
            this.userPasswordEditBox.string = password;
        }
    }

    handleLoginAction() {
        this.userNameEditBox.stayOnTop = false;
        this.userPasswordEditBox.stayOnTop = false;
        let username = this.userNameEditBox.string.trim();
        let password = this.userPasswordEditBox.string.trim();

        if (isEmpty(username) || isEmpty(password)) {
            app.system.showErrorToast(
                app.res.string('error_user_enter_empty_input')
            );
            return;
        }

        if (this._isChecked()) {
            // set storage
            let userInfo = this.b64.encodeSafe(`${username}:${password}`);
            cc.sys.localStorage.setItem(app.const.USER_LOCAL_STORAGE, userInfo);
        }
        this._loginToDashboard(username, password);
    }

    back() { // back to EntranceScene
        this.changeScene(app.const.scene.ENTRANCE_SCENE);
    }

    goToRegisterScene() {
        this.changeScene(app.const.scene.REGISTER_SCENE);
    }

    // check if the user information saved.
    _isSaved() {
        let userInfo = cc.sys.localStorage.getItem(app.const.USER_LOCAL_STORAGE);
        return (userInfo && this.b64.decodeSafe(userInfo)) || null;
    }

    _isChecked() {
        return this.checkBox.isChecked;
    }

    _loginToDashboard(username, password) {
        this.loginToDashboard(username, password);
    }
}

app.createComponent(LoginScene);