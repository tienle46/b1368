import BasePopup from 'BasePopup'
import SlotHistoryItem from 'SlotHistoryItem';
import CCUtils from 'CCUtils';

class SlotHistoryPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            container: cc.Node,
            itemPrefab: cc.Node
        });

    }
    onEnable() {
        super.onEnable();
        this._registerEventListener()
        this.scheduleOnce(this._sendGetHistory, 0.2);
    }

    onDisable() {
        super.onDisable();
        this._deregisterEventListener()

    }


    _sendGetHistory() {
        const sendObj = { cmd: app.commands.MINIGAME_CAO_THAP_TOP_PLAYER }
        warn('sendObj', sendObj)
        // app.service.send(sendObj);
        var data = []
        var currentTime = new Date()
        for(let i=0;i<15;i++) {
            data.push({
                time: currentTime,
                session: 1000+i,
                betmin: 1000+i,
                bet: 2000*i,
                win: 3000*i
            })
        }
        this._onReceivedTop(data)
    }

    _registerEventListener() {
        app.system.addListener(app.commands.MINIGAME_CAO_THAP_TOP_PLAYER, this._onReceivedHistory, this);
    }

    _deregisterEventListener() {
        app.system.removeListener(app.commands.MINIGAME_CAO_THAP_TOP_PLAYER, this._onReceivedHistory, this);
    }

    _onReceivedHistory(data) {
        this._removeItems();

        data.forEach((info, idx) => {
            this._addItem(idx, info);
        });

    }

    _removeItems() {
        CCUtils.clearAllChildren(this.container);
    }


    _addItem(idx, info) {
        let item = cc.instantiate(this.itemPrefab)
        item.active = true
        item.getComponent(SlotTopItem).loadData(info)
        this.container.addChild(item)
    }
}

app.createComponent(SlotHistoryPopup);
