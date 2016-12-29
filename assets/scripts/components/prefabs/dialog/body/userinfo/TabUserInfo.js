import app from 'app';
import Component from 'Component';
import GridViewRub from 'GridViewRub';

export default class TabUserInfo extends Component {
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

    onLoad() {
        this._initUserData();
    }

    _initUserData() {
        let data = {};
        data[app.keywords.USER_NAME] = app.context.getMyInfo().name;

        let sendObj = {
            cmd: app.commands.USER_PROFILE,
            data
        };

        app.system.showLoader();

        app.service.send(sendObj, (data) => {
            if (data) {
                this._fillData(data);
                app.system.hideLoader();
            }
        });
    }

    _fillData(userData) {
        // console.log(userData);
        let { name, coin } = app.context.getMyInfo();

        this.userName.string = name;
        this.chipAmout.string = coin.toLocaleString();


        this.vipLevel.string = `Tỉ phú`;

        if (app.context.needUpdatePhoneNumber()) {
            this.phoneNumber.string = `Chưa cập nhật`;
        } else {
            this.phoneNumber.string = userData[app.keywords.PHONE_INVITE_PHONE];
        }
    }
}

app.createComponent(TabUserInfo);