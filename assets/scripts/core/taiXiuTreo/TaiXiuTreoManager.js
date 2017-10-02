import app from 'app'
import Events from 'GameEvents'

export default class TaiXiuTreoManager {
    
    constructor() {
        this._meMoney = 0
        
        this._betted = {
            [TaiXiuTreoManager.TAI_ID]: 0,
            [TaiXiuTreoManager.XIU_ID]: 0
        }
        
        this._currentBet = {
            [TaiXiuTreoManager.TAI_ID]: 0,
            [TaiXiuTreoManager.XIU_ID]: 0
        }
        
        this._addEventListeners()
        
        this._popupState = TaiXiuTreoManager.POPUP_STATE_INITIALIZE
        this._boardState = TaiXiuTreoManager.GAME_STATE_WAIT
        
        this._currentId = null // id of board
        
        this._tracker = {} // track the requesting about follow/unfollow between the boards
        
        this._lastPos = null // the last ico's position
        
        this._nanState = false
        
        this._popupPhaseDuration = 0 // phase duration
        this._timeFlag = 0 // phase started time
    }

    _addEventListeners() {
        this._removeEventListeners()
        app.system.addListener(app.commands.MINIGAME_TAI_XIU_GET_STATE, this._createPopup, this)
        app.system.addListener(app.commands.MINIGAME_TAI_XIU_CHANGE_STATE, this._onStateChange, this)
        app.system.addListener(app.commands.MINIGAME_TAI_XIU_BET, this._onTaiXiuBet, this)
        app.system.addListener(app.commands.MINIGAME_TAI_XIU_REMAIN_TIME, this._updateIconRemainTime, this)
        app.system.addListener(app.commands.MINIGAME_TAI_XIU_BET_CHANGED, this._onBetChanged, this)
        app.system.addListener(Events.TAI_XIU_TREO_ON_BET_BTN_CLICKED, this._onBetItemBtnClicked, this)
        app.system.addListener(Events.TAI_XIU_TREO_ON_CLOSE_BTN_CLICKED, this._onClosePopup, this)
        app.system.addListener(Events.TAI_XIU_TREO_PREPARING_NEW_GAME, this._onNewBoardIsComming, this)
        app.system.addListener(Events.TAI_XIU_TREO_ON_CONFIRM_BTN_CLICKED, this._bet, this)
        app.system.addListener(Events.TAI_XIU_TREO_ON_CANCEL_BTN_CLICKED, this._cancel, this)
        app.system.addListener(Events.TAI_XIU_TREO_SHOW_BET_GROUP_PANEL, this._showBetGroupPanel, this)
        app.system.addListener(Events.TAI_XIU_TREO_BET_TEXT_CLICKED, this._onBetTextBtnClicked, this)
        app.system.addListener(Events.TAI_XIU_TREO_HISTORY_CLICKED, this._onHistoryBtnClicked, this)
        app.system.addListener(Events.TAI_XIU_TREO_SOI_CAU_CLICKED, this._onSoiCauBtnClicked, this)
        app.system.addListener(Events.TAI_XIU_TREO_NAN_BTN_CLICKED, this._onNanBtnClicked, this)
        app.system.addListener(Events.TAI_XIU_TREO_RANK_BTN_CLICKED, this._onRankBtnClicked, this)
        app.system.addListener(Events.TAI_XIU_TREO_ON_APP_STATE_CHANGED, this._onAppStateChanged, this)
    }
    
