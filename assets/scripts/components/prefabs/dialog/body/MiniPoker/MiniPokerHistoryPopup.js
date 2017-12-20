import app from 'app';
import BasePopup from 'BasePopup';
import MiniPokerHistoryItem from 'MiniPokerHistoryItem';
import CCUtils from 'CCUtils';

class MiniPokerHistoryPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            container : cc.Node,
            itemPrefab: cc.Node
        });
    }

    onEnable() {
        super.onEnable();

        this._registerEventListener();
        this._sendGetHistory();
    }

    onDisable() {
        super.onDisable();
        // warn('On disable');

        this._deregisterEventListener();
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

        var itemCtrl = item.getComponent(MiniPokerHistoryItem);
        itemCtrl.loadData(info);
        this.container.addChild(item);
    }

}

app.createComponent(MiniPokerHistoryPopup);