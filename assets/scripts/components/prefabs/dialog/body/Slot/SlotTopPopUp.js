import BasePopup from 'BasePopup'
import SlotTopItem from 'SlotTopItem';
import CCUtils from 'CCUtils';

class SlotTopPopup extends BasePopup {
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
        this.scheduleOnce(this._sendGetTop, 0.2);
    }

    onDisable() {
        super.onDisable();
        this._deregisterEventListener()

    }


    _sendGetTop() {
        const sendObj = { cmd: app.commands.MINIGAME_CAO_THAP_TOP_PLAYER }
        warn('sendObj', sendObj)
        // app.service.send(sendObj);
        var data = []
        for(let i=0;i<15;i++) {
            data.push({
                rank: i+1,
                username: `aneo${i}`,
                bet: 1000+i,
                win: 2000*i,
                detail: 'Nổ hũ'
            })
        }
        this._onReceivedTop(data)
    }

    _registerEventListener() {
        app.system.addListener(app.commands.MINIGAME_CAO_THAP_TOP_PLAYER, this._onReceivedTop, this);
    }

    _deregisterEventListener() {
        app.system.removeListener(app.commands.MINIGAME_CAO_THAP_TOP_PLAYER, this._onReceivedTop, this);
    }

    _onReceivedTop(data) {
        warn('top', data);
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

app.createComponent(SlotTopPopup);
