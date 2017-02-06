import app from 'app';
import DialogActor from 'DialogActor';
import numeral from 'numeral';
import { isEmpty } from 'Utils';

export default class TabUserInfo extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            userName: cc.Label,
            vipLevel: cc.Label,
            chipAmout: cc.Label,
            phoneNumber: cc.Label,
            emailAddress: cc.Label,
            currPassword: cc.EditBox,
            newPassword: cc.EditBox,
            passwordConfirmation: cc.EditBox,
            userInfoPanel: cc.Node,
            changePasswordPanel: cc.Node,
        };
    }

    onLoad() {
        super.onLoad();
        this._showUserInfoPanel();
        this.emailAddress.string = `Chưa cập nhật`;
    }

    start() {
        super.start();
        this._initUserData();
    }

    onShowChangePasswordPanel() {
        this._showChangePasswordPanel();
    }

    onBackBtnClick() {
        this._showUserInfoPanel();
    }

    onConfirmationBtnClick() {
        let currentPwd = this.currPassword.string.trim() || "";
        let newPwd = this.newPassword.string.trim() || "";
        let pwdConfirmation = this.passwordConfirmation.string.trim() || "";

        if (isEmpty(currentPwd) || isEmpty(newPwd) || isEmpty(pwdConfirmation)) {
            app.system.error(app.res.string('error_user_enter_empty_input'));
        } else if (!this._isValidPasswordInput(newPwd)) {
            app.system.error(app.res.string('error_changed_password_is_invalid'));
        } else if (newPwd != pwdConfirmation) {
            app.system.error(app.res.string('error_password_confirmation_is_not_the_same'));
        } else {
            let data = {};
            data[app.keywords.PROFILE_OLD_PASS] = currentPwd;
            data[app.keywords.PROFILE_NEW_PASS] = newPwd;

            let sendObject = {
                cmd: app.commands.USER_UPDATE_PASSWORD,
                data
            };

            this.showLoader();
            app.service.send(sendObject);
        }
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_PROFILE, this._onUserProfile, this);
        app.system.addListener(app.commands.USER_UPDATE_PASSWORD, this._onUserUpdatePassword, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_PROFILE, this._onUserProfile, this);
        app.system.removeListener(app.commands.USER_UPDATE_PASSWORD, this._onUserUpdatePassword, this);
    }

    _isValidPasswordInput(str) {
        // minimum: 6, must have atleast a-z|A-Z|0-9, without space
        // /\s/.test(str) => true if str contains space
        return /[a-zA-Z]/.test(str) && /[0-9]/.test(str) && !/\s/.test(str) && str.length >= 6;
    }

    _initUserData() {
        let data = {};
        data[app.keywords.USER_NAME] = app.context.getMyInfo().name;

        let sendObj = {
            cmd: app.commands.USER_PROFILE,
            data
        };

        this.showLoader();
        app.service.send(sendObj);
    }

    _onUserProfile(data) {
        let { name, coin } = app.context.getMyInfo();

        this.userName.string = name;
        this.chipAmout.string = numeral(coin).format('0,0');


        this.vipLevel.string = `Tỉ phú`;

        if (app.context.needUpdatePhoneNumber()) {
            this.phoneNumber.string = `Chưa cập nhật`;
        } else {
            this.phoneNumber.string = data[app.keywords.PHONE_INVITE_PHONE];
        }
        this.hideLoader();
    }

    _onUserUpdatePassword(data) {
        //update password
        this.hideLoader();
        if (data.hasOwnProperty(app.keywords.UPDATE_PROFILE_RESULT) && data[app.keywords.UPDATE_PROFILE_RESULT] == true) {
            app.system.info(app.res.string('password_changed_successfully'));
            this._showUserInfoPanel();
        } else {
            app.system.error(app.res.string('error_password_changed_unsuccessfully'));
        }
    }

    _showUserInfoPanel() {
        this.userInfoPanel.active = true;
        this.changePasswordPanel.active = false;
    }

    _showChangePasswordPanel() {
        this.changePasswordPanel.active = true;
        this.userInfoPanel.active = false;
    }
}

app.createComponent(TabUserInfo);