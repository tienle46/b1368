import app from 'app';
import BasePopup from 'BasePopup';
import HighLowTopItem from 'HighLowTopItem';
import CCUtils from 'CCUtils';

class HighLowTopPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            container: cc.Node,
            itemPrefab: cc.Node
        });

    }

    onEnable() {
        super.onEnable();

        // this._registerEventListener();

        // this._sendGetTop();
        // let data = {
        //     topPlayers: [
        //         {
        //             time: '12/3/4444',
        //             playerName: 'aneohihi',
        //             bet: '123M',
        //             info: '123K',
        //             winAmount: '34M' 
        //         }
        //     ]
        // }
        // this._onReceivedTop(data)
    }

    onDisable() {
        super.onDisable();

        // this._removeItems();
        // this._deregisterEventListener();
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
        // warn('top', data);
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
        var itemCtrl = item.getComponent(HighLowTopItem);
        itemCtrl.loadData(idx, data);
        this.container.addChild(item);
    }

}

app.createComponent(HighLowTopPopup);