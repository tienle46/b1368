import app from 'app';
import Component from 'Component';
import TopupDialogRub from 'TopupDialogRub';
import ExchangeDialogRub from 'ExchangeDialogRub';
import PersonalInfoDialogRub from 'PersonalInfoDialogRub';
import MessageCenterDialogRub from 'MessageCenterDialogRub';
class BottomBar extends Component {
    constructor() {
        super();

        this.napxuButton = {
            default: null,
            type: cc.Button
        };

        this.topRankButton = {
            default: null,
            type: cc.Button
        };

        this.notifiButton = {
            default: null,
            type: cc.Button
        };

        this.awardTransferButton = {
            default: null,
            type: cc.Button
        };

        this.hotlineButton = {
            default: null,
            type: cc.Button
        };

        this.messageButton = {
            default: null,
            type: cc.Button
        };

        this.userInfoButton = {
            default: null,
            type: cc.Button
        };
    }

    onLoad() {

    }

    onClickNapXuAction() {
        let tabs = [{
            title: 'Thẻ cào',
            value: 'tab_card'
        }, {
            title: 'SMS',
            value: 'tab_sms'
        }, {
            title: 'IAP',
            value: 'tab_iap'
        }, {
            title: 'kiot',
            value: 'tab_kiot'
        }];

        let options = {
            itemHeight: 26.5
        };

        let tabOptions = { tabs, options };
        // bottombar -> dashboard scene node
        TopupDialogRub.show(this.node.parent, tabOptions);
    }

    onClickTopRankAction() {
        log("rank");
    }

    onClickNotifiAction() {
        log("Notifi");
    }

    onClickTransferAwardAction() {
        let tabs = [{
            title: 'Thẻ cào',
            value: 'tab_exchange_card'
        }, {
            title: 'Vật phẩm',
            value: 'tab_exchange_item'
        }, {
            title: 'Lịch sử',
            value: 'tab_exchange_history'
        }];

        let options = {
            itemHeight: 26.5,
            tabBodyPrefabType: 'exchange'
        };

        let tabOptions = { tabs, options };
        // bottombar -> dashboard scene node
        ExchangeDialogRub.show(this.node.parent, tabOptions);
    }

    onClickHotlineAction() {
        log("Hotline");
    }

    onClickMessageAction() {
        let tabs = [{
            title: 'Thông báo',
            value: 'tab_system_messages'
        }, {
            title: 'Sự kiện',
            value: 'tab_events'
        }, {
            title: 'Tin nhắn',
            value: 'tab_personal_messages'
        }];

        let options = {
            itemHeight: 26.5,
            itemWidth: 112,
            tabBodyPrefabType: 'messagecenter'
        };

        let tabOptions = { tabs, options };
        MessageCenterDialogRub.show(this.node.parent, tabOptions);
    }

    onClickUserInfoAction() {
        let tabs = [{
            title: 'Cá nhân',
            value: 'tab_user_info'
        }, {
            title: 'Thành tích',
            value: null
        }, {
            title: 'Gift Code',
            value: 'tab_gift_code'
        }, {
            title: 'Chuyển chip',
            value: 'tab_transfer_vc'
        }, {
            title: 'Nhận chip',
            value: 'tab_transfer_transaction'
        }, {
            title: 'Lịch sử',
            value: 'tab_transaction_history'
        }, ];

        let options = {
            itemHeight: 26.5,
            itemWidth: 112,
            tabBodyPrefabType: 'userinfo'
        };

        let tabOptions = { tabs, options };
        PersonalInfoDialogRub.show(this.node.parent, tabOptions);
    }
}

app.createComponent(BottomBar);