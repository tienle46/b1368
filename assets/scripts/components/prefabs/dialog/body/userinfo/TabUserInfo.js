import app from 'app';
import PopupTabBody from 'PopupTabBody';
import {
    isEmpty,
    active,
    deactive,
    numberFormat
} from 'Utils';
import Linking from 'Linking';
import CCUtils from 'CCUtils';
import {
    SFSEvent
} from 'SFS2X';

export default class TabUserInfo extends PopupTabBody {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            userName: cc.Label,
            avatar: cc.Sprite,
            vipLevel: cc.Label,
            chipAmout: cc.Label,
            phoneNumber: cc.Label,
            userId: cc.Label,
            currPassword: cc.EditBox,
            newPassword: cc.EditBox,
            passwordConfirmation: cc.EditBox,
            newPhoneNumberEditbox: cc.EditBox,
            userInfoPanel: cc.Node,
            changePasswordPanel: cc.Node,
            updatePhoneNumberPanel: cc.Node,
            vipInfoPanel: cc.Node,
            changeAvatarPanel: cc.Node
        };
    }

    onLoad() {
        super.onLoad();
        this._showUserInfoPanel();
        this.avatar && app.context.getUserAvatar(this.avatar);
    }

    loadData() {
        if(Object.keys(this._data).length > 0)
            return false;
        super.loadData();
        
        this._initUserData();
        return false;
    }
    
    onDataChanged(data = {}) {
        data && this._renderUserInfo(data);
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

            app.service.send(sendObject);
        }
    }

    onShowTopUpDialog() {
        this._hide();
        app.visibilityManager.goTo(Linking.ACTION_TOPUP);
    }

    onLevelInfoBtnClick() {
        // let string = this.levelInfo || "Đang cập nhật.";
        // app.system.info(string);
        this._showVipInfoPanel();
    }

    onChangeAvatarBtnClick() {
        this._showChangeAvatarPanel();
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

            app.service.send(sendObject);
        }
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_PROFILE_NEW, this._onUserProfile, this);
        app.system.addListener(app.commands.USER_UPDATE_PASSWORD, this._onUserUpdatePassword, this);
        app.system.addListener(app.commands.UPDATE_PHONE_NUMBER, this._onUserUpdatePhoneNumber, this);
        app.system.addListener(SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
        app.system.addListener(app.commands.CHANGE_AVATAR, this._onUserChangeAvatar, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_PROFILE_NEW, this._onUserProfile, this);
        app.system.removeListener(app.commands.USER_UPDATE_PASSWORD, this._onUserUpdatePassword, this);
        app.system.removeListener(app.commands.UPDATE_PHONE_NUMBER, this._onUserUpdatePhoneNumber, this);
        app.system.removeListener(SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
        app.system.removeListener(app.commands.CHANGE_AVATAR, this._onUserChangeAvatar, this);
    }
    
    _onUserChangeAvatar(data) {
         if (data[app.keywords.RESPONSE_RESULT]) {
            this._showUserInfoPanel();
        }
    }
    
    _isValidPasswordInput(str) {
        // minimum: 6, must have atleast a-z|A-Z|0-9, without space
        // /\s/.test(str) => true if str contains space
        return /[a-zA-Z]/.test(str) && /[0-9]/.test(str) && !/\s/.test(str) && str.length >= 6;
    }

    _initUserData() {
        app.service.send( {
            cmd: app.commands.USER_PROFILE_NEW,
        });
        this.showLoadingProgress();
    }

    _onUserProfile(data) {
        this.setLoadedData(data);
    }

    _onUserUpdatePassword(data) {
        //update password
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
        if (data.hasOwnProperty(app.keywords.RESPONSE_RESULT) && data[app.keywords.RESPONSE_RESULT]) {
            this.phoneNumber.string = this.newPhoneNumberEditbox.string;
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
        deactive(this.vipInfoPanel);
        deactive(this.changeAvatarPanel);
    }

    _showChangePasswordPanel() {
        deactive(this.userInfoPanel);
        active(this.changePasswordPanel);
        deactive(this.updatePhoneNumberPanel);
        deactive(this.vipInfoPanel);
        deactive(this.changeAvatarPanel);
    }

    _showUpdatePhoneNumberPanel() {
        deactive(this.userInfoPanel);
        deactive(this.changePasswordPanel);
        active(this.updatePhoneNumberPanel);
        deactive(this.vipInfoPanel);
        deactive(this.changeAvatarPanel);
    }

    _showVipInfoPanel() {
        deactive(this.userInfoPanel);
        deactive(this.changePasswordPanel);
        deactive(this.updatePhoneNumberPanel);
        active(this.vipInfoPanel);
        deactive(this.changeAvatarPanel);
    }
    
    _showChangeAvatarPanel() {
        deactive(this.userInfoPanel);
        deactive(this.changePasswordPanel);
        deactive(this.updatePhoneNumberPanel);
        deactive(this.vipInfoPanel);
        active(this.changeAvatarPanel);
    }
    
    _hide() {
        let parent = this.node.parent;

        CCUtils.clearFromParent(this.node);
        CCUtils.clearFromParent(parent);
    }

    _onUserVariablesUpdate(ev) {
        let changedVars = ev[app.keywords.BASE_EVENT_CHANGED_VARS] || [];
        changedVars.map(v => {
            if (v == app.keywords.CHANGE_AVATAR_URL) {
                this.avatar && app.context.getUserAvatar(this.avatar);
            }
        });
    }
    
    _renderUserInfo(data) {
        let {
            name
        } = app.context.getMyInfo();

        let {
            balance,
            benefit,
            id,
            levelName,
            nextLevelName,
            nextBenefit,
            accountTypeName
        } = data;

        this.userName.string = app.context.getMeDisplayName();
        this.chipAmout.string = numberFormat(balance);

        this.userId.string = name;
        this.vipLevel.string = accountTypeName;
        // this.nextLevel.string = nextLevelName;

        if (app.context.needUpdatePhoneNumber()) {
            this.phoneNumber.string = `Chưa cập nhật`;
        } else {
            if (data[app.keywords.PHONE_INVITE_PHONE_NEW])
                this.phoneNumber.string = data[app.keywords.PHONE_INVITE_PHONE_NEW];
            else
                this.phoneNumber.string = `Chưa cập nhật`;
        }

        this.levelInfo = `Cấp độ: ${levelName}\n`;

        if (benefit) {
            this.levelInfo += `Quyền lợi: ${benefit}`;
            // this.benefitLbl.string = `<color=#F6D533> Quyền lợi:</c> ${benefit}`;
            // let size = this.benefitLbl.node.getContentSize();
            // let height = size.height * this.benefitLbl._lineCount;
            // this.benefitLbl.node.setContentSize(size.width, height);
        }

        if (nextBenefit) {
            this.nextLvlBenefit = nextBenefit;
        }
    }
}

app.createComponent(TabUserInfo);