    _removeEventListeners() {
        app.system.removeListener(app.commands.MINIGAME_TAI_XIU_GET_STATE, this._createPopup, this)
        app.system.removeListener(app.commands.MINIGAME_TAI_XIU_CHANGE_STATE, this._onStateChange, this)
        app.system.removeListener(app.commands.MINIGAME_TAI_XIU_BET, this._onTaiXiuBet, this)
        app.system.removeListener(app.commands.MINIGAME_TAI_XIU_REMAIN_TIME, this._updateIconRemainTime, this)
        app.system.removeListener(app.commands.MINIGAME_TAI_XIU_BET_CHANGED, this._onBetChanged, this)
        app.system.removeListener(Events.TAI_XIU_TREO_ON_BET_BTN_CLICKED, this._onBetItemBtnClicked, this)
        app.system.removeListener(Events.TAI_XIU_TREO_ON_CLOSE_BTN_CLICKED, this._onClosePopup, this)
        app.system.removeListener(Events.TAI_XIU_TREO_PREPARING_NEW_GAME, this._onNewBoardIsComming, this)
        app.system.removeListener(Events.TAI_XIU_TREO_ON_CONFIRM_BTN_CLICKED, this._bet, this)
        app.system.removeListener(Events.TAI_XIU_TREO_ON_CANCEL_BTN_CLICKED, this._cancel, this)
        app.system.removeListener(Events.TAI_XIU_TREO_SHOW_BET_GROUP_PANEL, this._showBetGroupPanel, this)
        app.system.removeListener(Events.TAI_XIU_TREO_BET_TEXT_CLICKED, this._onBetTextBtnClicked, this)
        app.system.removeListener(Events.TAI_XIU_TREO_HISTORY_CLICKED, this._onHistoryBtnClicked, this)
        app.system.removeListener(Events.TAI_XIU_TREO_SOI_CAU_CLICKED, this._onSoiCauBtnClicked, this)
        app.system.removeListener(Events.TAI_XIU_TREO_NAN_BTN_CLICKED, this._onNanBtnClicked, this)
        app.system.removeListener(Events.TAI_XIU_TREO_RANK_BTN_CLICKED, this._onRankBtnClicked, this)
        app.system.removeListener(Events.TAI_XIU_TREO_ON_APP_STATE_CHANGED, this._onAppStateChanged, this)
    }
    
    isNan() {
        return this._nanState
    }
    
    allowBetting() {
        return this._boardState === TaiXiuTreoManager.GAME_STATE_BET     
    }
    
    isEnding() {
        return this._boardState === TaiXiuTreoManager.GAME_STATE_END   
    }
    
    ifAny(e) {
        return e === 0 || e
    }
    
    createIcon() {
        let item = cc.instantiate(app.res.prefab.hungSicBo)
        item.active = false
        this._iconComponent = item.getComponent('TaiXiuTreo')
        item.setPosition(this._lastPos || cc.v2(574, 101))
        
        app.system.getCurrentSceneNode().addChild(item)
        
        app.service.send({cmd: app.commands.MINIGAME_TAI_XIU_REMAIN_TIME})
        
        this.setMeBalance(app.context.getMeBalance())
    }
    
    setMeBalance(amount) {
        this._meMoney = Number(amount)
    }
    
    updateMeBalance(amount) {
        this._meMoney += Number(amount)
    }
    
    onDestroy(popupOnly = false) { 
        this._popupState = TaiXiuTreoManager.POPUP_STATE_INITIALIZE
        this._boardState = TaiXiuTreoManager.GAME_STATE_WAIT
        this._currentId = null
        this._tracker = {}
        
        this._popupPhaseDuration = 0
        this._timeFlag = 0
        
        if(popupOnly) {
            this._popupComponent = null
            return
        }
        this._popupComponent = null
        if(this._iconComponent && this._iconComponent.node)
            this._lastPos = this._iconComponent.node.getPosition()
            
        this._iconComponent = null
    }
    
    setPopupState(state) {
        this._popupState = state
    }
    
    setBoardState(state) {
        this._boardState = state
    }
    
    needRequestNew() {
        return this._popupState === TaiXiuTreoManager.POPUP_STATE_INITIALIZE
    }
    
    showPopup() {
        if(!this._isPopupCreated())
            return
        this.setPopupState(TaiXiuTreoManager.POPUP_STATE_OPENING)
        
        if(this.allowBetting() && this._popupState === TaiXiuTreoManager.POPUP_STATE_OPENING && !this._tracker[this._currentId][TaiXiuTreoManager.FOLLOWING]) {
            app.service.send({ cmd: app.commands.MINIGAME_TAI_XIU_FOLLOW })
            this._track(this._currentId, TaiXiuTreoManager.FOLLOWING, true)
        }
        
        this._popupComponent.showPopup()
    }
    
