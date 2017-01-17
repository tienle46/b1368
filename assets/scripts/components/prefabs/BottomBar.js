import app from 'app';
import DialogActor from 'DialogActor';
import DialogRub from 'DialogRub';
import TopupDialogRub from 'TopupDialogRub';
import ExchangeDialogRub from 'ExchangeDialogRub';
import PersonalInfoDialogRub from 'PersonalInfoDialogRub';
import MessageCenterDialogRub from 'MessageCenterDialogRub';
import numeral from 'numeral';

class BottomBar extends DialogActor {
    constructor() {
        super();
        this.userInfoCoinLbl = {
            default: null,
            type: cc.Label
        };

        this.userNameLbl = {
            default: null,
            type: cc.Label
        };

        this.notifyBgNode = {
            default: null,
            type: cc.Node
        };

        this.notifyCounterLbl = {
            default: null,
            type: cc.Label
        };
    }

    onEnable() {
        super.onEnable();
        this._fillUserData();
    }

    start() {
        super.start();
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.NOTIFICATION_COUNT, this._onNotifyCount, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.NOTIFICATION_COUNT, this._onNotifyCount, this);
    }

    onClickNapXuAction() {
        let scene = app.system.getCurrentSceneNode();
        TopupDialogRub.show(scene);
    }

    onClickTopRankAction() {
        let url = `${app.const.DIALOG_DIR_PREFAB}/rank`;
        let tabs = [{
            title: 'Top VIP',
            value: `${url}/tab_top_vip`
        }, {
            title: 'Top Cao thủ',
            value: `${url}/tab_top_cao_thu`
        }, {
            title: 'Top Đại gia',
            value: `${url}/tab_top_dai_gia`
        }];

        // bottombar -> dashboard scene node
        DialogRub.show(app.system.getCurrentSceneNode(), tabs, { title: 'Xếp hạng' });
    }

    onFriendBtnClick() {
        console.log('onFriendBtnClick');
    }

    onClickTransferAwardAction() {
        let url = `${app.const.DIALOG_DIR_PREFAB}/exchange`;
        let tabs = [{
            title: 'Thẻ cào',
            value: `${url}/tab_exchange_card`
        }, {
            title: 'Vật phẩm',
            value: `${url}/tab_exchange_item`
        }, {
            title: 'Lịch sử',
            value: `${url}/tab_exchange_history`
        }, {
            title: 'Đại lí',
            value: `${url}/tab_agency`
        }];

        // bottombar -> dashboard scene node
        ExchangeDialogRub.show(app.system.getCurrentSceneNode(), tabs, { title: 'Đổi thưởng' });
    }

    callSupportClicked(e) {
        cc.sys.openURL(`tel:${app.config.supportHotline}`);
    }

    onClickMessageAction() {
        let url = `${app.const.DIALOG_DIR_PREFAB}/messagecenter`;
        let tabs = [{
            title: 'Hệ thống',
            value: `${url}/tab_system_messages`
        }, {
            title: 'Cá nhân',
            value: `${url}/tab_personal_messages`
        }];

        MessageCenterDialogRub.show(app.system.getCurrentSceneNode(), tabs, { title: 'Tin nhắn' });
    }

    onClickUserInfoAction() {
        // personal tabs
        let url = `${app.const.DIALOG_DIR_PREFAB}/userinfo`;
        let tabs = [{
                title: 'Cá nhân',
                value: `${url}/tab_user_info`
            },
            {
                title: 'Thành tích',
                value: `${url}/tab_user_achievements`
            }
            // , {
            //     title: 'Gift Code',
            //     value: `${url}/tab_gift_code`
            // }
            // , {
            //     title: 'Chuyển chip',
            //     value: 'tab_transfer_vc'
            // }, {
            //     title: 'Nhận chip',
            //     value: 'tab_transfer_transaction'
            // }, {
            //     title: 'Lịch sử giao dịch',
            //     value: 'tab_transaction_history'
            // }, 
        ];

        PersonalInfoDialogRub.show(app.system.getCurrentSceneNode(), tabs, { title: 'Cá nhân' });
    }

    _fillUserData() {
        this.userNameLbl.string = app.context.getMyInfo().name;
        if (!app.context.getMyInfo().coin) {
            setTimeout(() => {
                this.userInfoCoinLbl.string = `${numeral(app.context.getMyInfo().coin).format('0,0')}`;
            });
        } else
            this.userInfoCoinLbl.string = `${numeral(app.context.getMyInfo().coin).format('0,0')}`;
    }

    _onNotifyCount(data) {
        let countList = data[app.keywords.COUNT_LIST];
        let len = countList.length || 0;
        this.notifyBgNode.active = len > 0;
        this.notifyCounterLbl.string = len;
    }
}

app.createComponent(BottomBar);