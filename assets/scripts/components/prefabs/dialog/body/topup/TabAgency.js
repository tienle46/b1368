import app from 'app';
import PopupTabBody from 'PopupTabBody';

class TabAgency extends PopupTabBody {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            bodyNode: cc.Node
        };
    }

    loadData() {
        if(Object.keys(this._data).length > 0)
            return false;
        super.loadData();
        
        this._getAgencyDataFromServer();
        return false;
    }
    
    onDataChanged(data = {}) {
        let {agents} = data;
        agents && agents.length > 0 && this._renderAgency(agents);
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

        app.service.send(sendObj);
    }

    _onListAgency(res) {
        try {
            let d = JSON.parse(res[app.keywords.AGENT]).agents;
            this.setLoadedData({agents: d});
        } catch (e) {
            app.system.error(e.message);
        }
    }
    
    _renderAgency(agents) {
        let data = [];
        
        for (let i = 0; i < agents.length; i++) {
            data.push([agents[i].agent_name, agents[i].call_number, agents[i].fblink]);
        }

        this.initView({
            data: ['Đại lý', 'Số ĐT', 'facebook'],
            options: {
                fontColor: app.const.COLOR_YELLOW
            }
        }, data, {
            size: this.node.getContentSize(),
            isValidated: true
        });

        this.bodyNode.addChild(this.getScrollViewNode());
    }
}

app.createComponent(TabAgency);