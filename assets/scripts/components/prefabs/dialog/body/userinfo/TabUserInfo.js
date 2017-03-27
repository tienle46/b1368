import app from 'app';
import DialogActor from 'DialogActor';
import {
    isEmpty,
    active,
    deactive,
    numberFormat
} from 'Utils';
import TopupDialogRub from 'TopupDialogRub';
import CCUtils from 'CCUtils';
import {
    SFSEvent
} from 'SFS2X';

export default class TabUserInfo extends DialogActor {
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
            changeAvatarDialog: cc.Prefab
        };
    }

    onLoad() {
        super.onLoad();
        this._showUserInfoPanel();
        app.context.getUserAvatar(this.avatar);
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


    onShowTopUpDialog() {
        this._hide();
        TopupDialogRub.show(app.system.getCurrentSceneNode());
    }

    onLevelInfoBtnClick() {
        // let string = this.levelInfo || "Đang cập nhật.";
        // app.system.info(string);
        this._showVipInfoPanel();
    }

    onChangeAvatarBtnClick() {
        let changeAvatarDialog = cc.instantiate(this.changeAvatarDialog);
        app.system.getCurrentSceneNode().addChild(changeAvatarDialog);
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
        app.system.addListener(app.commands.USER_PROFILE_NEW, this._onUserProfile, this);
        app.system.addListener(app.commands.USER_UPDATE_PASSWORD, this._onUserUpdatePassword, this);
        app.system.addListener(app.commands.UPDATE_PHONE_NUMBER, this._onUserUpdatePhoneNumber, this);
        app.system.addListener(SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);

    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_PROFILE_NEW, this._onUserProfile, this);
        app.system.removeListener(app.commands.USER_UPDATE_PASSWORD, this._onUserUpdatePassword, this);
        app.system.removeListener(app.commands.UPDATE_PHONE_NUMBER, this._onUserUpdatePhoneNumber, this);
        app.system.removeListener(SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
    }

    _isValidPasswordInput(str) {
        // minimum: 6, must have atleast a-z|A-Z|0-9, without space
        // /\s/.test(str) => true if str contains space
        return /[a-zA-Z]/.test(str) && /[0-9]/.test(str) && !/\s/.test(str) && str.length >= 6;
    }

    _initUserData() {
        let sendObj = {
            cmd: app.commands.USER_PROFILE_NEW,
        };

        this.showLoader();
        app.service.send(sendObj);
    }

    _onUserProfile(data) {
        this.hideLoader();

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

        this.userName.string = name;
        this.chipAmout.string = numberFormat(balance);

        this.userId.string = id;
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
    }

    _showChangePasswordPanel() {
        deactive(this.userInfoPanel);
        active(this.changePasswordPanel);
        deactive(this.updatePhoneNumberPanel);
        deactive(this.vipInfoPanel);
    }

    _showUpdatePhoneNumberPanel() {
        deactive(this.userInfoPanel);
        deactive(this.changePasswordPanel);
        active(this.updatePhoneNumberPanel);
        deactive(this.vipInfoPanel);
    }

    _showVipInfoPanel() {
        deactive(this.userInfoPanel);
        deactive(this.changePasswordPanel);
        deactive(this.updatePhoneNumberPanel);
        active(this.vipInfoPanel);
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
}

app.createComponent(TabUserInfo);