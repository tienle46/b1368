import app from 'app';
import PopupTabBody from 'PopupTabBody';
import Linking from 'Linking';

class TabAgency extends PopupTabBody {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            bodyNode: cc.Node,
            fbBtn: cc.Node,
            transferBtn: cc.Node,
        };
    }

    onLoad() {
        super.onLoad();
    }
    
    loadData() {
        if(Object.keys(this._data).length > 0)
            return false;
        super.loadData();
        
        this._getAgencyDataFromServer();
        return true;
    }
    
    onFacebookBtnClick(e) {
        let currentTarget = e.currentTarget;
        let link = currentTarget.fbLink;
        cc.sys.openURL(link);
    }
    
    onTransferBtnClick(e) {
        let currentTarget = e.currentTarget;
        let username = currentTarget._transferName;
        Linking.goTo(Linking.ACTION_TRANSFER, {username});
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
        
        this.showLoadingProgress();
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
            let fbIcon = cc.instantiate(this.fbBtn);
            fbIcon.active = true;
            fbIcon.fbLink =  agents[i].fblink;
            
            let transferBtn = cc.instantiate(this.transferBtn);
            transferBtn.active = true;
            transferBtn._transferName =  agents[i].agent_name;
            
            data.push([`${agents[i].agent_name.slice(0, 11)}...`, agents[i].call_number, fbIcon, transferBtn]);
        }

        this.initView({
            data: ['Đại lý', 'Số ĐT', 'facebook', ''],
            options: {
                fontColor: app.const.COLOR_YELLOW,
            }
        }, data, {
            size: this.node.getContentSize(),
            isValidated: true,
            fontSize: 20,
            group: {
                widths: [260, '', '', '']
            }
        });

        this.bodyNode.addChild(this.getScrollViewNode());
    }
}

app.createComponent(TabAgency);