    _onNewBoardIsComming() {
        if(this._popupState === TaiXiuTreoManager.POPUP_STATE_CLOSED && this._tracker[this._currentId][TaiXiuTreoManager.UNFOLLOW]) {
            this._destroyPopup()
        }
    }
    
    _showBetGroupPanel() {
        if(!this._isPopupCreated())
            return
            
        if(this.allowBetting()) {
            this._popupComponent.showBetGroupPanel()
        } else {
            app.system.showToast(app.res.string('tai_xiu_treo_reject'))
        }
    }
    
    _createPopup(data) {
        if(!this._isIconCreated())
            return
        console.warn('data', data)
        let {
            taiAmount,
            xiuAmount
        } = data
        
        if(!this._isPopupCreated()) {
            this._popupComponent = this._iconComponent.createPopup(data)
            if(this._popupComponent) {
                app.system.getCurrentSceneNode().addChild(this._popupComponent.node, TaiXiuTreoManager.POPUP_ZINDEX)
                this.setPopupState(TaiXiuTreoManager.POPUP_STATE_OPENING)
            } 
        }
        
        this._betted[TaiXiuTreoManager.TAI_ID] = taiAmount || 0
        this._betted[TaiXiuTreoManager.XIU_ID] = xiuAmount || 0

        this._onStateChange(data)        
    }
    
    _onClosePopup() {
        if(!this._currentId)
            return
            
        this.setPopupState(TaiXiuTreoManager.POPUP_STATE_CLOSED)
        
        if(!this._tracker[this._currentId][TaiXiuTreoManager.UNFOLLOW]) {
            app.service.send({cmd: app.commands.MINIGAME_TAI_XIU_UNFOLLOW})
            this._track(this._currentId, TaiXiuTreoManager.UNFOLLOW, true)
        }
    }
    
    _isIconCreated() {
        return this._iconComponent && this._iconComponent.node && this._iconComponent.node.isChildOf(app.system.getCurrentSceneNode())
    }
    
    _isPopupCreated() {
        return this._popupComponent && this._popupComponent.node && this._popupComponent.node.isChildOf(app.system.getCurrentSceneNode()) 
    }
    
    _onBetItemBtnClicked(amount, selected) {
        if(!this._isPopupCreated())
            return
        
        if(this._boardState !== TaiXiuTreoManager.GAME_STATE_BET) {
            app.system.showToast(app.res.string('tai_xiu_treo_reject'))
            return
        }
        if(typeof this._currentBet[selected] !== 'number') {
            this._currentBet[selected] = 0
        }
        if(amount > this._meMoney) {
            app.system.showToast(app.res.string('game_not_enough_balance_to_bet'))
            return
        }
        this._currentBet[selected] += amount
        if(isNaN(this._currentBet[selected])) {
            app.system.showToast(app.res.string('tai_xiu_treo_invalid'))
            this._currentBet[selected] = 0
            return
        }
        // let realAmount = this._betted[selected] + this._currentBet[selected]
        
        // console.warn('betted', this._betted)
        // console.warn('_currentBet', this._currentBet)
        this.updateMeBalance(-amount)
        this._popupComponent.updateUserMoney(this._meMoney)
        this._popupComponent.updateBetBalance(this._currentBet[selected])
    }
    
