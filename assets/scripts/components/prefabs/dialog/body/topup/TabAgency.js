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
    }

    start() {
        super.start();
        this._getAgencyDataFromServer();
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.AGENCY, this._onListAgency, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.AGENCY, this._onListAgency, this);
    }

    _getAgencyDataFromServer() {
        let sendObj = {
            cmd: app.commands.AGENCY
        };

        app.system.showLoader();
        app.service.send(sendObj);
    }

    _onListAgency(res) {
        app.system.hideLoader();

        try {
            let d = JSON.parse(res[app.keywords.AGENT]).agents;
            let data = [
                [],
                [],
                []
            ];
            for (let i = 0; i < d.length; i++) {
                data[0].push(d[i].agent_name);
                data[1].push(d[i].call_number);
                data[2].push(d[i].fblink);

                if (i == d.length - 1) {
                    this.initGridView({
                        data: ['Đại lý', 'Số DT', 'facebook'],
                        options: {
                            fontColor: app.const.COLOR_YELLOW,
                            fontSize: 25
                        }
                    }, data, {
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
                    this.bodyNode.addChild(this.getGridView().getNode());
                }
            }
        } catch (e) {
            app.system.error(e.message);
        }
    }
}

app.createComponent(TabAgency);