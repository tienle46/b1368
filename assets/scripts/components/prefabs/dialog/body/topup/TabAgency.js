import app from 'app';
import DialogActor from 'DialogActor';

class TabAgency extends DialogActor {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            bodyNode: cc.Node
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
            let data = [];
            for (let i = 0; i < d.length; i++) {
                data.push([d[i].agent_name, d[i].call_number, d[i].fblink]);
            }

            this.initView({
                data: ['Đại lý', 'Số DT', 'facebook'],
                options: {
                    fontColor: app.const.COLOR_YELLOW
                }
            }, data, {
                size: this.node.getContentSize(),
                isValidated: true
            });

            this.bodyNode.addChild(this.getScrollViewNode());
        } catch (e) {
            app.system.error(e.message);
        }
    }
}

app.createComponent(TabAgency);