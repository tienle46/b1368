import app from 'app'
import DialogActor from 'DialogActor'
// import { destroy } from 'CCUtils'
import { numberFormat } from 'GeneralUtils'
import { formatBalanceShort } from 'GameUtils'
import TaiXiuTreoManager from 'TaiXiuTreoManager'

class TaiXiuTreoPopup extends DialogActor {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            transparentBg: cc.Node,
            bodyNode: cc.Node, // used on onBoardEnding's animations to prevent cc.delayTime
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
            taiUserBettedLabel: cc.Label,
            xiuIcon: cc.Node,
            xiuUsers: cc.Label,
            xiuTotalMoney: cc.Label,
            xiuUserBetLabel: cc.Label,
            xiuUserBettedLabel: cc.Label,
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
            phaseNode: cc.Node,
            phaseText: cc.Label,
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
        // this.node.active = false
        this.node.setPosition(-9999, -9999) // move to -9999, -9999 because cc_Node.runAction stops while inactive
        app.system.emit('tai.xiu.treo.on.close.btn.clicked')
    }
    
    showPopup() {
        // this.node.active = true
        this.node.setPosition(0, 0)
    }
    
    onDestroy() {
        super.onDestroy();
    }
    
    onTaiZoneClicked() {
        if(this._selectedBet == TaiXiuTreoManager.TAI_ID || !app.taiXiuTreoManager.allowBetting())
            return
            
        this.hideBetGroupPanel()
        
        this._selectedBet = TaiXiuTreoManager.TAI_ID
        
        app.system.emit('tai.xiu.treo.show.bet.group.panel')
    }
    
    onXiuZoneClicked() {
        if(this._selectedBet == TaiXiuTreoManager.XIU_ID || !app.taiXiuTreoManager.allowBetting())
            return
        
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
        this.betGroupPanel.opacity = 0
        this.betGroupPanel.setPosition(cc.v2(0, -500))
    }
    
    showBetGroupPanel() {
        this.betGroupPanel.active = true
        this.betGroupPanel.runAction(cc.spawn(cc.moveTo(.1, cc.v2(0, -257)), cc.fadeTo(.1, 255)))
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
    
    showPhase() {
        this.phaseNode.active = true
        this.phaseText.node.opacity = 255
    }
    
    hidePhase() {
        this.phaseNode.active = false
        this.phaseText.node.stopAllActions()
    }
    
    changePhase(text) {
        this.showPhase()
        this.phaseText.string = `${text}`
        
        let scaleTo = 1.2
        let origin = 1
        let duration = .1
        
        let a1 = cc.spawn(cc.scaleTo(duration, scaleTo, scaleTo), cc.fadeIn(duration))
        let a2 = cc.spawn(cc.scaleTo(duration, origin, origin), cc.fadeOut(duration))
        let action = cc.sequence(a1, a2).repeatForever()
        
        this.phaseText.node.runAction(action)
        
        this.phaseNode.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(() => {
            this.hidePhase()
        })))
    }
    
    onUserBetsSuccessfully(totalPlayerTai, totalPlayerXiu) {
        console.warn('this.ifAny(totalPlayerTai)', this.ifAny(totalPlayerTai), totalPlayerTai)
        if(this.ifAny(totalPlayerTai)) {
            console.warn('?', totalPlayerTai, totalPlayerXiu)
            this.taiUserBettedLabel.string = numberFormat(totalPlayerTai)
            this.taiUserBetLabel.string = 0
        } 
        if (this.ifAny(totalPlayerXiu)) {
            this.xiuUserBettedLabel.string = numberFormat(totalPlayerXiu)
            this.xiuUserBetLabel.string = 0
        }
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
                
                let y = item.getPosition().y
                let action = cc.sequence(
                    cc.moveTo(.3, cc.v2(this.node.getPosition().x, y + 35)), 
                    cc.moveTo(.3, cc.v2(this.node.getPosition().x, y))
                ).easing(cc.easeOut(2)).repeatForever()
                item.runAction(action)
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
    
    onBoardEnding(remainTime, data) {
        let {
            balanceChanged,
            option,
            dices,
            paybackTai,
            paybackXiu,
            totalPlayerTai,
            totalPlayerXiu
        } = data
        
        let balanceDuration = 3 // 3s to run animation for balancing phase
        let actions = []
        actions = [cc.callFunc(() => {
            this.taiUserBetLabel.string = 0
            this.xiuUserBetLabel.string = 0
            this.hideBetGroupPanel()
            this.onUserBetsSuccessfully(totalPlayerTai, totalPlayerXiu)
        })]
        
        if(remainTime > balanceDuration + 2) {
            let balancePhaseActions = [
                cc.callFunc(() => {
                    this.changePhase("Cân Kèo")
                }),
                cc.delayTime(balanceDuration),
                // cc.callFunc(() => {
                    
                // })
            ]
            actions = [...actions, ...balancePhaseActions]
        }
        
        let endActions = [
            cc.callFunc(() => {
                this.changePhase("Mở Bát")
            }),
            cc.delayTime(2),
            cc.callFunc(() => {                
                // balanceChanged -> runAnim changed balance
                this.balanceChanged(balanceChanged)
                
                // option -> runAnim noticing <-> runAnim open bowl
                this.isNanChecked() ?  this.showBowl() : this.hideBowl()
                // console.warn('balanceChanged', balanceChanged, 'option', option, 'remainTime', remainTime)
                this.countDownRemainTimeToNext(remainTime)
                
                // runAnim open bowl
                this.placeDices(dices)
                
                // runAnim noticing
                this.notification(option)
                
                // paybackTai, paybackXiu -> runAnimpayback -> show message
            })
        ]
        
        actions = [...actions, ...endActions]
        
        this.bodyNode.runAction(cc.sequence(actions))
    }
    
    resetData(bettedTai, bettedXiu) {
        this.hideBowl()
        this.hideTimeToNext()
        this.clearDices()
        this.hideBetGroupPanel()
        
        this.popupId.string = ""
        
        this.taiUsers.string = 0
        this.xiuUsers.string = 0
        
        this.taiTotalMoney.string = 0
        this.xiuTotalMoney.string = 0
        
        this.taiUserBettedLabel.string = bettedTai
        this.xiuUserBettedLabel.string = bettedXiu
        
        this.taiUserBetLabel.string = 0
        this.xiuUserBetLabel.string = 0
        
        this.taiIcon.stopAllActions()
        this.taiIcon.setScale(1, 1)
        
        this.xiuIcon.stopAllActions()
        this.xiuIcon.setScale(1, 1)
        
        this.hideChangedBalance()
        this.hidePhase()
    }
}

app.createComponent(TaiXiuTreoPopup);