    _onTaiXiuBet(data) {
        if(!this._isPopupCreated() && !this._isIconCreated())
            return
        
        let {
            tai, // số tiền user(me) mới gửi lên
            xiu,
            acceptedTaiAmount, // tổng số tiền user(me) đã đặt sau khi server tính toán cân kèo
            acceptedXiuAmount,
            totalTaiAmount, // tổng số tiền tất cả users đã cược cho vị này
            totalTaiCount, // tổng số users đã cược vào vị này
            totalXiuAmount,
            totalXiuCount,
            balance
        } = data
      
        this._currentBet[TaiXiuTreoManager.TAI_ID] = 0
        this._currentBet[TaiXiuTreoManager.XIU_ID] = 0
        
        acceptedTaiAmount > 0 && (this._betted[TaiXiuTreoManager.TAI_ID] = acceptedTaiAmount)
        acceptedXiuAmount > 0 && (this._betted[TaiXiuTreoManager.XIU_ID] = acceptedXiuAmount)
        
        this._popupComponent.onUserBetsSuccessfully(acceptedTaiAmount, acceptedXiuAmount)
        this._popupComponent.updateInfo(null, totalTaiCount, totalTaiAmount, totalXiuCount, totalXiuAmount)
        
        // update user's money
        app.context.setBalance(balance)
        this.setMeBalance(balance)
        
        this._popupComponent.updateUserMoney(balance)
    }
    
    _onStateChange(data) {
        // console.warn('_onTaiXiuStateChange', data)
        
        if(!this._isPopupCreated() || !this._isIconCreated()) {
            return        
        }
        
        let {
            balance, // <- state 3
            betTemplates,
            duration,
            balanceChanged, // <- state 3
            option, // <- state 3
            dices, // <- state 3
            paybackTai, // <- state 3
            paybackXiu, // <- state 3
            taiAmount, // <- state 3 // tổng số tiền user(me) đã đặt sau khi server tính toán cân kèo
            xiuAmount, // <- state 3 
            histories,
            id,
            remainTime,
            state,
            totalTaiAmount,
            totalTaiCount,
            totalXiuAmount,
            totalXiuCount,
            forceReset
        } = data

        this._currentId = id
        
        this._watchTracker(this._currentId)
        
        this.setBoardState(state)
        
        this._setDuration(remainTime) 
        
        forceReset && this._resetBetAmount()
        switch(state) {
            case TaiXiuTreoManager.GAME_STATE_WAIT:
            case TaiXiuTreoManager.GAME_STATE_BET:
                this._popupComponent.resetData(this._betted[TaiXiuTreoManager.TAI_ID], this._betted[TaiXiuTreoManager.XIU_ID])
                
                // this._popupComponent.taiUserBetLabel.string = numberFormat(this._betted[TaiXiuTreoManager.TAI_ID])
                // this._popupComponent.xiuUserBetLabel.string = numberFormat(this._betted[TaiXiuTreoManager.XIU_ID])
                if(this._popupState === TaiXiuTreoManager.POPUP_STATE_OPENING && !this._tracker[this._currentId][TaiXiuTreoManager.FOLLOWING]) {
                    app.service.send({ cmd: app.commands.MINIGAME_TAI_XIU_FOLLOW })
                    this._track(this._currentId, TaiXiuTreoManager.FOLLOWING, true)
                }
                
                this._popupComponent.changePhase("Đặt Cược")
                this._popupComponent.countDownRemainTime(remainTime)
                this._popupComponent.initHistories(histories, state)
                this._popupComponent.updateUserMoney(this._meMoney)
                break
            case TaiXiuTreoManager.GAME_STATE_BALANCING:
                
                break
            case TaiXiuTreoManager.GAME_STATE_END:
                this._popupComponent.onBoardEnding(duration, remainTime, {
                    balanceChanged,
                    option,
                    dices,
                    paybackTai,
                    paybackXiu,
                    taiAmount,
                    xiuAmount,
                    histories,
                    balance
                }, state)
                
                balance && this.setMeBalance(balance)
                
                this._resetBetAmount()
                break
        }
        
        this._popupComponent.updateInfo(id, totalTaiCount, totalTaiAmount, totalXiuCount, totalXiuAmount)
        this._popupComponent.initBetOption(betTemplates)
    }
    
