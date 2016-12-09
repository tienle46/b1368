import app from 'app';
import Component from 'Component';
import DialogRub from 'DialogRub';
import TopupDialogRub from 'TopupDialogRub';
import ExchangeDialogRub from 'ExchangeDialogRub';
import PersonalInfoDialogRub from 'PersonalInfoDialogRub';
import GridViewRub from 'GridViewRub';
import MessageCenterDialogRub from 'MessageCenterDialogRub';
import HorizontalDropDownRub from 'HorizontalDropDownRub';
import PromptPopupRub from 'PromptPopupRub';

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

        this.eventButton = {
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

        // data essential
    }

    onLoad() {
        this._fillUserData();
    }

    _fillUserData() {
        let usernameLbl = this.userInfoButton.node.getChildByName('usernameLbl').getComponent(cc.Label);
        usernameLbl.string = app.context.getMyInfo().name;
        let usercoinLbl = this.userInfoButton.node.getChildByName('userCoinLbl').getComponent(cc.Label);
        usercoinLbl.string = app.context.getMyInfo().coin;
    }

    onClickNapXuAction() {
        let scene = cc.director.getScene();
        TopupDialogRub.show(scene);
    }

    onClickTopRankAction() {
        let tabs = [{
            title: 'Top VIP',
            value: 'tab_top_vip'
        }, {
            title: 'Top Cao thủ',
            value: 'tab_top_cao_thu'
        }, {
            title: 'Top Đại gia',
            value: 'tab_top_dai_gia'
        }];

        let options = {
            tabBodyPrefabType: 'rank'
        };

        let tabOptions = { tabs, options };
        // bottombar -> dashboard scene node
        DialogRub.show(this.node.parent, tabOptions);
    }

    onClickEventAction() {
        let dialog = new DialogRub(this.node.parent);
        dialog.addBody('dashboard/dialog/prefabs/event/event_dialog');
    }

    onClickTransferAwardAction(e) {
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
            itemWidth: 285,
            tabBodyPrefabType: 'exchange'
        };

        let tabOptions = { tabs, options };
        // bottombar -> dashboard scene node
        ExchangeDialogRub.show(this.node.parent, tabOptions);
    }

    fanpageClicked(e) {
        cc.sys.openURL(`https://www.messenger.com/t/${app.config.fbAppId}`);
    }

    callSupportClicked(e) {
        cc.sys.openURL(`tel:${app.config.supportHotline}`);
    }

    onFeedbackConfirmed() {
        //collect user feedback and send to server
        if (this.prom.getVal() && this.prom.getVal().length > 0) {
            var sendObject = {
                'cmd': app.commands.SEND_FEEDBACK,
                'data': {
                    [app.keywords.REQUEST_FEEDBACK]: this.prom.getVal()
                }
            };

            app.service.send(sendObject, (data) => {
                log(data);

                if (data && data["s"]) {
                    app.system.showToast('Cảm ơn bạn, feedback của bạn đã được gửi tới ban quản trị');
                } else {
                    app.system.showToast('Gửi góp ý thất bại, xin vui lòng thử lại');
                }

            }, app.const.scene.DASHBOARD_SCENE);
        }

    }

    giveFeedbackClicked() {
        this.prom = new PromptPopupRub(cc.director.getScene(), { green: this.onFeedbackConfirmed }, { label: { text: 'Enter text here:' } }, this);
        this.prom.init();
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
        let tabs = [{
                title: 'Thông báo hệ thống',
                value: 'tab_system_messages'
            },
            // {
            //     title: 'Sự kiện',
            //     value: 'tab_events'
            // },
            {
                title: 'Tin nhắn cá nhân',
                value: 'tab_personal_messages'
            }
        ];

        let options = {
            tabBodyPrefabType: 'messagecenter'
        };
        let tabOptions = { tabs, options };
        MessageCenterDialogRub.show(this.node.parent, tabOptions);
    }

    onClickUserInfoAction() {
        // personal tabs
        this._getPersonalInfoTabOptions((personalInfoTabOptions) => {
            PersonalInfoDialogRub.show(this.node.parent, personalInfoTabOptions);
        });
    }


    _getPersonalInfoTabOptions(cb) {
        let tabs = [{
                title: 'Cá nhân',
                value: 'tab_user_info'
            }
            // , {
            //     title: 'Thành tích',
            //     value: this._initAchievementsTab()
            // }
            , {
                title: 'Gift Code',
                value: 'tab_gift_code'
            }, {
                title: 'Chuyển chip',
                value: 'tab_transfer_vc'
            }, {
                title: 'Nhận chip',
                value: 'tab_transfer_transaction'
            }, {
                title: 'Lịch sử giao dịch',
                value: 'tab_transaction_history'
            },
        ];

        let options = {
            tabBodyPrefabType: 'userinfo'
        };

        cb({ tabs, options });
    }

    _initAchievementsTab() {
        let achievementsTab = new GridViewRub(null, [
            ['x', 'x1', 'x2'],
            ['z', 'z1', 'z2'],
            ['y', 'y1', 'y2']
        ], {
            position: cc.v2(2, 140),
            width: 800,
            spacingX: 0,
            spacingY: 0,
            cell: {
                horizontalSeparate: {
                    pattern: new cc.Color(102, 45, 145)
                }
            },
            group: {
                colors: [null, app.const.COLOR_YELLOW, null]
            }
        });

        this._getAchievementsDataFromServer((data) => {
            achievementsTab.resetData(data);
        });
        return achievementsTab.getNode();
    }

    _getAchievementsDataFromServer(cb) {
        let sendObj = {
            cmd: app.commands.USER_ACHIEVEMENT
        };
        app.service.send(sendObj, (res) => {
            if (res) {
                let gameListCol = res[app.keywords.GAME_NAME_LIST] || [];
                let levelCol = res[app.keywords.LEVEL_LIST].map((e) => `Cấp độ ${e}`) || [];
                // let levelCol = res[app.keywords.LEVEL_TITLE_LIST]|| []; 
                let winLostCol = res[app.keywords.WIN_LIST].map((e, i) => `${e}/${res[app.keywords.LOST_LIST][i]}`) || [];

                let data = [
                    gameListCol,
                    levelCol,
                    winLostCol,
                ];

                cb(app._.cloneDeep(data));
            }

        });
    }
}

app.createComponent(BottomBar);