import app from 'app';
import Actor from 'Actor';
import numeral from 'numeral';

export default class TabUserInfo extends Actor {
    constructor() {
        super();

        this.userName = {
            default: null,
            type: cc.Label,
        };
        this.vipLevel = {
            default: null,
            type: cc.Label,
        };
        this.chipAmout = {
            default: null,
            type: cc.Label,
        };

        this.phoneNumber = {
            default: null,
            type: cc.Label,
        };
    }

    start() {
        super.start();
        this._initUserData();
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_PROFILE, this._onUserProfile, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_PROFILE, this._onUserProfile, this);
    }

    _initUserData() {
        let data = {};
        data[app.keywords.USER_NAME] = app.context.getMyInfo().name;

        let sendObj = {
            cmd: app.commands.USER_PROFILE,
            data
        };

        app.system.showLoader();
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
        app.system.hideLoader();
    }
}

app.createComponent(TabUserInfo);