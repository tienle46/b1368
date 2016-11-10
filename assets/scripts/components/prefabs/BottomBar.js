import app from 'app';
import Component from 'Component';
import DialogRub from 'DialogRub';
import TopupDialogRub from 'TopupDialogRub';
import ExchangeDialogRub from 'ExchangeDialogRub';
import PersonalInfoDialogRub from 'PersonalInfoDialogRub';
import GridViewRub from 'GridViewRub';
import _ from 'lodash';
import MessageCenterDialogRub from 'MessageCenterDialogRub';
import HorizontalDropDownRub from 'HorizontalDropDownRub';

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
        this._getTopupTabOptions((tabOptions) => {
            // bottombar -> dashboard scene node
            TopupDialogRub.show(this.node.parent, tabOptions);
        });
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

    onClickNotifiAction() {
        log("Notifi");
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

    onClickHotlineAction(e) {
        let dropdown = new HorizontalDropDownRub(e.currentTarget, [{
                icon: null,
                content: null
            }, {
                icon: null,
                content: null
            },
            {
                icon: null,
                content: null
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

    _getTopupTabOptions(cb) {
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
            title: 'Đại lí',
            value: this._initAgencyTab()
                // value: 'kiot_tab'
        }];

        let options = {
            // itemHeight: 26.5
        };

        cb({ tabs, options });
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

    _initAgencyTab() {
        let event = new cc.Component.EventHandler();
        event.target = this.node;
        event.component = 'BottomBar';
        event.handler = 'testClick';


        let agencyTab = new GridViewRub({
            data: ['TGLV', 'Đại lý', 'Số DT', 'Địa chỉ', 'facebook'],
            options: {
                bgColor: new cc.Color(53, 135, 217),
                fontColor: app.const.COLOR_WHITE
            }
        }, [
            ['x', 'x1', 'x2', 'x1', 'x2', 'x'],
            ['z', 'z1', 'z2', 'z1', 'z2', 'z2'],
            ['y', 'y1', 'y2', 'y1', 'y2', 'z2'],
            ['y0', 'y1', 'y2', 'y1', 'y2', 'z2'],
            [{ text: 'NAP XU VAO GAME', fontSize: 4, fontLineHeight: 5, button: {} }, { text: 'y1' }, { text: 'y2' }, { text: 'y3' }, { text: 'y4' }, 'z2']
        ], {
            position: cc.v2(2, 140),
            width: 872,
            group: {
                colors: [null, null, new cc.Color(65, 94, 160), null, null],
                events: [event],
                widths: ['', '', 130, 130, 350]
            }
        });

        this._getAgencyDataFromServer(agencyTab);

        return agencyTab.getNode();
    }

    testClick() {
        console.log('testclick');
    }

    _getAgencyDataFromServer(agencyTab) {
        let sendObj = {
            cmd: app.commands.AGENCY
        };

        console.log(sendObj);
        let faker = {
            "agents": [{
                    "work_shift": "24/24h",
                    "agent_name": "Mr Tân Tân Tân Tân Tân Tân Tân",
                    "call_number": "0962555513",
                    "address": "Toàn quốc",
                    "fblink": "https://www.facebook.com/bai3mien"

                }, {
                    "work_shift": "24/24h",
                    "agent_name": "Mr Tân",
                    "call_number": "0962555513",
                    "address": "Toàn quốc",
                    "fblink": "https://www.facebook.com/bai3mien"

                },
                {
                    "work_shift": "24/24h",
                    "agent_name": "Mr Tân",
                    "call_number": "0962555513",
                    "address": "Toàn quốc",
                    "fblink": "https://www.facebook.com/bai3mien"

                },
                {
                    "work_shift": "24/24h",
                    "agent_name": "Mr Tân",
                    "call_number": "0962555513",
                    "address": "Toàn quốc",
                    "fblink": "https://www.facebook.com/bai3mien"

                },
                {
                    "work_shift": "24/24h",
                    "agent_name": "Mr Tân",
                    "call_number": "0962555513",
                    "address": "Toàn quốc",
                    "fblink": "https://www.facebook.com/bai3mien"

                },
                {
                    "work_shift": "24/24h",
                    "agent_name": "Mr Tân",
                    "call_number": "0962555513",
                    "address": "Toàn quốc",
                    "fblink": "https://www.facebook.com/bai3mien"

                }
            ]
        };

        if (faker.agents) {
            let data = [];
            faker.agents.forEach((a) => {
                let d = [];
                d.push(a.work_shift);
                d.push(a.agent_name);
                d.push(a.call_number);
                d.push(a.address);
                d.push(a.fblink);
                data.push(d);
            });
            debug(data);
            agencyTab.resetData(data, true);
        }

        app.service.send(sendObj, (res) => {
            log(res)
                // if (res) {
                //     let gameListCol = res[app.keywords.GAME_NAME_LIST] || [];
                //     let levelCol = res[app.keywords.LEVEL_LIST].map((e) => `Cấp độ ${e}`) || [];
                //     // let levelCol = res[app.keywords.LEVEL_TITLE_LIST]|| []; 
                //     let winLostCol = res[app.keywords.WIN_LIST].map((e, i) => `${e}/${res[app.keywords.LOST_LIST][i]}`) || [];

            //     let data = [
            //         gameListCol,
            //         levelCol,
            //         winLostCol,
            //     ];

            //     if (agencyTab)
            //         agencyTab.resetData(data);
            // }

        });
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

                cb(_.cloneDeep(data));
            }

        });
    }
}

app.createComponent(BottomBar);