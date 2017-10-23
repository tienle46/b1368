import app from 'app'
import Actor from 'Actor'
// import { destroy } from 'CCUtils'
import { numberFormat } from 'GeneralUtils'
import { formatBalanceShort } from 'GameUtils'
import TaiXiuTreoManager from 'TaiXiuTreoManager'
import Events from 'GameEvents'
import Draggable from 'Draggable'

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
            deleteItem: cc.Node,
            keyItem: cc.Node,
            keyText: cc.Label,
            betGroupPanel: cc.Node,
            betOptionGroupContainer: cc.Node,
            betItem: cc.Node,
            betItemAmount: cc.Label,
            dices: cc.SpriteAtlas,
            diceSprite: cc.Sprite,
            diceArea: cc.Node,
            bowl: Draggable,
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
            },
            diceAnimAtlas: cc.SpriteAtlas,
            runAnimNode: cc.Node,
            
            winStreakNode: cc.Node,
            loseStreakNode: cc.Node,
            winLbl: cc.Label,
            loseLbl: cc.Label
        });
       
        this._selectedBet = null
        this._remainTime = 0
        this._diceNodes = []
        this._waitUntilUserOpensBowl = null
        this._popupAnimationState = TaiXiuTreoPopup.POPUP_ANIM_STATE_IDLE
        this._acceptedMinBet = 0
        this._chatComponent = null // uses to save ChatPopup instance
        
        if(app.config.tai_xiu_treo_kq) {
            this._clickCounter = 0
        }
    }
    
    streakAppear(active) {
        this.winStreakNode.active = active
        this.loseStreakNode.active = active
    }
    
    setWinStreak(total) {
        this.winLbl.string = total
    }
    
    setLoseStreak(total) {
        this.loseLbl.string = total
    }
    
    onLoad() {
        super.onLoad();
        this.transparentBg.on('touchstart', () => {});
        
        this.hideTimeToNext()
        this.hideBetGroupPanel()
        this.iniKeypad()
        
        this._bowlPos = this.bowl.node.getPosition()
        this.bowl.node.on(cc.Node.EventType.TOUCH_MOVE, this._onBowlMoving, this)

        this.nanCheckBox.isChecked = app.taiXiuTreoManager.isNan()
        this._acceptedMinBet = 0
        
        this.onChatBtnClick()
        
        this.showBowl()
    }
    
    start() {
        super.start()
        this.bowl.lock()    
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
        this._popupAnimationState = TaiXiuTreoPopup.POPUP_ANIM_STATE_IDLE    
    }
    
    _addGlobalListener() {
       super._addGlobalListener()
       
       app.system.addListener(Events.TAI_XIU_TREO_ON_UPDATE_COUNT_DOWN, this._onUpdateCountDown, this);
       app.system.addListener(app.commands.MINIGAME_TAI_XIU_GET_OPTION, this._onTaiXiuGetOption, this);
    }

    _removeGlobalListener() {
       super._removeGlobalListener()
       app.system.removeListener(Events.TAI_XIU_TREO_ON_UPDATE_COUNT_DOWN, this._onUpdateCountDown, this);
       app.system.removeListener(app.commands.MINIGAME_TAI_XIU_GET_OPTION, this._onTaiXiuGetOption, this);
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
    
    hiddenFunction(e) {
        let btn = e.currentTarget
        if(app.config.tai_xiu_treo_kq) {
            this._clickCounter ++ 
            if(btn.getNumberOfRunningActions())
               return
                
            btn.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => {
                if(this._clickCounter >=2 && app.taiXiuTreoManager.allowBetting()) {
                    app.service.send({cmd: app.commands.MINIGAME_TAI_XIU_GET_OPTION})
                }
                this._clickCounter = 0
            })))
        }
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
        if(this.bowl.node.active)
            this.bowl.node.active = false  
    }
    
    showBowl() {
        if(!this.bowl.node.active)
            this.bowl.node.active = true  
    }
    
    onNanBtnClick() {
        app.system.emit(Events.TAI_XIU_TREO_NAN_BTN_CLICKED, this.nanCheckBox.isChecked)
    }
    
    isNanChecked() {
        return this.nanCheckBox.isChecked
    }
    
    clearDices() {
        if(this._diceNodes.length > 0) {
            this.diceArea.removeAllChildren(false)
            this._diceNodes = []
        }
    }
    
    onKeyBtnClick(e) {
        let {_text} = e.currentTarget
        app.system.emit(Events.TAI_XIU_TREO_BET_TEXT_CLICKED, _text, this._selectedBet)
    }
    
    onDeleteBtnClick() {
        let _text = TaiXiuTreoManager.BACK_SYMBOL
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

        let positions = [{ x: -19, y: 70.9 }, { x: 18.3, y: 23.5 }, { x: -45.3, y: 23 }]
        
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
        return (this.bowl.node.getContentSize().width - 20 )/ 2 
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
        let keys = Array.from(Array(9).keys()).map(a => a + 1)
        keys.push(`0`,`000`)
        
        keys.forEach(k => {
            this.keyText.string = k
            let key = cc.instantiate(this.keyItem)
            key.active = true
            key._text = k
            
            this.virtualKeypadContainer.addChild(key)
        })
        
        //delete
        let deleteItem = cc.instantiate(this.deleteItem)
        deleteItem.active = true
        this.virtualKeypadContainer.addChild(deleteItem)
    }
    
    hideTimeToNext() {
        if(this.timeToNextBg.active)
            this.timeToNextBg.active = false
    }
    
    showTimeToNext() {
        if(!this.timeToNextBg.active)
            this.timeToNextBg.active = true
    }    
    
    resetBowlPosition() {
        this.bowl.node.setPosition(this._bowlPos)
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
        target.runAction(cc.sequence(cc.delayTime(time >= 2? time - .5 : 0), cc.callFunc(() => {
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
        this.phaseText.node.opacity = 0
    }
    
    hidePhase() {
        this.phaseNode.active = false
        this.phaseText.node.stopAllActions()
    }
    
    changePhase(text, delayTime = 1) {
        this.showPhase()
        this.phaseText.string = `${text}`
        
        this.phaseNode.runAction(cc.sequence(
            cc.callFunc(() => {
                this.phaseText.node.runAction(cc.fadeIn(.3))
            }),
            cc.delayTime(delayTime),
            cc.callFunc(() => {
                this.phaseText.node.runAction(cc.fadeOut(.5))
            }),
            cc.callFunc(() => {
                this.hidePhase()
            })
        ))
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
        if(this._popupAnimationState >= TaiXiuTreoPopup.POPUP_ANIM_STATE_ON_BOARD_END)
            return
        
        this._popupAnimationState = TaiXiuTreoPopup.POPUP_ANIM_STATE_ON_BOARD_END
        
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
        this.bowl.lock()
        this.hideRemainTimeBg()
        
        let balanceDuration = 2 // 2s to run animation for balancing phase
        
        let actions = [
            cc.callFunc(() => {
                this.taiUserBetLabel.string = 0
                this.xiuUserBetLabel.string = 0
                this.hideBetGroupPanel()
                this.onUserBetsSuccessfully(taiAmount, xiuAmount)
                this.showBowl()
            }),
            ...(remainTime > duration - (balanceDuration + 1) ? [
                cc.callFunc(() => {
                    this.changePhase("Cân kèo")
                }),
                cc.delayTime(balanceDuration),
            ]: [])
        ]
        
        if(remainTime <= 6) {
            actions = [...actions, cc.callFunc(() => {
                this._remainTime = remainTime - 1
                this.countDownRemainTimeToNext(this._remainTime)
                
                this.endPhaseAnimation(balance, balanceChanged, option, histories, state)
                // runAnim open bowl
                this.placeDices(dices)
            })]
            this.bodyNode.runAction(cc.sequence(actions))
            return
        } 
        
        let diceAnim = this._getDiceAnimClip(this.diceAnimAtlas, this.runAnimNode, () => {
            let afterDicesDown;

            this.showBowl()
            afterDicesDown = [
                ...(remainTime > duration - (balanceDuration + 2)? [
                    cc.callFunc(() => {
                        this.changePhase("Mở Bát")
                    })
                ] : []),
                cc.delayTime(1),
                cc.callFunc(() => {
                    this._remainTime = remainTime - balanceDuration - diceAnim.duration - 2
                    this.countDownRemainTimeToNext(this._remainTime)
                    
                    if(this.isNanChecked()) {
                        this.bowl.unlock()
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
            
            this.bodyNode.runAction(cc.sequence(afterDicesDown))
        })
        
        if(diceAnim) {
            let beforeEndPhaseActions = [
                cc.callFunc(() => {
                    this.hideBowl()
                    app.context.setBalance(app.context.getMeBalance() + paybackTai + paybackXiu)
                    this.updateUserMoney(app.context.getMeBalance())
                    diceAnim.animation.play(diceAnim.name)
                }),
            ]
            
            actions = [...actions, ...beforeEndPhaseActions]
            this.bodyNode.runAction(cc.sequence(actions))
        }
    }
    
    endPhaseAnimation(balance, balanceChanged, option, histories, state) {
        this.hideBowl()
        
        this._popupAnimationState = TaiXiuTreoPopup.POPUP_ANIM_STATE_ENDED
        
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
    
    getRemainTime() {
        return this._remainTime
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
        
        this.bowl.lock()
        
        this._remainTime = 0
        this._selectedBet = null
        this.popupId.string = ""
        this._waitUntilUserOpensBowl = null
        this._popupAnimationState = TaiXiuTreoPopup.POPUP_ANIM_STATE_IDLE
        
        this._resetLbls()
        
        this.taiUserBettedLabel.string = bettedTai
        this.xiuUserBettedLabel.string = bettedXiu
        
        this._resetIconAnimation()
        
        this.hideChangedBalance()
        this.hidePhase()
    }
    
    onClickInfoBtn() {
        // ScrollMessagePopup.show(this.node, {
        //     cmd: app.commands.MINIGAME_TAI_XIU_GUIDE,
        //     parser: (data) => {
        //         return data[app.keywords.EVENT_CONTENT] || "";
        //     }
        // });
        
        let dialog = cc.instantiate(app.res.prefab.webviewDialog);
        const dialogComponent = dialog.getComponent('WebviewDialog');
        dialogComponent.loadURL('https://bai1368.com/game/uploadfiles/event-taixiu.htm');
        app.system.getCurrentSceneNode().addChild(dialog, TaiXiuTreoManager.HISTORY_ZINDEX);
    }
    
    /**
     * 
     * @param {any} atlas
     * @param {any} node : parent node which contains animating node
     * @returns {animation: cc.Animation, duration: Int}
     * @memberof TaiXiuTreoPopup
     */
    _getDiceAnimClip(atlas, node, cb) {
        if (atlas && atlas.getSpriteFrames().length > 0) {

            const animatingNode = new cc.Node();
            const animation = animatingNode.addComponent(cc.Animation);

            const sprite = animatingNode.addComponent(cc.Sprite);
            let spriteFrames = atlas.getSpriteFrames();
            sprite.trim = false;
            sprite.sizeMode = cc.Sprite.SizeMode.RAW
            sprite.spriteFrame = spriteFrames[0];            
            node.addChild(animatingNode);
            
            let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 30);
            clip.speed = 0.5;
            clip.name = 'run';
            clip.wrapMode = cc.WrapMode.Default;
            
            animation.addClip(clip);
            animation.on('finished', () => {
                animatingNode.destroy();
                animatingNode.removeFromParent(true);
                cb && cb()
            });

            
            return {animation, duration: Math.round(clip.duration), name: clip.name}
        }
        
        return null
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
    
    _onTaiXiuGetOption(data) {
        let {id, option} = data
        app.system.showToast(`#${id} - ${option}`)
    }
    
    _arePointsOutOfBowl(points) {
        // let worldBowlPos = this.bowl.node.getPosition()
        let worldBowlPos = this.diceArea.convertToNodeSpace(this.bowl.node.getPosition())
        let radius = this.getBowlRadius()
        
        let distances = []
        
        points.forEach(point => {
            distances.push(this._distanceBetween2Points(point, worldBowlPos))
        })
        return distances.every(distance => distance > radius)
    }
    
    _onBowlMoving(e) {
        let points = this._diceNodes.map(dice => this._getPointOfDice(dice))
        if(this._arePointsOutOfBowl(points) && this._popupAnimationState != TaiXiuTreoPopup.POPUP_ANIM_STATE_ENDED) {
            this._waitUntilUserOpensBowl && this._waitUntilUserOpensBowl()
        }
    }
    
    _countDownRemainTime(lbl, remainTime, onlySecs = false, emitter = undefined) {
        if(this._remainTime < 0)
            return
        lbl.node.stopAllActions()
            
        this._remainTime = remainTime
        lbl.node.runAction(cc.repeatForever(cc.sequence(
            cc.callFunc(() => {
                if(this._remainTime < 0)
                    return
                lbl.string = onlySecs ? this._remainTime : this._secondsToMinutes(this._remainTime)    
                this._remainTime -= 1
        
                if(emitter && this._remainTime == 0) {
                    app.system.emit(emitter)
                }
                
                lbl.node.color = this._remainTime <= 5 ? cc.Color.RED : onlySecs ? cc.Color.WHITE : cc.Color.BLACK
                
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
        if(app.taiXiuTreoManager.isEnding() && this._remainTime <= 5 && this._popupAnimationState != TaiXiuTreoPopup.POPUP_ANIM_STATE_ENDED) {
            this._waitUntilUserOpensBowl && this._waitUntilUserOpensBowl()
        }
        
        if(app.taiXiuTreoManager.allowBetting()) {
            this._resetIconAnimation()
            this.hideBowl()
            this.hideTimeToNext()
            this.clearDices()
            this.showRemainTimeBg()
        }
    }
}

TaiXiuTreoPopup.CHAT_COMPONENT = 'HungSicboChatPopup'
TaiXiuTreoPopup.POPUP_ANIM_STATE_IDLE = 1
TaiXiuTreoPopup.POPUP_ANIM_STATE_CHANGE_PHASE = 2
TaiXiuTreoPopup.POPUP_ANIM_STATE_ON_BOARD_END = 3
TaiXiuTreoPopup.POPUP_ANIM_STATE_ENDED = 3.1

app.createComponent(TaiXiuTreoPopup);