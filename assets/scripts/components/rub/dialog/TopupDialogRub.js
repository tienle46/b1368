import DialogRub from 'DialogRub';
import TopupDialog from 'TopupDialog';
import GridViewRub from 'GridViewRub';
import app from 'app';

export default class TopUpDialogRub {

    constructor(node) {
        let url = `${app.const.DIALOG_DIR_PREFAB}/topup`;
        let tabs = [{
            title: 'Thẻ cào',
            value: `${url}/tab_card`
        }, {
            title: 'SMS',
            value: `${url}/tab_sms`

        }, {
            title: 'IAP',
            value: `${url}/tab_iap`
        }, {
            title: 'Đại lí',
            value: this._initAgencyTab()
                // value: 'kiot_tab'
        }];

        let options = {
            // itemHeight: 26.5
        };

        this.options = { tabs, options };
        this.node = node;
        this.dialog = null;
        this.init();
    }

    init() {
        this.dialog = new DialogRub(this.node, this.options.tabs, { title: 'Nạp Tiền' });
        this.topupDialogComponent = this.dialog.addComponent(TopupDialog);
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
            ['y1', { text: 'y1' }, { text: 'y2' }, { text: 'y3' }, { text: 'y4' }, 'z2']
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


    static show(parentNode) {
        return new this(parentNode);
    }
}