    _onAppStateChanged(state) {
        if(!this._isPopupCreated())
            return
            
        if(state == 'active') {
            let deltaTime = parseInt((Date.now() - this._timeFlag)/1000)
            if(this._phaseFlag && deltaTime > this._phaseFlag) {
                app.service.send({ cmd: app.commands.MINIGAME_TAI_XIU_GET_STATE })
            } else { // phase is still running, update counter
                app.system.emit('tai.xiu.treo.popup.update.count.down', this._popupPhaseDuration - deltaTime, this._boardState)
            }
        } else if(state == 'inactive'){
            this._setPopupTime()
            this._phaseFlag = this._popupComponent.getRemainTime()
        }
    }
    
    _onNanBtnClicked(state) {
        this._nanState = state 
    }
    
    _onHistoryBtnClicked() {
        if(!this._isPopupCreated())
            return
            
        let popup = this._popupComponent.openHistoryPopup()
        app.system.getCurrentSceneNode().addChild(popup, TaiXiuTreoManager.HISTORY_ZINDEX)
    }
    
    _onSoiCauBtnClicked() {
        if(!this._isPopupCreated())
            return
            
        let popup = this._popupComponent.openSoiCauPopup()
        app.system.getCurrentSceneNode().addChild(popup, TaiXiuTreoManager.HISTORY_ZINDEX)
    }
    
    _onRankBtnClicked() {
        if(!this._isPopupCreated())
            return
        
        let popup = this._popupComponent.openRankPopup()
        app.system.getCurrentSceneNode().addChild(popup, TaiXiuTreoManager.HISTORY_ZINDEX) 
    }
    
    _onBetChanged(data) {
        if(!this._isPopupCreated())
            return
            
        let {
            totalTaiAmount,
            totalTaiCount,
            totalXiuAmount,
            totalXiuCount  
        } = data 
        
        this._popupComponent.updateInfo(this._currentId, totalTaiCount, totalTaiAmount, totalXiuCount, totalXiuAmount)
    }
    
    _updateIconRemainTime(data) {
        if(!this._isIconCreated())
            return    

        let {remainTime} = data
        this._iconComponent.runCountDown(remainTime)
        this._iconComponent.node.active = remainTime >= 0
    }
    
    _onBetTextBtnClicked(text, selected) {
        if(!this._isPopupCreated())
            return
    
        if(this._boardState !== TaiXiuTreoManager.GAME_STATE_BET) {
            app.system.showToast(app.res.string('tai_xiu_treo_reject'))
            return
        }
        if(typeof this._currentBet[selected] !== 'string') {
            this._currentBet[selected] = ""
        }
        
        if(text == TaiXiuTreoManager.BACK_SYMBOL) {
            this._currentBet[selected] = this._currentBet[selected].substr(0, this._currentBet[selected].length - 1)
        } else {
            this._currentBet[selected] += text
        }
        if(this._currentBet[selected].length > 10)
            return
            
        let realAmount = Number(this._currentBet[selected])

        if(isNaN(realAmount)) {
            app.system.showToast(app.res.string('tai_xiu_treo_invalid'))
            this._currentBet[selected] = ""
            return
        }
           
        // console.warn('betted', this._betted)
        // console.warn('_currentBet', this._currentBet)
        // console.warn('realAmount', realAmount)
        this._popupComponent.updateBetBalance(realAmount)                 
    }
    
    _setDuration(duration) {
        this._popupPhaseDuration = duration // phase duration
    }
    
    _setPopupTime() {
        this._timeFlag = Date.now() // phase started time
    }

    _hideIcon() {
        this._iconComponent.node.active = false    
    }
    
    _destroyPopup() {
        // destroy node
        this._popupComponent.node.destroy()
        
        this.onDestroy(true) //popupOnly = true
    }
    
