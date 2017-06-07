import BaseScene from 'BaseScene';
import app from 'app';
import { isEmpty } from 'Utils';
import Base64 from 'Base64';

export default class LoginScene extends BaseScene {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            userNameEditBox: cc.EditBox,
            userPasswordEditBox: cc.EditBox,
            checkBox: cc.Toggle,
        }

        this.b64 = new Base64();
    }

    onLoad() {
        super.onLoad();
    }
    
    onUserNameEditboxEdited(e, b) {
        if(!this.userPasswordEditBox.isFocused()) {
            this.userPasswordEditBox.stayOnTop = true;
            this.userPasswordEditBox.setFocus();
        }
    }
    
    onReturnKeyPressed() {
       this.handleLoginAction();
    }
    
    onEnable() {
        super.onEnable();

        if (this._isSaved()) {
            let [username, password] = this._isSaved().split(':');
            this.userNameEditBox.string = username;
            this.userPasswordEditBox.string = password;
        }
    }

    handleLoginAction() {
        let username = this.userNameEditBox.string.trim();
        let password = this.userPasswordEditBox.string.trim();

        if (isEmpty(username) || isEmpty(password)) {
            app.system.showErrorToast(app.res.string('error_user_enter_empty_input'));
            return;
        }

        if (this._isChecked()) {
            // set storage
            let userInfo = this.b64.encodeSafe(`${username}:${password}`);
            app.system.marker.setItem(app.const.USER_LOCAL_STORAGE, userInfo);
            // cc.sys.localStorage.setItem(app.const.USER_LOCAL_STORAGE, userInfo);
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
        // let userInfo = cc.sys.localStorage.getItem(app.const.USER_LOCAL_STORAGE);
        let userInfo = app.system.marker.getItemData(app.const.USER_LOCAL_STORAGE, userInfo);
        
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