import app from 'app';
import Component from 'Component';
import DialogRub from 'DialogRub';
import TopupDialogRub from 'TopupDialogRub';
import ExchangeDialogRub from 'ExchangeDialogRub';
import PersonalInfoDialogRub from 'PersonalInfoDialogRub';
import MessageCenterDialogRub from 'MessageCenterDialogRub';
import HorizontalDropDownRub from 'HorizontalDropDownRub';

class BottomBar extends Component {
    constructor() {
        super();
        this.userInfoButton = {
            default: null,
            type: cc.Button
        };

        // data essential
    }

    onLoad() {
        this._fillUserData();
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
        }];

        // bottombar -> dashboard scene node
        ExchangeDialogRub.show(app.system.getCurrentSceneNode(), tabs, { title: 'Đổi thưởng' });
    }

    callSupportClicked(e) {
        cc.sys.openURL(`tel:${app.config.supportHotline}`);
    }

    onClickHotlineAction(e) {
        var event = new cc.Component.EventHandler();
        event.target = this.node;
        event.component = 'BottomBar';
        event.handler = 'testClick';

        let dropdown = new HorizontalDropDownRub(e.currentTarget, [{
                icon: 'bottombar/bottombar_tooltip_facebook',
                content: 'Fanpage',
                event: this.fanpageClicked.bind(this)
            }, {
                icon: 'bottombar/bottombar_tooltip_hotline',
                content: 'Hotline',
                event: this.callSupportClicked.bind(this)
            },
            {
                icon: 'bottombar/bottombar_tooltip_gopy',
                content: 'Góp ý',
                event: this.giveFeedbackClicked.bind(this)
            },
            {
                icon: 'bottombar/bottombar_tooltip_huongdan',
                content: 'Hướng dẫn'
            }
        ]);
        this.node.addChild(dropdown.node());
    }

    onClickMessageAction() {
        let url = `${app.const.DIALOG_DIR_PREFAB}/messagecenter`;
        let tabs = [{
                title: 'Hệ thống',
                value: `${url}/tab_system_messages`
            },
            // {
            //     title: 'Sự kiện',
            //     value: 'tab_events'
            // },
            {
                title: 'Cá nhân',
                value: `${url}/tab_personal_messages`
            }
        ];

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
        let usernameLbl = this.userInfoButton.node.getChildByName('usernameLbl').getComponent(cc.Label);
        usernameLbl.string = app.context.getMyInfo().name;
        let usercoinLbl = this.userInfoButton.node.getChildByName('userCoinLbl').getComponent(cc.Label);
        if (!app.service.client.me.variables.coin) {
            setTimeout(() => {
                usercoinLbl.string = app.context.getMyInfo().coin.toLocaleString();
            });
        } else
            usercoinLbl.string = app.context.getMyInfo().coin.toLocaleString();
    }
}

app.createComponent(BottomBar);