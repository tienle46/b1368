import BaseScene from 'BaseScene';
import app from 'app';
import { isEmpty } from 'Utils';

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

        this.checkBox = {
            default: null,
            type: cc.Toggle
        };
    }

    onLoad() {
        super.onLoad();
        this.userNameEditBox.string = "";
        this.userPasswordEditBox.string = "";

        if (this._isSaved()) {
            let [username, password] = this._isSaved().split(':');
            this.userNameEditBox.string = username;
            this.userPasswordEditBox.string = password;
        }
    }

    handleLoginAction() {
        let username = this.userNameEditBox.string.trim();
        let password = this.userPasswordEditBox.string.trim();

        if (this._isChecked()) {
            // set storage
            let userInfo = `${username}:${password}`;

            cc.sys.localStorage.setItem(app.const.USER_LOCAL_STORAGE, userInfo);
        }

        if (isEmpty(username) || isEmpty(password)) {
            app.system.error(
                app.res.string('error_user_enter_empty_input')
            );
        } else {
            this._loginToDashboard(username, password);

        }
    }

    back() { // back to EntranceScene
        this.changeScene(app.const.scene.ENTRANCE_SCENE);
    }

    goToRegisterScene() {
        this.changeScene(app.const.scene.REGISTER_SCENE);
    }

    // check if the user information saved.
    _isSaved() {
        return cc.sys.localStorage.getItem(app.const.USER_LOCAL_STORAGE);
    }

    _isChecked() {
        return this.checkBox.isChecked;
    }

    _loginToDashboard(username, password) {
        app.system.showLoader();
        app.service.connect((success) => {
            if (success) {
                app.service.requestAuthen(username, password, false, false, null, (error, result) => {

                    this.hideLoading();
                    if (error) {
                        log('Login error:');
                        error = JSON.parse(error);
                        this.addPopup(app.getMessageFromServer(error.p.ec));
                    }
                    if (result) {
                        log(result);
                        log(`Logged in as ${app.context.getMe().name}`);
                        this.changeScene(app.const.scene.DASHBOARD_SCENE);
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