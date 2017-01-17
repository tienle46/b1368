import app from 'app';
import DialogActor from 'DialogActor';

class TabAgency extends DialogActor {
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
        this.initGridView({
            data: ['Đại lý', 'Số DT', 'facebook'],
            options: {
                fontColor: app.const.COLOR_YELLOW,
                fontSize: 25
            }
        }, [], {
            width: 840,
            height: 415,
            spacingX: 0,
            spacingY: 0,
            group: {
                colors: [null, null, new cc.Color(65, 94, 160), null, null],
                events: [event],
                widths: ['', '', 450]
            }
        });

        let sendObj = {
            cmd: app.commands.AGENCY
        };

        let faker = {
            "agents": [{
                "agent_name": "Mr Tân",
                "call_number": "0962555513",
                "fblink": "https://www.facebook.com/bai3mien"
            }, {
                "agent_name": "Mr Tân",
                "call_number": "0962555513",
                "fblink": "https://www.facebook.com/bai3mien"
            }, {
                "agent_name": "Mr Tân",
                "call_number": "0962555513",
                "fblink": "https://www.facebook.com/bai3mien"
            }, {
                "agent_name": "Mr Tân",
                "call_number": "0962555513",
                "fblink": "https://www.facebook.com/bai3mien"
            }, {
                "agent_name": "Mr Tân",
                "call_number": "0962555513",
                "fblink": "https://www.facebook.com/bai3mien"
            }, {
                "agent_name": "Mr Tân",
                "call_number": "0962555513",
                "fblink": "https://www.facebook.com/bai3mien"
            }]
        };

        if (faker.agents) {
            let data = [];
            faker.agents.forEach((a) => {
                let d = [];
                d.push(a.agent_name);
                d.push(a.call_number);
                d.push(a.fblink);
                data.push(d);
            });
            this.getGridView().resetData(data, true);
        }

        this.bodyNode.addChild(this.getGridViewNode());

        app.service.send(sendObj, (res) => {
            debug(res);
        });
    }
}

app.createComponent(TabAgency);