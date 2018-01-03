import app from 'app';
import BasePopup from 'BasePopup';
import HighLowHistoryItemInfoItem from 'HighLowHistoryItemInfoItem'
import CCUtils from 'CCUtils';

class HighLowHistoryItemInfoPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            container: cc.Node,
            itemPrefab: cc.Node
        });
        this.itemId = 0
        this.time = ''
    }

    onEnable() {
        super.onEnable();
        let info = []
        // for(let i = 0; i< 15; i++) {
        //     info.push({
        //         time: `12/22/201${i}`,
        //         step: `00${i}`,
        //         action: `ohoho${i}`,
        //         bet: 123,
        //         winAmount: 123,
        //         card: i+5,
        //     })
        // }
        // let data = {
        //     info
        // }
        // this._onReceivedHistory(data)
        this._registerEventListener();
        this._sendGetHistory();
    }

    onDisable() {
        super.onDisable();
        // warn('On disable');

        this._deregisterEventListener();
    }

    _registerEventListener() {
        //TODO
        app.system.addListener(app.commands.MINIGAME_CAO_THAP_HISTORY_DETAIL, this._onReceivedHistory, this);
    }

    _deregisterEventListener() {
        //TODO
        app.system.removeListener(app.commands.MINIGAME_CAO_THAP_HISTORY_DETAIL, this._onReceivedHistory, this);
    }

    _sendGetHistory() {
        // warn('send get history');
        //TODO
        app.service.send({
            cmd: app.commands.MINIGAME_CAO_THAP_HISTORY_DETAIL,
            data: {
                i: this.itemId
            }
        });
    }

    _onReceivedHistory(data) {
        // warn('history', data);
        this._removeItems();

        data.details.forEach((details) => {
            this._addItem(details);
        });
    }

    _removeItems() {
        CCUtils.clearAllChildren(this.container);
    }

    _addItem(info) {
        var item = cc.instantiate(this.itemPrefab);
        item.active = true;

        var itemCtrl = item.getComponent(HighLowHistoryItemInfoItem);
        itemCtrl.time = this.time
        itemCtrl.loadData(info);
        this.container.addChild(item);
    }

}

app.createComponent(HighLowHistoryItemInfoPopup);