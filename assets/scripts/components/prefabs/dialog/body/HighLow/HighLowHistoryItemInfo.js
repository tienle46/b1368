import app from 'app';
import HighLowHistoryItemInfoItem from 'HighLowHistoryItemInfoItem'
import CCUtils from 'CCUtils';
import Component from 'Component';

class HighLowHistoryItemInfo extends Component{
    constructor() {
        super();

        this.properties = this.assignProperties({
            container: cc.Node,
            itemPrefab: cc.Node
        });
        this.time = null
    }

    onEnable() {
        super.onEnable();
        // let details = []
        // for(let i = 0; i< 15; i++) {
        //     details.push({
        //         time: `12/22/201${i}`,
        //         step: `00${i}`,
        //         predict: `ohoho${i}`,
        //         bet: 123,
        //         winAmount: 123,
        //         card: i+5,
        //     })
        // }
        // let data = {
        //     details
        // }
        // this._onReceivedHistory(data)
        this._registerEventListener();
    }

    onDisable() {
        // super.onDisable();

        this._deregisterEventListener();
    }

    _registerEventListener() {
        app.system.addListener(app.commands.MINIGAME_CAO_THAP_HISTORY_DETAIL, this._onReceivedHistory, this);
    }

    _deregisterEventListener() {
        app.system.removeListener(app.commands.MINIGAME_CAO_THAP_HISTORY_DETAIL, this._onReceivedHistory, this);
    }

    _onReceivedHistory(data) {
        // warn('history', data);
        this._removeItems();

        data.details.forEach((detail, idx) => {
            this._addItem(detail, idx);
        });
    }

    _removeItems() {
        CCUtils.clearAllChildren(this.container);
    }

    _addItem(info, idx) {
        var item = cc.instantiate(this.itemPrefab);
        item.active = true;
        item.color = (idx % 2 === 0) ? new cc.Color(0, 15, 29) : new cc.Color(1, 17, 38)
        var itemCtrl = item.getComponent(HighLowHistoryItemInfoItem);
        itemCtrl.time = this.time
        itemCtrl.loadData(info);
        this.container.addChild(item);
    }
    
}

app.createComponent(HighLowHistoryItemInfo);