    _bet() {
        let minBet = this._popupComponent.getMinBet() || 100
        let taiAmount = Number(this._currentBet[TaiXiuTreoManager.TAI_ID])
        let xiuAmount = Number(this._currentBet[TaiXiuTreoManager.XIU_ID])
        
        if((taiAmount > 0 && taiAmount < minBet) || (xiuAmount > 0 && xiuAmount < minBet) || (xiuAmount === 0 && taiAmount === 0)) {
            app.system.showToast(app.res.string('tai_xiu_treo_min_bet', {minBet}))
            return 
        }

        let realMoney = app.context.getMeBalance()
        if(taiAmount + xiuAmount > realMoney) {
            app.system.showToast(app.res.string('game_not_enough_balance_to_bet'))
            return     
        } 
        
        app.service.send({
            cmd: app.commands.MINIGAME_TAI_XIU_BET,
            data: {
                tai: Number(this._currentBet[TaiXiuTreoManager.TAI_ID]),
                xiu: Number(this._currentBet[TaiXiuTreoManager.XIU_ID])
            }
        })
    }
    
    _cancel() {
        if(!this._isPopupCreated())
            return
        
        if(typeof this._currentBet[TaiXiuTreoManager.XIU_ID] === 'string') {
            this._currentBet[TaiXiuTreoManager.XIU_ID] = ""
        }

        if(typeof this._currentBet[TaiXiuTreoManager.TAI_ID] === 'string') {
            this._currentBet[TaiXiuTreoManager.TAI_ID] = ""
        }
        
        this.updateMeBalance(Number(this._currentBet[TaiXiuTreoManager.TAI_ID]) + Number(this._currentBet[TaiXiuTreoManager.XIU_ID]))
        
        this._currentBet[TaiXiuTreoManager.TAI_ID] = 0
        this._currentBet[TaiXiuTreoManager.XIU_ID] = 0

        // let realAmount = this._betted[selected] + this._currentBet[selected]
        this._popupComponent.updateUserMoney(this._meMoney)
        this._popupComponent.updateBetBalance(0, true)
    }
    
    _watchTracker(id) {
        if(!Object.keys(this._tracker).some(i => i == id))
            this._tracker = {}
        this._track(id)
    }
    
    /**
     * 
     * 
     * @param {any} id 
     * @param {any} key TaiXiuTreoManager.FOLLOWING // TaiXiuTreoManager.UNFOLLOW
     * @param {boolean} [state=false] 
     * @param {boolean} [clear=false] 
     * @memberof TaiXiuTreoManager
     */
    _track(id, key, state = false) {
        if(!this.ifAny(id))
            return
            
        if(!this._tracker.hasOwnProperty(id))
            this._tracker[id] = {
                [TaiXiuTreoManager.FOLLOWING] : false,
                [TaiXiuTreoManager.UNFOLLOW] : false
            }
        
        this._tracker[id].hasOwnProperty(key) && (this._tracker[id][key] = state)
    }
    
    _resetBetAmount() {
        this._betted = {
            [TaiXiuTreoManager.TAI_ID]: 0,
            [TaiXiuTreoManager.XIU_ID]: 0
        }
        
        this._currentBet = {
            [TaiXiuTreoManager.TAI_ID]: 0,
            [TaiXiuTreoManager.XIU_ID]: 0
        }
    }
}

TaiXiuTreoManager.XIU_ID = 1
TaiXiuTreoManager.TAI_ID = 2

TaiXiuTreoManager.FOLLOWING = 1
TaiXiuTreoManager.UNFOLLOW = 2

TaiXiuTreoManager.GAME_STATE_WAIT = 0
TaiXiuTreoManager.GAME_STATE_BET = 1 // bet
TaiXiuTreoManager.GAME_STATE_BALANCING = 2
TaiXiuTreoManager.GAME_STATE_END = 3

TaiXiuTreoManager.POPUP_STATE_INITIALIZE = 0
TaiXiuTreoManager.POPUP_STATE_OPENING = 1
TaiXiuTreoManager.POPUP_STATE_CLOSED = 2


TaiXiuTreoManager.POPUP_ZINDEX = 10
TaiXiuTreoManager.HISTORY_ZINDEX = 20

TaiXiuTreoManager.BACK_SYMBOL = '←'