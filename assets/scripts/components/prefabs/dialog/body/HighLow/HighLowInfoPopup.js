import app from 'app';
import BasePopup from 'BasePopup';
import CCUtils from 'CCUtils';

class HighLowInfoPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
        });

    }

    onEnable() {
        super.onEnable();
        // let topPlayers = []
        // for (let i = 0; i < 15; i++) {
        //     topPlayers.push({
        //         time: `12/3/201${i}`,
        //         playerName: `aneo${i}`,
        //         bet: `00${i}`,
        //         info: '123K',
        //         winAmount: '34M'
        //     })
        // }
        // let data = {
        //     topPlayers
        // }
        // this._onReceivedTop(data)

        // this._registerEventListener();

        // this.scheduleOnce(this._sendGetTop, 0.2);
        // this._sendGetTop();
    }

    onDisable() {
        super.onDisable();

        // this._removeItems();
        // this._deregisterEventListener();
    }

    // _sendGetTop() {
    //     app.service.send({ cmd: app.commands.MINIGAME_CAO_THAP_TOP_PLAYER });
    // }

    // _registerEventListener() {
    //     app.system.addListener(app.commands.MINIGAME_CAO_THAP_TOP_PLAYER, this._onReceivedTop, this);
    // }

    // _deregisterEventListener() {
    //     app.system.removeListener(app.commands.MINIGAME_CAO_THAP_TOP_PLAYER, this._onReceivedTop, this);
    // }

    // _onReceivedTop(data) {
    //     // warn('top', data);
    //     this._removeItems();

    //     data.topPlayers.forEach((info, idx) => {
    //         this._addItem(idx, info);
    //     });

    // }

    // _removeItems() {
    //     CCUtils.clearAllChildren(this.container);
    // }

    // _addItem(idx, data) {
    //     var item = cc.instantiate(this.itemPrefab);
    //     item.active = true;
    //     (idx % 2 === 0) ? item.color = new cc.Color(2, 10, 32) : item.getComponent(cc.Sprite).spriteFrame = null
    //     var itemCtrl = item.getComponent(HighLowTopItem);
    //     itemCtrl.loadData(idx, data);
    //     this.container.addChild(item);
    // }

}

app.createComponent(HighLowInfoPopup);