import app from 'app'
import DialogActor from 'DialogActor'
import { destroy } from 'CCUtils'
import { numberFormat } from 'GeneralUtils'
import { formatBalanceShort } from 'GameUtils'
import TaiXiuTreoManager from 'TaiXiuTreoManager'

class TaiXiuTreoPopup extends DialogActor {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            transparentBg: cc.Node,
            popupId: cc.Label,
            timeToNextLbl: cc.Label,
            timeToNextBg: cc.Node,
            remainTime: cc.Label,
            remainTimeBg: cc.Node,
            nanCheckBox: cc.Toggle,
            taiIcon: cc.Node,
            taiUsers: cc.Label,
            taiTotalMoney: cc.Label,
            taiUserBetLabel: cc.Label,
            xiuIcon: cc.Node,
            xiuUsers: cc.Label,
            xiuTotalMoney: cc.Label,
            xiuUserBetLabel: cc.Label,
            historicalContainer: cc.Node,
            historicalSpriteItem: cc.Sprite,
            historicalSprites: {
                default: [],
                type: [cc.SpriteFrame]
            },
            virtualKeypadContainer: cc.Node,
            keyItem: cc.Node,
            keyText: cc.Label,
            betGroupPanel: cc.Node,
            betOptionGroupContainer: cc.Node,
            betItem: cc.Node,
            betItemAmount: cc.Label,
            dices: cc.SpriteAtlas,
            diceSprite: cc.Sprite,
            placedArea: cc.Node,
            bowl: cc.Node,
            balanceChangedNode: cc.Node,
            balanceChangedLabel: cc.Label,
        });
       
        this._selectedBet = null
    }

    onLoad() {
        super.onLoad();
        this.transparentBg.on('touchstart', () => {});

        this.hideTimeToNext()
        this.hideBetGroupPanel()
        this.iniKeypad()
    }
    
    onCloseBtnClick() {
        // destroy(this.node);
        this.node.active = false
        app.system.emit('tai.xiu.treo.on.close.btn.clicked')
    }
    
    showPopup() {
        this.node.active = true
    }
    
    onDestroy() {
        super.onDestroy();
    }
    
    onTaiZoneClicked() {
        this.hideBetGroupPanel()
        
        this._selectedBet = TaiXiuTreoManager.TAI_ID
        
        app.system.emit('tai.xiu.treo.show.bet.group.panel')
    }
    
    onXiuZoneClicked() {
        this.hideBetGroupPanel()
        
        this._selectedBet = TaiXiuTreoManager.XIU_ID
        app.system.emit('tai.xiu.treo.show.bet.group.panel')
    }
    
    onBetBtnClick(e) {
        let {amount} = e.currentTarget
        
        app.system.emit('tai.xiu.treo.on.bet.btn.clicked', amount, this._selectedBet)
    }
    
    hideRemainTimeBg() {
        this.remainTimeBg.active = false  
    }
    
    showRemainTimeBg() {
        this.remainTimeBg.active = true  
    }
    
    hideBowl() {
        this.bowl.active = false  
    }
    
    showBowl() {
        this.bowl.active = true  
    }
    
    isNanChecked() {
        return this.nanCheckBox.isChecked
    }
    
    clearDices() {
        this.placedArea.removeAllChildren()
    }
    
    onKeyBtnClick(e) {
        let {_text} = e.currentTarget
        app.system.emit('tai.xiu.treo.bet.text.clicked', _text, this._selectedBet)
    }
    
    onConfirmBtnClick() {
        app.system.emit('tai.xiu.treo.on.confirm.bet')
    }
    
    onHuyBtnClick() {
        if(this._selectedBet === null)
            return
        app.system.emit('tai.xiu.treo.on.cancel.btn.clicked', this._selectedBet)
    }
    
    placeDices(dices = []) {
        let randomPosInRange = [{ x: app._.random(-1, 1), y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 }]
        let acceptedArea = this.placedArea.getContentSize()
        let size = this.diceSprite.node.getContentSize()
        
        dices.forEach((dice, i) => {
            let posX = app._.random(app._.random(0, 1 / 2), randomPosInRange[i].x * (acceptedArea.width - size.width) / 2)
            // let posX = randomPosInRange[i].x * (acceptedArea.width/2 - size.width) / 2
            if(i != 0) 
                // posX <<= 1 
                posX = randomPosInRange[i].x * (acceptedArea.width - size.width) / 2 + randomPosInRange[i].x * app._.random(1/4, 1/2)
            
            let posY = app._.random(app._.random(0, 1 / 2), randomPosInRange[i].y * (acceptedArea.height - size.height) / 2)
           
            this.diceSprite.spriteFrame = this.dices.getSpriteFrame(`dice_${dice}`)
            
            let node = cc.instantiate(this.diceSprite.node)
            node.active = true
            node.setPosition(cc.v2(posX, posY))
            
            this.placedArea.addChild(node)
        });
    }
    
    onOtherBtnClick() {
        this.betOptionGroupContainer.active ? this.showKeypadPanel() : this.showBetOptionGroupContainer()
    }
    
    hideBetGroupPanel() {
        this.betGroupPanel.active = false
    }
    
    showBetGroupPanel() {
        this.betGroupPanel.active = true
    }
    
    hideBetOptionGroupContainer() {
        this.hideKeypadPanel();
        this.betOptionGroupContainer.active = false
    }
    
    showBetOptionGroupContainer() {
        this.hideKeypadPanel();
        this.betOptionGroupContainer.active = true
    }
    
    showKeypadPanel() {
        this.hideBetOptionGroupContainer()
        this.virtualKeypadContainer.active = true
    }
    
    hideKeypadPanel() {
        this.virtualKeypadContainer.active = false
    }
    
    iniKeypad() {
        let keys = Array.from(Array(10).keys())
        keys.push(`00`, `000`)
        
        keys.forEach(k => {
            this.keyText.string = k
            let key = cc.instantiate(this.keyItem)
            key.active = true
            key._text = k
            
            this.virtualKeypadContainer.addChild(key)
        })
    }
    
    hideTimeToNext() {
        this.timeToNextBg.active = false
    }
    
    showTimeToNext() {
        this.timeToNextBg.active = true
    }    
    
    countDownRemainTimeToNext(remainTime) {
        this.hideRemainTimeBg()
        this.showTimeToNext()
        this._countDownRemainTime(this.timeToNextLbl, remainTime, true, 'tai.xiu.treo.preparing.new.game')
    }
    
    countDownRemainTime(remainTime) {
        this.showRemainTimeBg()
        this.hideTimeToNext()
        // remove dices if any
        this.clearDices()
        
        this._countDownRemainTime(this.remainTime, remainTime)
    }
    
    notification(optionId) {
        let target = optionId == TaiXiuTreoManager.TAI_ID ? this.taiIcon : this.xiuIcon
        
        target.stopAllActions()
        
        target.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.1, 1.2, 1.2), cc.scaleTo(.1, 1, 1))))
    }
    
    _countDownRemainTime(lbl, remainTime, haveMinutes = false, emitter = undefined) {
        lbl.node.stopAllActions()
        
        lbl.node.runAction(cc.repeatForever(cc.sequence(
            cc.callFunc(() => {
                lbl.string = haveMinutes ? remainTime : this._secondsToMinutes(remainTime)    
                remainTime -= 1
                if(emitter && remainTime == 0) {
                    app.system.emit(emitter)
                }
                lbl.node.color = remainTime <= 5 ? cc.Color.RED : cc.Color.WHITE
                
                if(remainTime < 0) {
                    lbl.node.stopAllActions()
                }
            }),
            cc.delayTime(1)
        )))
    }
    
    showChangedBalance() {
        this.balanceChangedNode.active = true
        this.balanceChangedLabel.node.opacity = 255
    }
    
    hideChangedBalance() {
        this.balanceChangedNode.active = false
        this.balanceChangedLabel.node.setPosition(cc.v2(0,0))
    }
    
    balanceChanged(balanceChanged) {
        this.showChangedBalance()
        this.balanceChangedLabel.string = `${balanceChanged}`
        
        let action = cc.spawn(cc.moveTo(4, cc.v2(0, 150)), cc.fadeTo(4, 0))
        this.balanceChangedLabel.node.runAction(action)
    }
    
    onUserBetsSuccessfully(totalPlayerTai, totalPlayerXiu) {
        this.ifAny(totalPlayerTai) && (this.taiUserBetLabel.string = numberFormat(totalPlayerTai))
        this.ifAny(totalPlayerXiu) && (this.xiuUserBetLabel.string = numberFormat(totalPlayerXiu))
    }
    
    updateBetBalance(amount) {
        if(this._selectedBet === null)
            return
        
        this[this._selectedBet == TaiXiuTreoManager.TAI_ID ? 'taiUserBetLabel' : 'xiuUserBetLabel'].string = numberFormat(amount)
    }
    
    updateInfo(id, playerTaiCount, totalTaiAmount, playerXiuCount, totalXiuAmount) {
        id && (this.popupId.string = `#${id}`)
        
        this.ifAny(playerTaiCount) && (this.taiUsers.string = playerTaiCount)
        this.ifAny(playerXiuCount) && (this.xiuUsers.string = playerXiuCount)
        
        this.ifAny(totalTaiAmount) && (this.taiTotalMoney.string = numberFormat(totalTaiAmount))
        this.ifAny(totalXiuAmount) && (this.xiuTotalMoney.string = numberFormat(totalXiuAmount))
    }
    
    initBetOption(options) {
        if(!options || options.length < 1)
            return
        
        this.betOptionGroupContainer.removeAllChildren()
        options.forEach(amount => {
            this.betItemAmount.string = formatBalanceShort(amount)
            let item = cc.instantiate(this.betItem)
            item.active = true
            item.amount = amount
            
            this.betOptionGroupContainer.addChild(item)
        })
    }
    
    initHistories(histories) {
        if(!histories || histories.length < 1)
            return
        
        // xiu: 1, tai: 2
        let TaiXiuIdToSpriteId = {
            [TaiXiuTreoManager.XIU_ID]: 0,
            [TaiXiuTreoManager.TAI_ID]: 1
        }
        
        this.historicalContainer.removeAllChildren()
        histories.forEach((id, index) => {
            this.historicalSpriteItem.spriteFrame = this.historicalSprites[TaiXiuIdToSpriteId[id]]
            let item = cc.instantiate(this.historicalSpriteItem.node)
            item.active = true
            
            this.historicalContainer.addChild(item)
            if(index == histories.length - 1) {
                item.runAction(cc.repeatForever(cc.fadeTo(1, 0)))
            }
        })
    }
    
    _secondsToMinutes(secs) {
        // let now = moment();
        // let remainTime = Math.abs(now - startTime);
        
        // let duration = moment.duration(remainTime);
        // duration = moment.duration(duration.asSeconds(), 'seconds');
        
        // return duration.minutes() + ":" + duration.seconds()
        
        function pad(num) {
            return ("0"+num).slice(-2)
        }
        
        let minutes = Math.floor(secs / 60)
        secs = secs % 60
        minutes = minutes % 60
        
        return `${pad(minutes)}:${pad(secs)}`
    }
    
    ifAny(e) {
        return e === 0 || e
    }
    
    resetData() {
        this.hideBowl()
        this.hideTimeToNext()
        this.clearDices()
        this.hideBetGroupPanel()
        
        this.popupId.string = ""
        
        this.taiUsers.string = 0
        this.xiuUsers.string = 0
        
        this.taiTotalMoney.string = 0
        this.xiuTotalMoney.string = 0
        
        this.taiUserBetLabel.string = 0
        this.xiuUserBetLabel.string = 0
        
        this.taiIcon.stopAllActions()
        this.taiIcon.setScale(1, 1)
        
        this.xiuIcon.stopAllActions()
        this.xiuIcon.setScale(1, 1)
        
        this.hideChangedBalance()
    }
}

app.createComponent(TaiXiuTreoPopup);