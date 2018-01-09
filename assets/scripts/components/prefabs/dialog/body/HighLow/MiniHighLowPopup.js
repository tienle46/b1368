import BasePopup from 'BasePopup';
import CardStreak from 'CardStreak';
import HighLowContext from "HighLowContext";
import CCUtils from 'CCUtils';
import GameUtils from 'GameUtils';
import HighLowHistoryPopup from 'HighLowHistoryPopup';
import HighLowTopPopup from 'HighLowTopPopup';

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
            lblJackpotValue: cc.Label,
            btnHigh: cc.Node,
            btnLow: cc.Node,
            lblJackpotValue: cc.Label,

            highLowHistoryPrefab: cc.Prefab,
            highLowTopPrefab: cc.Prefab,
        });
        this.atCount = 0
        this.isSpinning = false
        this.betValue = 0
        this.jackpotValue = 0

        this.highLowHistoryPopup = null
        this.highLowTopPopup = null
    }

    onLoad() {
        super.onLoad()

        this._commonInit()
    }

    loadConfig() {
        //TODO
        this._updateTimer()
        this._loadBetAndJackpotValues()
        //TODO
    }

    onBtnBetClicked(e) {
        if (!app.highLowContext.playing) {
            const data = e.node._data
            const { bet, jackpot } = data
            this._updateBetAndJackpotValue(bet, jackpot)
        }
    }

    //Start
    onStartBtnClicked() {
        app.highLowContext.sendStart(this.betValue);
    }
    onReceivedStart(cardValue) {
        this.playSpinCard(cardValue)
        this.enableCardStreak()
        this.switchBetInteractable(false)
        this._startTimer()
    }

    //PlayButton(Higher and Lower)
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
    onReceivedPlay(cardValue) {
        this.playSpinCard(cardValue)
    }

    //EndTurn
    onEndBtnClicked() {
        if (!this.isSpinning) {
            app.highLowContext.sendEnd(this.betValue);
        }
    }
    onReceivedEnd() {
        // app.highLowContext.sendStart(1000)
        this.removeAtCards()
        this.disableCardStreak()
        this._showHighLowBtns()
        this.switchBetInteractable(true)
        this._stopTimer()
    }

    //ClosePopup
    onBtnCloseClicked() {
        // this.disableCardStreak()
        app.highLowContext.popup = null;
        super.onBtnCloseClicked()
    }

    onEnable() {
        super.onEnable();
    }
    onDisable() {
        super.onDisable();
    }

    //initHighLowContext
    _commonInit() {
        (!app.highLowContext) && (app.highLowContext = new HighLowContext());
        (app.highLowContext) && (app.highLowContext.popup = this);
    }

    //initBetAndJackpotValue
    _loadBetAndJackpotValues() {
        const btnBetPositions = this._saveOldBtnBetPositions()
        this._generateNewBtnBet(btnBetPositions)
        this._updateBetAndJackpotValue(app.highLowContext.betValues[0], app.highLowContext.jackpotValues[0])
    }
    _saveOldBtnBetPositions() {
        let children = this.toggleGroup.children
        let positionBetButtons = []
        children.forEach((betNode, i) => {
            positionBetButtons.push(betNode.getPosition())
        })
        CCUtils.clearAllChildren(this.toggleGroup);

        return positionBetButtons
    }
    _generateNewBtnBet(btnBetPositions) {
        const betValues = app.highLowContext.betValues
        const jackpotValues = app.highLowContext.jackpotValues
        betValues.forEach((betValue, i) => {
            const item = cc.instantiate(this.itemBet)
            item.getComponentInChildren(cc.Label).string = GameUtils.formatBalanceShort(betValue)
            const bet = betValue
            const jackpot = jackpotValues[i]
            item._data = { bet, jackpot }
            this.toggleGroup.addChild(item)
            item.setPosition(btnBetPositions[i])
        })
    }

    //Update jackpot Value and bet when click bet
    _updateBetAndJackpotValue(bet, jackpot) {
        this.betValue = bet
        this.jackpotValue = jackpot
        this.lblJackpotValue.string = this.jackpotValue
    }

    //hide and show cark streak
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

    _showHighLowBtns() {
        this.btnHigh.active = true
        this.btnLow.active = true
    }

    //when End Game
    removeAtCards() {
        this.atCount = 0
        let children = this.atGroup.children
        children.forEach(node => {
            node.getComponent(cc.Sprite).spriteFrame = this.highLowAtlas.getSpriteFrame('A-1')
        })
    }

    //when playing, user cannot change the bet value, this functiuon turn on/off the interactable of toggle group
    switchBetInteractable(isEnable) {
        let children = this.toggleGroup.children
        children.forEach(node => {
            node.getComponent(cc.Toggle).interactable = isEnable
        })
    }

    //spin the card streak
    playSpinCard(cardValue, duration = 3) {
        this.isSpinning = true
        this.card.spinToCard(cardValue, duration, () => {
            this.isSpinning = false
            this._showHighLowBtns()
            if (cardValue < 8) {
                let children = this.atGroup.children
                children[this.atCount].getComponent(cc.Sprite).spriteFrame = this.highLowAtlas.getSpriteFrame('A-2')
                this.atCount++
                this.btnHigh.active = false
            } else if (cardValue < 12) {
                this.btnLow.active = false
            }
        })
    }

    // TIMER
    _startTimer() {
        this.schedule(this._updateTimer, 1);
    }

    _stopTimer() {
        this.unschedule(this._updateTimer);
        this._updateTimer()
    }

    _updateTimer() {
        let remainingTime = app.highLowContext.getRemainingTime();
        this.remainingTime.string = remainingTime
    }

    //Init popup
    _initHighLowHistory() {
        if (this.highLowHistoryPopup) return true;
        if (this.highLowHistoryPrefab) {
            this.highLowHistoryPopup = cc.instantiate(this.highLowHistoryPrefab);
            this.highLowHistoryPopup.active = false;
            app.system.getCurrentSceneNode().addChild(this.highLowHistoryPopup);
            return true;
        }

        return false;
    }

    _initTopHistory() {
        if (this.highLowTopPopup) return true;
        if (this.highLowTopPrefab) {
            this.highLowTopPopup = cc.instantiate(this.highLowTopPrefab);
            this.highLowTopPopup.active = false;
            app.system.getCurrentSceneNode().addChild(this.highLowTopPopup);
            return true;
        }

        return false;
    }

    //Click pop up
    onHistoryBtnClicked() {
        if (this._initHighLowHistory()) {
            var highLowHistoryPopupController = this.highLowHistoryPopup.getComponent(HighLowHistoryPopup);
            highLowHistoryPopupController.openPopup(true);
        }
    }
    onTopBtnClicked() {
        if (this._initTopHistory()) {
            var miniHighLowPopupController = this.highLowTopPopup.getComponent(HighLowTopPopup);
            miniHighLowPopupController.openPopup(true);
        }
    }

}

app.createComponent(MiniHighLowPopup);