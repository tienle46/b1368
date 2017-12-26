import app from 'app';
import BasePopup from 'BasePopup';
import HighLowHistoryItem from 'HighLowHistoryItem'
import CCUtils from 'CCUtils';

class HighLowHistoryPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            container : cc.Node,
            itemPrefab: cc.Node
        });
    }

    onEnable() {
        super.onEnable();
        // let data = {
        //     histories: [
        //         {
        //             session: 1231234,
        //             time: 123,
        //             turn: 123,
        //             action: 'ahhihi',
        //             bet: 123,
        //             winAmount: 123,
        //             card: 44,
        //         }
        //     ]
        // }
        // this._onReceivedHistory(data)
        // this._registerEventListener();
        // this._sendGetHistory();
    }

    onDisable() {
        super.onDisable();
        // warn('On disable');

        // this._deregisterEventListener();
    }

    _registerEventListener() {
        app.system.addListener(app.commands.MINIGAME_MINI_POKER_HISTORY, this._onReceivedHistory, this);
    }

    _deregisterEventListener() {
        app.system.removeListener(app.commands.MINIGAME_MINI_POKER_HISTORY, this._onReceivedHistory, this);
    }

    _sendGetHistory() {
        // warn('send get history');
        app.service.send({cmd: app.commands.MINIGAME_MINI_POKER_HISTORY});
    }

    _onReceivedHistory(data) {
        // warn('history', data);
        this._removeItems();

        data.histories.forEach((info) => {
            this._addItem(info);
        });
    }

    _removeItems() {
        CCUtils.clearAllChildren(this.container);
    }

    _addItem(info) {
        var item = cc.instantiate(this.itemPrefab);
        item.active = true;

        var itemCtrl = item.getComponent(HighLowHistoryItem);
        itemCtrl.loadData(info);
        this.container.addChild(item);
    }

}

app.createComponent(HighLowHistoryPopup);