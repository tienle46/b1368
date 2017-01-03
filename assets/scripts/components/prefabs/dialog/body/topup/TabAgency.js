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
        this._getAgencyDataFromServer();
    }

    _getAgencyDataFromServer() {
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

        let sendObj = {
            cmd: app.commands.AGENCY
        };

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

        this.bodyNode.addChild(agencyTab.getNode());

        app.service.send(sendObj, (res) => {
            debug(res)
        });
    }
}

app.createComponent(TabAgency);