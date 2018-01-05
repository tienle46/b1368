import BasePopup from 'BasePopup';
import CardStreak from 'CardStreak';
import HighLowContext from "HighLowContext";
import CCUtils from 'CCUtils';
import GameUtils from 'GameUtils';

class MiniHighLowPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            startBtn: cc.Node,
            card: CardStreak,
            highLowAtlas: cc.SpriteAtlas,
            atGroup: cc.Node,
            btnEnd: cc.Node,
            toggleGroup: cc.Node,
            itemBet: cc.Node,
            remainingTime: cc.Label,
        });
        this.atCount = 0
        this.isSpinning = false
        this.betValue = 0
    }

    _commonInit() {
        (!app.highLowContext) && (app.highLowContext = new HighLowContext());
        (app.highLowContext) && (app.highLowContext.popup = this);
    }

    onLoad() {
        super.onLoad()

        this._commonInit()
    }
    
    _startTimer() {
        this.schedule(this._updateTimer, 1);
    }
    
    _stopTimer() {
        
        this.unschedule(this._updateTimer);
    }
    
    _updateTimer() {
        console.warn('Timer called');
        var remainingTime = app.highLowContext.getRemainingTime();
        
        this.remainingTime.string = remainingTime
    }
    
    loadConfig(betValues, duration, jackpotValues){
        this._setDuration(duration)
        this._loadBetValues(betValues)
    }
    
    _setDuration(duration) {
        this.remainingTime.string = app.highLowContext.formatTime(duration)
    }
    
    _loadBetValues(betValues) {
        let children = this.toggleGroup.children
        let positionBetButtons = []
        children.forEach((betNode, i) => {
            positionBetButtons.push(betNode.getPosition())
        })
        
        CCUtils.clearAllChildren(this.toggleGroup);
        
        betValues.forEach((betValue, i) => {
            let item = cc.instantiate(this.itemBet)
            item.getComponentInChildren(cc.Label).string = GameUtils.formatBalanceShort(betValue)
            item._betValue = betValue
            this.toggleGroup.addChild(item)
            item.setPosition(positionBetButtons[i])
        })
        this.betValue = betValues[0]
    }
    
    onBtnCloseClicked() {
        // this.disableCardStreak()
        app.highLowContext.popup = null;
        super.onBtnCloseClicked()
    }
    
    onBtnBetClicked(e) {
        if(!app.highLowContext.playing){
            let betValue = e.node._betValue
            this.betValue = betValue
        }
    }

    onStartBtnClicked() {
        // this.enableCardStreak()

        // app.highLowContext.sendEnd(1000);
        app.highLowContext.sendStart(this.betValue);
    }

    onHigherBetBtnClicked() {
        if (!this.isSpinning && app.highLowContext.playing) {
            app.highLowContext.sendGetPlay(this.betValue, 1);
        }
    }
    onLowerBetBtnClicked() {
        if (!this.isSpinning && app.highLowContext.playing) {
            app.highLowContext.sendGetPlay(this.betValue, 0);
        }
    }

    onEndBtnClicked() {
        app.highLowContext.sendEnd(this.betValue);
    }

    onReceivedStart(cardValue) {
        this.playSpinCard(cardValue, 0)
        this.enableCardStreak()
        this.switchBetInteractable(false)
        this._startTimer()
    }

    onReceivedPlay(cardValue) {
        this.playSpinCard(cardValue)
    }
    
    onReceivedEnd() {
        // app.highLowContext.sendStart(1000)
        this.disableCardStreak()
        this.switchBetInteractable(true)
    }

    enableCardStreak() {
        this.startBtn.active = false
        this.card.node.active = true
        this.btnEnd.active = true
    }
    disableCardStreak() {
        this.startBtn.active = true
        this.card.node.active = false
        this.btnEnd.active = false
    }
    
    switchBetInteractable(isEnable) {
        let children = this.toggleGroup.children
        children.forEach(node => {
            node.getComponent(cc.Toggle).interactable = isEnable
        })
    }

    playSpinCard(cardValue, duration = 3) {
        this.isSpinning = true
        this.card.spinToCard(cardValue, duration, () => {
            this.isSpinning = false
            if (cardValue < 8) {
                let children = this.atGroup.children
                children[this.atCount].getComponent(cc.Sprite).spriteFrame = this.highLowAtlas.getSpriteFrame('A-2')
                this.atCount++
            }
        })
    }

    onEnable() {
        super.onEnable();
    }

    onDisable() {
        super.onDisable();
    }

}

app.createComponent(MiniHighLowPopup);