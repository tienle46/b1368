import app from 'app';
import BasePopup from 'BasePopup';
import HighLowHistoryItem from 'HighLowHistoryItem'
import HighLowHistoryItemInfo from 'HighLowHistoryItemInfo'
import CCUtils from 'CCUtils';

class HighLowHistoryPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            container: cc.Node,
            itemPrefab: cc.Node,
            bodyHistory: cc.Node,
            bodyHistoryDetail: cc.Node,
            historyScrollView: cc.ScrollView
        });
    }

    onEnable() {
        super.onEnable();
        // let histories = []
        // for(let i = 0; i< 15; i++) {
        //     histories.push({
        //         i: `000${i}`,
        //         step: `00${i}`,
        //         bet: 123,
        //         winAmount: 123,
        //         card: i+5,
        //     })
        // }
        // let data = {
        //     histories
        // }
        // this._onReceivedHistory(data)
        this._registerEventListener();
        this.scheduleOnce(() => {
            this._sendGetHistory()
        }, 0.2);
    }

    onDisable() {
        super.onDisable();
        // warn('On disable');

        this._deregisterEventListener();
    }

    _registerEventListener() {
        app.system.addListener(app.commands.MINIGAME_CAO_THAP_HISTORY, this._onReceivedHistory, this);
    }

    _deregisterEventListener() {
        app.system.removeListener(app.commands.MINIGAME_CAO_THAP_HISTORY, this._onReceivedHistory, this);
    }

    _sendGetHistory(page) {

        if (page === undefined) {
            page = 1;
        }

        warn('send get history');
        app.service.send({
            cmd: app.commands.MINIGAME_CAO_THAP_HISTORY,
            data: {
                page
            }
        });
    }

    _sendGetHistoryDetail(i) {
        // warn('send get history');
        const sendObj = {
            cmd: app.commands.MINIGAME_CAO_THAP_HISTORY_DETAIL,
            data: {
                i
            }
        }
        app.service.send(sendObj);
    }

    _onReceivedHistory(data) {
        warn('history', data);
        this._removeItems();

        data.histories.forEach((info, idx) => {
            this._addItem(info, idx);
        });
    }
    
    _onclosePopup() {
        this.historyScrollView.scrollToTop()
        this._changeToMainHistory()
    }
    
    onBtnCloseClicked() {
        this._onclosePopup()
        super.onBtnCloseClicked()
    }

    onBtnInfoClicked(e) {
        let itemNode = e.currentTarget.parent
        let item = itemNode.getComponent(HighLowHistoryItem)
        let itemId = item.itemId
        this.bodyHistoryDetail.getComponent(HighLowHistoryItemInfo).time = item.time
        this._showHistoryDetailByItem(itemId)
    }
    
    _showHistoryDetailByItem(itemId) {
        this.bodyHistory.active = false
        this.bodyHistoryDetail.active = true
        this._sendGetHistoryDetail(itemId)
        
    }
    
    _changeToMainHistory(){
        if (this.bodyHistory.active == false) {
            this.bodyHistory.active = true
            this.bodyHistoryDetail.active = false
        }
        this.bodyHistoryDetail.getComponent(HighLowHistoryItemInfo)._removeItems()
    }

    onBtnBackClicked() {
        this._changeToMainHistory()
    }

    _removeItems() {
        CCUtils.clearAllChildren(this.container);
    }

    _addItem(info, idx) {
        var item = cc.instantiate(this.itemPrefab);
        item.active = true;
        (idx % 2 === 0) ? item.color = new cc.Color(2, 10, 32) : item.getComponent(cc.Sprite).spriteFrame = null
        var itemCtrl = item.getComponent(HighLowHistoryItem);
        itemCtrl.loadData(info);
        this.container.addChild(item);
    }

}

app.createComponent(HighLowHistoryPopup);