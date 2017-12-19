import app from 'app';
import BasePopup from 'BasePopup';
import MiniPokerTopItem from 'MiniPokerTopItem';
import CCUtils from 'CCUtils';

class MiniPokerTopPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            container: cc.Node,
            itemPrefab: cc.Node
        });

    }

    onEnable() {
        super.onEnable();

        this._registerEventListener();

        this._sendGetTop();
    }

    onDisable() {
        super.onDisable();

        this._removeItems();
        this._deregisterEventListener();
    }

    _sendGetTop() {
        app.service.send({cmd:app.commands.MINIGAME_MINI_POKER_TOP_PLAYER});
    }

    _registerEventListener() {
        app.system.addListener(app.commands.MINIGAME_MINI_POKER_TOP_PLAYER, this._onReceivedTop, this);
    }

    _deregisterEventListener() {
        app.system.removeListener(app.commands.MINIGAME_MINI_POKER_TOP_PLAYER, this._onReceivedTop, this);
    }

    _onReceivedTop(data) {
        warn('top', data);
        this._removeItems();

        data.topPlayers.forEach((info, idx) => {
            this._addItem(idx, info);
        });

    }

    _removeItems() {
        CCUtils.clearAllChildren(this.container);
    }

    _addItem(idx, data) {
        var item = cc.instantiate(this.itemPrefab);
        item.active = true;
        var itemCtrl = item.getComponent(MiniPokerTopItem);
        itemCtrl.loadData(idx, data);
        this.container.addChild(item);
    }
    
}

app.createComponent(MiniPokerTopPopup);