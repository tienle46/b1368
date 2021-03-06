import app from 'app';
import Actor from 'Actor';
import TaiXiuTreoManager from 'TaiXiuTreoManager';
import {timeFormat} from 'GeneralUtils';
import {formatBalanceShort} from 'GameUtils';

class HungSicboHistoryPopup extends Actor {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            bgTransparent: cc.Node,
            container: cc.Node,
            historicalItem: cc.Node,
            itemIdLbl: cc.Label,
            dateLbl: cc.Label,
            betted: cc.RichText,
            result: cc.RichText,
            receive: cc.Label,
            payback: cc.Label
        })
    }

    onLoad() {
        super.onLoad();
        // this._initComponents();
        this.bgTransparent.on('touchstart', function() {
            return;
        });
        this.dateLbl.string = ""
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.MINIGAME_TAI_XIU_HISTORY, this._onTaiXiuHistory, this)
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.MINIGAME_TAI_XIU_HISTORY, this._onTaiXiuHistory, this)
    }
    
    start() {
        super.start();
        app.service.send({cmd: app.commands.MINIGAME_TAI_XIU_HISTORY})
    }
    
    onDestroy() {
        super.onDestroy();
    }
    
    _onTaiXiuHistory(data) {
        let {histories} =  data
        if(histories.length > 0) {
            histories.forEach(history => {
                let {
                    id,
                    changedAmount,
                    option,
                    paybackTai,
                    paybackXiu,
                    playerName,
                    taiAmount,
                    time,
                    xiuAmount,
                    point
                } = history
                
                this._addItem(id, changedAmount, option, paybackTai, paybackXiu, playerName, taiAmount, time, xiuAmount, point)
            })
        }
    }
    
    _addItem(id, changedAmount, option, paybackTai, paybackXiu, playerName, taiAmount, time, xiuAmount, point) {
        this.itemIdLbl.string = `${id}`
        time && (this.dateLbl.string = timeFormat(time, 'DD/MM/YYYY HH:mm'))
        this.betted.string = `${this._color('Tài', HungSicboHistoryPopup.COLOR_ORANGE)} - ${formatBalanceShort(taiAmount)}\n${this._color('Xỉu', HungSicboHistoryPopup.COLOR_CYAN)} - ${formatBalanceShort(xiuAmount)}`

        let result = this._onResult(option)
        this.result.string = `${this._color(result.text, result.color)} - ${this._color(point, HungSicboHistoryPopup.COLOR_RED)}`
        this.receive.string = `${formatBalanceShort(changedAmount)}`
        this.payback.string = formatBalanceShort(paybackTai + paybackXiu)
        
        let item = cc.instantiate(this.historicalItem)
        item.active = true
        this.container.addChild(item)
    }
    
    _color(string, color) {
        return `<color=${color.toCSS("#rrggbb")}>${string}</c>`    
    }
    
    _onResult(option) {
        let isTai = this._isTai(option)
        return {
            text: isTai ? 'Tài' : 'Xỉu',
            color: isTai ? HungSicboHistoryPopup.COLOR_ORANGE : HungSicboHistoryPopup.COLOR_CYAN
        }
    }
    
    _isTai(option) {
        return option === TaiXiuTreoManager.TAI_ID
    }
    
    onCloseBtnClick() {
        this.node.destroy()
    }
}

HungSicboHistoryPopup.COLOR_RED = cc.Color.RED
HungSicboHistoryPopup.COLOR_GREEN = cc.Color.GREEN
HungSicboHistoryPopup.COLOR_CYAN = cc.Color.CYAN
HungSicboHistoryPopup.COLOR_ORANGE = cc.Color.ORANGE

app.createComponent(HungSicboHistoryPopup);