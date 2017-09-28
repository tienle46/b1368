import app from 'app'
import Actor from 'Actor'
// import { destroy } from 'CCUtils'
import { numberFormat } from 'GeneralUtils'
import { formatBalanceShort } from 'GameUtils'
import TaiXiuTreoManager from 'TaiXiuTreoManager'
import ScrollMessagePopup from 'ScrollMessagePopup'
import Events from 'GameEvents'

class TaiXiuTreoPopup extends Actor {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            transparentBg: cc.Node,
            bgTaiXiuTreo: cc.Node,
            bodyNode: cc.Node, // used on onBoardEnding's animations to prevent cc.delayTime
            popupId: cc.Label,
            userMoneyLbl: cc.Label,
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
            diceArea: cc.Node,
            bowl: cc.Node,
            balanceChangedNode: cc.Node,
            balanceChangedLabel: cc.Label,
            phaseNode: cc.Node,
            phaseText: cc.Label,
            otherBtnNode: cc.Node,
            optionBtnNode: cc.Node,
            historyPrefab: cc.Prefab,
            soiCauPrefab: cc.Prefab,
            chatPrefab: cc.Prefab,
            rankPopupPrefab: cc.Prefab,
            lastHistoricalSprites: {
                default: [],
                type: cc.SpriteFrame
            }
        });
       
        this._selectedBet = null
        this._remainTime = 0
        this._diceNodes = []
        this._waitUntilUserOpensBowl = null
        this._endPhaseRunning = false
        this._acceptedMinBet = 0
        this._chatComponent = null // uses to save ChatPopup instance
    }

    onLoad() {
        super.onLoad();
        this.transparentBg.on('touchstart', () => {});
        
        this.hideTimeToNext()
        this.hideBetGroupPanel()
        this.iniKeypad()
               
        this._bowlPos = this.bowl.getPosition()
        
        this.bowl.on(cc.Node.EventType.TOUCH_MOVE, this._onBowlMoving, this)
        
        this.nanCheckBox.isChecked = app.taiXiuTreoManager.isNan()
        this._acceptedMinBet = 0
    }
    
    onChatBoxHide() {
        this.bgTaiXiuTreo.runAction(
            cc.moveTo(.1, cc.v2(0, this.bgTaiXiuTreo.getPosition().y))
        )
    }
    
    onChatBoxShow() {
        this.bgTaiXiuTreo.runAction(
            cc.moveTo(.1, cc.v2(-169, this.bgTaiXiuTreo.getPosition().y))
        ) 
    }
    
    onEnable() {
        super.onEnable()
        app.system.addAppStateListener(this)    
    }
    
    onDestroy() {
        super.onDestroy()
        app.system.removeAppStateListener(this)
        
        this._selectedBet = null
        this._remainTime = 0
        this._diceNodes = []
        this._waitUntilUserOpensBowl = null
        this._endPhaseRunning = false    
    }
    
    _addGlobalListener() {
       super._addGlobalListener()
       app.system.addListener('tai.xiu.treo.popup.update.count.down', this._onUpdateCountDown, this);
    }

    _removeGlobalListener() {
       super._removeGlobalListener()
       app.system.removeListener('tai.xiu.treo.popup.update.count.down', this._onUpdateCountDown, this);
    }
    
    _onUpdateCountDown(remainTime, state) {
        this._remainTime = remainTime
        if(state !== TaiXiuTreoManager.GAME_STATE_END) {
            this._resetIconAnimation()
        }
    }
    
    updateUserMoney(amount) {
        this.userMoneyLbl.string = numberFormat(amount)
    }
    
    onChatBtnClick() {
        if(!this._chatComponent) {
            let node = cc.instantiate(this.chatPrefab)
            node.opacity = 0
            node.setPosition(857, 35)
            this._chatComponent = node.getComponent(TaiXiuTreoPopup.CHAT_COMPONENT)
            
            node.on('chat.box.hide', this.onChatBoxHide, this)
            
            node.on('chat.box.show', this.onChatBoxShow, this)
            
            this.node.addChild(node)
        }
        
        this._chatComponent.toggle()
    }
    
    onCloseBtnClick() {
        this.node.setPosition(-9999, -9999) // move to -9999, -9999 because cc_Node.runAction stops while inactive
        app.system.emit(Events.TAI_XIU_TREO_ON_CLOSE_BTN_CLICKED)
    }
    
    showPopup() {
        // this.node.active = true
        this.node.setPosition(0, 0)
    }
    
    onTaiZoneClicked() {
        if(this._selectedBet == TaiXiuTreoManager.TAI_ID || !app.taiXiuTreoManager.allowBetting())
            return
            
        this.hideBetGroupPanel()
        
        this._selectedBet = TaiXiuTreoManager.TAI_ID
        
        app.system.emit(Events.TAI_XIU_TREO_SHOW_BET_GROUP_PANEL)
    }
    
    onXiuZoneClicked() {
        if(this._selectedBet == TaiXiuTreoManager.XIU_ID || !app.taiXiuTreoManager.allowBetting())
            return
        
        this.hideBetGroupPanel()
        
        this._selectedBet = TaiXiuTreoManager.XIU_ID
        app.system.emit(Events.TAI_XIU_TREO_SHOW_BET_GROUP_PANEL)
    }
    
    onBetBtnClick(e) {
        let {amount} = e.currentTarget
        
        app.system.emit(Events.TAI_XIU_TREO_ON_BET_BTN_CLICKED, amount, this._selectedBet)
    }
    
    onAppStateChange(state) {
        app.system.emit(Events.TAI_XIU_TREO_ON_APP_STATE_CHANGED, state)  
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
    
    onNanBtnClick() {
        app.system.emit(Events.TAI_XIU_TREO_NAN_BTN_CLICKED, this.nanCheckBox.isChecked)
    }
    
    isNanChecked() {
        return this.nanCheckBox.isChecked
    }
    
    clearDices() {
        this.diceArea.removeAllChildren(false)
        this._diceNodes = []
    }
    
    onKeyBtnClick(e) {
        let {_text} = e.currentTarget
        app.system.emit(Events.TAI_XIU_TREO_BET_TEXT_CLICKED, _text, this._selectedBet)
    }
    
    onConfirmBtnClick() {
        app.system.emit(Events.TAI_XIU_TREO_ON_CONFIRM_BTN_CLICKED)
    }
    
    getMinBet() {
        return this._acceptedMinBet    
    }
    
    onHuyBtnClick() {
        if(this._selectedBet === null)
            return
        app.system.emit(Events.TAI_XIU_TREO_ON_CANCEL_BTN_CLICKED)
    }
    
    placeDices(dices = []) {
        this.clearDices()

        let positions = [{ x: -19, y: 74.9 }, { x: 18.3, y: 27.5 }, { x: -45.3, y: 27 }]
        
        dices.forEach((dice, i) => {
            let {x, y} = positions[i]
            this.diceSprite.spriteFrame = this.dices.getSpriteFrame(`dice_${dice}`)
            
            let node = cc.instantiate(this.diceSprite.node)
            node.active = true
            node.setPosition(cc.v2(x, y))
            
            this._diceNodes.push(node)
            
            this.diceArea.addChild(node)
        });
    }
    
    getBowlRadius() {
        return (this.bowl.getContentSize().width - 20 )/ 2 
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
        this.otherBtnNode.active = false
        this.optionBtnNode.active = true
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
        this.otherBtnNode.active = true
        this.optionBtnNode.active = false
    }
    
    iniKeypad() {
        let keys = Array.from(Array(10).keys())
        keys.push(`000`, `${TaiXiuTreoManager.BACK_SYMBOL}`)
        
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
    
    resetBowlPosition() {
        this.bowl.setPosition(this._bowlPos)
    }
    
    countDownRemainTimeToNext(remainTime) {
        this.hideRemainTimeBg()
        this.showTimeToNext()
        this._countDownRemainTime(this.timeToNextLbl, remainTime, true, Events.TAI_XIU_TREO_PREPARING_NEW_GAME)
    }
    
    countDownRemainTime(remainTime) {
        this.showRemainTimeBg()
        this.hideTimeToNext()
        // remove dices if any
        this.clearDices()
        
        this._countDownRemainTime(this.remainTime, remainTime)
    }
    
    annoucement(optionId, time) {
        this._resetIconAnimation()
        let target = optionId == TaiXiuTreoManager.TAI_ID ? this.taiIcon : this.xiuIcon
        let action = cc.sequence(cc.scaleTo(.1, 1.2, 1.2), cc.scaleTo(.1, 1, 1))
        target.runAction(action.repeatForever())
        target.runAction(cc.sequence(cc.delayTime(time >= 2? time - 2 : 0), cc.callFunc(() => {
            this._resetIconAnimation()
        })))
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
        this.balanceChangedLabel.string = balanceChanged >= 0 ? `+${numberFormat(balanceChanged)}`  : `${numberFormat(balanceChanged)}`
        
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
    
    changePhase(text, delayTime = 1) {
        this.showPhase()
        this.phaseText.string = `${text}`
        
        let scaleTo = 1.2
        let origin = 1
        let duration = .1
        
        let a1 = cc.spawn(cc.scaleTo(duration, scaleTo, scaleTo), cc.fadeIn(duration))
        let a2 = cc.spawn(cc.scaleTo(duration, origin, origin), cc.fadeOut(duration))
        let action = cc.sequence(a1, a2).repeatForever()
        
        this.phaseText.node.runAction(action)
        
        this.phaseNode.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(() => {
            this.hidePhase()
        })))
    }
    
    onUserBetsSuccessfully(totalPlayerTai, totalPlayerXiu) {
        if(this._ifAny(totalPlayerTai)) {
            this.taiUserBettedLabel.string = numberFormat(totalPlayerTai)
            this.taiUserBetLabel.string = 0
        } 
        if (this._ifAny(totalPlayerXiu)) {
            this.xiuUserBettedLabel.string = numberFormat(totalPlayerXiu)
            this.xiuUserBetLabel.string = 0
        }
    }
    
    updateBetBalance(amount, isBoth = false) {
        if(this._selectedBet === null)
            return
        
        if(isBoth) {
            this.taiUserBetLabel.string = numberFormat(amount)
            this.xiuUserBetLabel.string = numberFormat(amount)
        } else
            this[this._selectedBet == TaiXiuTreoManager.TAI_ID ? 'taiUserBetLabel' : 'xiuUserBetLabel'].string = numberFormat(amount)
    }
    
    updateInfo(id, totalTaiCount, totalTaiAmount, totalXiuCount, totalXiuAmount) {
        id && (this.popupId.string = `#${id}`)
        
        this._ifAny(totalTaiCount) && (this.taiUsers.string = totalTaiCount)
        this._ifAny(totalXiuCount) && (this.xiuUsers.string = totalXiuCount)
        
        this._ifAny(totalTaiAmount) && (this.taiTotalMoney.string = numberFormat(totalTaiAmount))
        this._ifAny(totalXiuAmount) && (this.xiuTotalMoney.string = numberFormat(totalXiuAmount))
    }
    
    initBetOption(options) {
        if(!options || options.length < 1)
            return
        
        this._acceptedMinBet = options[0]
        
        this.betOptionGroupContainer.removeAllChildren(false)
        options.forEach(amount => {
            this.betItemAmount.string = formatBalanceShort(amount)
            let item = cc.instantiate(this.betItem)
            item.active = true
            item.amount = amount
            
            this.betOptionGroupContainer.addChild(item)
        })
    }
    
    initHistories(histories, state) {
        if(!histories || histories.length < 1)
            return
        
        if(histories.length > 18) {
            histories = histories.slice(-18)
        }
        
        // xiu: 1, tai: 2
        let TaiXiuIdToSpriteId = {
            [TaiXiuTreoManager.XIU_ID]: 0,
            [TaiXiuTreoManager.TAI_ID]: 1
        }
        
        this.historicalContainer.removeAllChildren(false)
        histories.forEach((id, index) => {
            this.historicalSpriteItem.spriteFrame = (index == histories.length - 1) ? 
                        this.lastHistoricalSprites[TaiXiuIdToSpriteId[id]] :
                        this.historicalSprites[TaiXiuIdToSpriteId[id]]
                        
            let item = cc.instantiate(this.historicalSpriteItem.node)
            item.active = true
            
            this.historicalContainer.addChild(item)
            if(index == histories.length - 1) {
                if(state === TaiXiuTreoManager.GAME_STATE_END) {
                    let y = item.getPosition().y
                    let action = cc.sequence(
                        cc.moveTo(.4, cc.v2(this.node.getPosition().x, y + 10)), 
                        cc.moveTo(.4, cc.v2(this.node.getPosition().x, y))
                    ).easing(cc.easeOut(2)).repeatForever()
                    item.runAction(action)
                }
            }
        })
    }
    
    onBoardEnding(duration, remainTime, data, state) {
        let {
            balanceChanged,
            option,
            dices,
            paybackTai,
            paybackXiu,
            taiAmount,
            xiuAmount,
            balance,
            histories
        } = data
        
        this.hideRemainTimeBg()
        
        let balanceDuration = 3 // 3s to run animation for balancing phase
        
        let actions = [
            cc.callFunc(() => {
                this.taiUserBetLabel.string = 0
                this.xiuUserBetLabel.string = 0
                this.hideBetGroupPanel()
                this.onUserBetsSuccessfully(taiAmount, xiuAmount)
            }),
            ...(remainTime > duration - (balanceDuration + 1) ? [
                cc.callFunc(() => {
                    this.changePhase("Cân Kèo")
                }),
                cc.delayTime(balanceDuration),
            ]: [])
        ]
        
        this._remainTime = remainTime - balanceDuration
        
        let beforeEndPhaseActions = [
            cc.callFunc(() => {
                app.context.setBalance(app.context.getMeBalance() + paybackTai + paybackXiu)
                this.updateUserMoney(app.context.getMeBalance())
            }),
            ...(remainTime > duration - (balanceDuration + 3) ? [
                cc.callFunc(() => {
                    this.changePhase("Mở Bát")
                })
            ] : []),
            cc.delayTime(1),
            cc.callFunc(() => {
                this._remainTime -= 1
                
                this.countDownRemainTimeToNext(this._remainTime)
                
                if(this.isNanChecked()) {
                    this.showBowl()
                    this._waitUntilUserOpensBowl = this.endPhaseAnimation.bind(this, balance, balanceChanged, option, histories, state)
                } else {
                    this.hideBowl()
                    this.endPhaseAnimation(balance, balanceChanged, option, histories, state)                
                }
                
                // runAnim open bowl
                this.placeDices(dices)
            })
        ]
        
        actions = [...actions, ...beforeEndPhaseActions]
        
        this.bodyNode.runAction(cc.sequence(actions))
    }
    
    endPhaseAnimation(balance, balanceChanged, option, histories, state) {
        this.hideBowl()
        
        this._endPhaseRunning = true
        
        // balanceChanged -> runAnim changed balance
        balanceChanged && this.balanceChanged(balanceChanged)
        
        // update user money
        if(balance) {
            app.context.setBalance(balance)
            this.updateUserMoney(balance)
        }
        
        // runAnim noticing
        this.annoucement(option, this._remainTime)
        
        this.initHistories(histories, state)    
    }
    
    openHistoryPopup() {
        return cc.instantiate(this.historyPrefab)
    }
    
    openSoiCauPopup() {
        return cc.instantiate(this.soiCauPrefab)
    }
    
    openRankPopup() {
        return cc.instantiate(this.rankPopupPrefab)
    }
    
    onRankBtnClick() {
        app.system.emit(Events.TAI_XIU_TREO_RANK_BTN_CLICKED)
    }
    
    onHistoryBtnClick() {
        app.system.emit(Events.TAI_XIU_TREO_HISTORY_CLICKED)
    }
    
    onSoiCauBtnClick() {
        app.system.emit(Events.TAI_XIU_TREO_SOI_CAU_CLICKED)
    }
    
    resetData(bettedTai, bettedXiu) {
        this.hideBowl()
        this.hideTimeToNext()
        this.clearDices()
        this.hideBetGroupPanel()
        
        this.resetBowlPosition()
        
        this._remainTime = 0
        this._selectedBet = null
        this.popupId.string = ""
        this._waitUntilUserOpensBowl = null
        this._endPhaseRunning = false
        
        this._resetLbls()
        
        this.taiUserBettedLabel.string = bettedTai
        this.xiuUserBettedLabel.string = bettedXiu
        
        this._resetIconAnimation()
        
        this.hideChangedBalance()
        this.hidePhase()
    }
    
    onClickInfoBtn() {
        ScrollMessagePopup.show(this.node, {
            cmd: app.commands.MINIGAME_TAI_XIU_GUIDE,
            parser: (data) => {
                return data[app.keywords.EVENT_CONTENT] || "";
            }
        });
    }
    
    _getPointOfDice(diceNode) {
        // let localPos = diceNode.getPosition()
        let localPos = this.diceArea.convertToNodeSpace(diceNode.getPosition())
        localPos.y *= 4 / 3
        return {x: localPos.x, y: localPos.y}
    }
    
    _distanceBetween2Points(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    }
    
    _arePointsOutOfBowl(points) {
        // let worldBowlPos = this.bowl.getPosition()
        let worldBowlPos = this.diceArea.convertToNodeSpace(this.bowl.getPosition())
        let radius = this.getBowlRadius()
        
        let distances = []
        
        points.forEach(point => {
            distances.push(this._distanceBetween2Points(point, worldBowlPos))
        })
        return distances.every(distance => distance > radius)
    }
    
    _onBowlMoving(e) {
        let points = this._diceNodes.map(dice => this._getPointOfDice(dice))
        console.warn('points', points)
        if(this._arePointsOutOfBowl(points) && !this._endPhaseRunning) {
            this._waitUntilUserOpensBowl && this._waitUntilUserOpensBowl()
        }
    }
    
    _countDownRemainTime(lbl, remainTime, haveMinutes = false, emitter = undefined) {
        lbl.node.stopAllActions()
        this._remainTime = remainTime
        lbl.node.runAction(cc.repeatForever(cc.sequence(
            cc.callFunc(() => {
                lbl.string = haveMinutes ? this._remainTime : this._secondsToMinutes(this._remainTime)    
                this._remainTime -= 1
                if(emitter && this._remainTime == 0) {
                    app.system.emit(emitter)
                }
                lbl.node.color = this._remainTime <= 5 ? cc.Color.RED : cc.Color.BLACK
                
                if(this._remainTime < 0) {
                    this._remainTime = 0
                    lbl.node.stopAllActions()
                }
            }),
            cc.delayTime(1)
        )))
    }
    
    _secondsToMinutes(secs) {
        function pad(num) {
            return ("0"+num).slice(-2)
        }
        
        let minutes = Math.floor(secs / 60)
        secs = secs % 60
        minutes = minutes % 60
        
        return `${pad(minutes)}:${pad(secs)}`
    }
    
    _ifAny(e) {
        return e === 0 || e
    }
    
    _resetLbls() {
        this.taiUsers.string = 0
        this.xiuUsers.string = 0
        
        this.taiTotalMoney.string = 0
        this.xiuTotalMoney.string = 0
        
        this.taiUserBetLabel.string = 0
        this.xiuUserBetLabel.string = 0
    }
    
    _resetIconAnimation() {
        this.taiIcon.stopAllActions()
        this.taiIcon.setScale(1, 1)
        
        this.xiuIcon.stopAllActions()
        this.xiuIcon.setScale(1, 1)
    }
    
    update(dt) {
        if(app.taiXiuTreoManager.isEnding() && this._remainTime <= 5 && !this._endPhaseRunning) {
            this._waitUntilUserOpensBowl && this._waitUntilUserOpensBowl()
        }
    }
}

TaiXiuTreoPopup.CHAT_COMPONENT = 'HungSicboChatPopup'

app.createComponent(TaiXiuTreoPopup);