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
        let content = `<color=#1CFF22>Bước 1</c>: Đăng nhập vào game bài 1368 và chọn Mini game Cao thấp`
        + `<br/><color=#1CFF22>Bước 2</c>: Chọn mức cược: Bạn có thể chọn ngẫu nhiên 1 trong 5 mức cược tùy thuộc vào số dư tài khoản và chiến thuật của mình:`
        + `<color=#efbb01>1000</c>, <color=#efbb01>10000</c>, <color=#efbb01>50000</c>, <color=#efbb01>100000</c>, <color=#efbb01>500000</c>.`
        + `<br/><color=#1CFF22>Bước 3</c>: Click nút <color=#efbb01>Chơi ngay</c> để bắt đầu chơi, sau khi click hệ thống sẽ ngẫu nhiên xuất hiện 1 lá bài để người chơi đưa ra quyết định dự đoán lá bài tiếp theo lớn hơn hay nhỏ hơn lá bài hiện tại.`
        + `<br/><color=#1CFF22>Bước 4</c>: Theo dõi kết quả:`
        + `<br/>+ Nếu người chơi cược thắng thì số tiền nhận được sẽ tăng lên theo tỷ lệ.`
        + `<br/>+ Nếu người chơi thua sẽ mất toàn bộ tiền cược.`
        + `<br/>+ Nếu người chơi đoán trúng đủ 3 quân Át thì sẽ giành được 1/2 số tiền trong hũ (<color=#efbb01>nổ hũ</c>)`
        + `<br/><color=#FE4C45>Lưu ý </c>`
        + `<br/>- Người chơi có thể ấn nút lượt mới để lấy số tiền thắng và chuyển qua ván mới`
        + `<br/>- Thời gian tối đa cho mỗi lần đoán là 60 giây, sau 60 giây hệ thống sẽ tính toán kết quả và chuyển sang ván mới`
        
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