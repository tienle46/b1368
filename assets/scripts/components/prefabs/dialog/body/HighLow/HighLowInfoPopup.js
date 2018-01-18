import app from 'app';
import BasePopup from 'BasePopup';
import CCUtils from 'CCUtils';

class HighLowInfoPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            richTextInfo: cc.RichText
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
        this.scheduleOnce(this._generateRichText, 0.2)
    }

    onDisable() {
        super.onDisable();

        // this._removeItems();
        // this._deregisterEventListener();
    }
    
    _generateRichText() {
        let content = 
        `Cách chơi:`
        + `<br/><color=#efbb01>Bước 1</c>: Chọn mức cược bạn muốn tham gia chơi. Có các mức cược mặc định là: `
        + `1000, 10000, 50000, 100000, 500000.`
        + `<br/><color=#efbb01>Bước 2</c>: Bấm “Chơi ngay” để bắt đầu chơi. Hệ thống sẽ trả về ngẫu nhiên 1 lá bài để bạn đưa ra dự đoán của mình về lá bài tiếp theo`
        + `<br/><color=#efbb01>Bước 3</c>: Thực hiện dự đoán lá bài tiếp theo lớn hoặc nhỏ hơn lá bài hiện tại.`
        + `Bạn có 2p để đưa ra dự đoán của mình. Sau 2p mà chưa đưa ra dự đoán thì hệ thống sẽ tự động đưa ra 1 lựa chọn ngẫu nhiên`
        + `<br/><color=#efbb01>Bước 4</c>: Theo dõi kết quả để biết Thắng – Thua.`
        + `<br/><color=#FE4C45>Đặc biệt </c>`
        + `<br/>- Nếu lá bài tiếp theo trùng với lá bài hiện tại thì hệ thống sẽ trích <color=#efbb01>10%</c> tiền cược của người chơi cho vào Hũ thưởng`
        + `<br/>- <color=#FE4C45>NỔ HŨ</c>: Khi bạn thu thập đủ 3 cây Át (A) trong cùng 1 phiên chơi sẽ được <color=#FE4C45>NỔ HŨ</c> và dành được <color=#efbb01>50%</c> giá trị HŨ`
        
        this.richTextInfo.string = content
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