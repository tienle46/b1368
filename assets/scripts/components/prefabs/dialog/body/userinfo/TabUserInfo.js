import app from 'app';
import DialogActor from 'DialogActor';
import numeral from 'numeral';
import { isEmpty, active, deactive } from 'Utils';

export default class TabUserInfo extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            userName: cc.Label,
            vipLevel: cc.Label,
            chipAmout: cc.Label,
            phoneNumber: cc.Label,
            userId: cc.RichText,
            currPassword: cc.EditBox,
            newPassword: cc.EditBox,
            passwordConfirmation: cc.EditBox,
            newPhoneNumberEditbox: cc.EditBox,
            userInfoPanel: cc.Node,
            changePasswordPanel: cc.Node,
            updatePhoneNumberPanel: cc.Node,
        };
    }

    onLoad() {
        super.onLoad();
        this._showUserInfoPanel();
    }

    start() {
        super.start();
        this._initUserData();
    }

    onShowChangePasswordPanel() {
        this._showChangePasswordPanel();
    }

    onShowUpdatePhonenumberPanel() {
        this._showUpdatePhoneNumberPanel();
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
            app.system.showErrorToast(app.res.string('error_changed_password_is_invalid'));
        } else if (newPwd != pwdConfirmation) {
            app.system.showErrorToast(app.res.string('error_password_confirmation_is_not_the_same'));
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

    onUpdateBtnClick() {
        let newPhoneNumber = this.newPhoneNumberEditbox.string.trim() || "";
        if (isEmpty(newPhoneNumber)) {
            app.system.error(app.res.string('error_user_enter_empty_input'));
        } else {
            let data = {
                [app.keywords.PHONE_NUMBER]: newPhoneNumber
            };
            let sendObject = {
                cmd: app.commands.UPDATE_PHONE_NUMBER,
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
        app.system.addListener(app.commands.UPDATE_PHONE_NUMBER, this._onUserUpdatePhoneNumber, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_PROFILE, this._onUserProfile, this);
        app.system.removeListener(app.commands.USER_UPDATE_PASSWORD, this._onUserUpdatePassword, this);
        app.system.removeListener(app.commands.UPDATE_PHONE_NUMBER, this._onUserUpdatePhoneNumber, this);
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

        this.userId.string = `<color=#ffffff>ID:</c> <color=#FFE000>${app.context.getMyInfo().id}</color>`;
        this.vipLevel.string = `Tỉ phú`;

        if (app.context.needUpdatePhoneNumber()) {
            this.phoneNumber.string = `Chưa cập nhật`;
        } else {
            if (data[app.keywords.PHONE_INVITE_PHONE])
                this.phoneNumber.string = data[app.keywords.PHONE_INVITE_PHONE];
            else
                this.phoneNumber.string = `Chưa cập nhật`;
        }
        this.hideLoader();
    }

    _onUserUpdatePassword(data) {
        //update password
        this.hideLoader();
        if (data.hasOwnProperty(app.keywords.UPDATE_PROFILE_RESULT) && data[app.keywords.UPDATE_PROFILE_RESULT] == true) {
            app.system.showLongToast(app.res.string('password_changed_successfully'));
            this.currPassword.string = "";
            this.newPassword.string = "";
            this.passwordConfirmation.string = "";

            this._showUserInfoPanel();
        } else {
            app.system.error(app.res.string('error_password_changed_unsuccessfully'));
        }
    }

    _onUserUpdatePhoneNumber(data) {
        //update phonenumber
        this.hideLoader();
        if (data.hasOwnProperty(app.keywords.RESPONSE_RESULT) && data[app.keywords.RESPONSE_RESULT]) {
            app.system.showLongToast(app.res.string('phonenumber_changed_successfully'));
            this.newPhoneNumberEditbox.string = "";

            this._showUserInfoPanel();
        } else {
            app.system.error(app.res.string('error_phonenumber_changed_unsuccessfully'));
        }
    }

    _showUserInfoPanel() {
        active(this.userInfoPanel);
        deactive(this.changePasswordPanel);
        deactive(this.updatePhoneNumberPanel);
    }

    _showChangePasswordPanel() {
        deactive(this.userInfoPanel);
        active(this.changePasswordPanel);
        deactive(this.updatePhoneNumberPanel);
    }

    _showUpdatePhoneNumberPanel() {
        deactive(this.userInfoPanel);
        deactive(this.changePasswordPanel);
        active(this.updatePhoneNumberPanel);
    }
}

app.createComponent(TabUserInfo);