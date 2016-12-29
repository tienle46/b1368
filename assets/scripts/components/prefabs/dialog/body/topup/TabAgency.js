import app from 'app';
import Component from 'Component';
import GridViewRub from 'GridViewRub';

class TabAgency extends Component {
    constructor() {
        super();
        this.bodyNode = {
            default: null,
            type: cc.Node
        };
    }

    onLoad() {
        super.onLoad();
        this._initAgencyTab();
    }

    _initAgencyTab() {
        let event = new cc.Component.EventHandler();
        event.target = this.node;
        event.component = 'BottomBar';
        event.handler = 'testClick';


        let agencyTab = new GridViewRub({
            data: ['TGLV', 'Đại lý', 'Số DT', 'Địa chỉ', 'facebook'],
            options: {
                fontColor: app.const.COLOR_YELLOW,
                fontSize: 25
            }
        }, [], {
            width: 840,
            height: 425,
            spacingX: 0,
            spacingY: 0,
            group: {
                colors: [null, null, new cc.Color(65, 94, 160), null, null],
                events: [event],
                widths: ['', '', 130, 130, 350]
            }
        });

        this._getAgencyDataFromServer(agencyTab);

        this.bodyNode.addChild(agencyTab.getNode());
    }

    _getAgencyDataFromServer(agencyTab) {
        let sendObj = {
            cmd: app.commands.AGENCY
        };

        console.log(sendObj);
        let faker = {
            "agents": [{
                    "work_shift": "1.24/24h",
                    "agent_name": "Mr Tân Tân Tân Tân Tân Tân Tân",
                    "call_number": "0962555513",
                    "address": "Toàn quốc",
                    "fblink": "https://www.facebook.com/bai3mien"

                }, {
                    "work_shift": "2.24/24h",
                    "agent_name": "Mr Tân",
                    "call_number": "0962555513",
                    "address": "Toàn quốc",
                    "fblink": "https://www.facebook.com/bai3mien"

                },
                {
                    "work_shift": "3.24/24h",
                    "agent_name": "Mr Tân",
                    "call_number": "0962555513",
                    "address": "Toàn quốc",
                    "fblink": "https://www.facebook.com/bai3mien"

                },
                {
                    "work_shift": "4.24/24h",
                    "agent_name": "Mr Tân",
                    "call_number": "0962555513",
                    "address": "Toàn quốc",
                    "fblink": "https://www.facebook.com/bai3mien"

                },
                {
                    "work_shift": "5.24/24h",
                    "agent_name": "Mr Tân",
                    "call_number": "0962555513",
                    "address": "Toàn quốc",
                    "fblink": "https://www.facebook.com/bai3mien"

                },
                {
                    "work_shift": "6.24/24h",
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
            console.debug(res)
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
}

app.createComponent(TabAgency);