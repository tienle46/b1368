import BasePopup from 'BasePopup';
import CardStreak from 'CardStreak';
import HighLowCardStreak from 'HighLowCardStreak';
import HighLowContext from "HighLowContext";
import CCUtils from 'CCUtils';
import GameUtils from 'GameUtils';
import HighLowHistoryPopup from 'HighLowHistoryPopup';
import HighLowTopPopup from 'HighLowTopPopup';
import HighLowCardHand from './HighLowCardHand';

class MiniHighLowPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            startBtn: cc.Node,
            card: HighLowCardStreak,
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

            lblNextAboveAmount: cc.Label,
            lblNextBeloveAmount: cc.Label,
            lblWinAmount: cc.Label,

            cardResultsScrollView: cc.ScrollView,
            cardResultsContent: cc.Node,
            cardResultItem: cc.Node,
            lblResultRank: cc.Label,
            spriteResultSuit: cc.Sprite,

            highLowHistoryPrefab: cc.Prefab,
            highLowTopPrefab: cc.Prefab,
        });
        this.resultCount = 0
        this.atCount = 0
        this.isSpinning = false
        this.betValue = 0
        this.jackpotValue = 0

        this.highLowHistoryPopup = null
        this.highLowTopPopup = null
        // this.fakeData = () => {
        //     return {
        //         card: 4 + Math.floor(Math.random() * 52),
        //         nextAboveAmount: Math.floor(Math.random() * 52),
        //         nextBelowAmount: Math.floor(Math.random() * 52),
        //         winAmount: Math.floor(Math.random() * 52),
        //     }
        // }// fake
    }

    onLoad() {
        super.onLoad()

    }

    onEnable() {
        super.onEnable();
        this._removeCardResults()// forfake1
        this._commonInit()
        // this.loadConfig() // fake
    }
    onDisable() {
        super.onDisable();

    }

    //initHighLowContext
    _commonInit() {
        (!app.highLowContext) && (app.highLowContext = new HighLowContext());
        (app.highLowContext) && (app.highLowContext.popup = this);
    }

    loadConfig() {
        this._updateTimer()
        this._loadBetAndJackpotValues()
        this._removeCardResults()// forfake1
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
        app.highLowContext.sendStart(this.betValue);// forfake //forfake1
        // this.onReceivedStart(this.fakeData())// fake
        // app.highLowContext.playing = true// fake
        // this.cardResultsScrollView.getComponent(cc.ScrollView).scrollToRight()// fake1
    }
    onReceivedStart(data) {
        if (data.playing) {
            this._setHistoryResults(data.cardHistory)
        }
        this.playSpinCard(data)
        this.enableCardStreak()
        this._switchBetInteractable(false)
        this._startTimer()
    }

    //PlayButton(Higher and Lower)
    onHigherBetBtnClicked() {
        if (!this.isSpinning && app.highLowContext.playing) {
            app.highLowContext.sendGetPlay(this.betValue, 1);// forfake
            // this.onReceivedPlay(this.fakeData())// fake
        }
    }
    onLowerBetBtnClicked() {
        if (!this.isSpinning && app.highLowContext.playing) {
            app.highLowContext.sendGetPlay(this.betValue, 0);// forfake
            // this.onReceivedPlay(this.fakeData())// fake
        }
    }
    onReceivedPlay(data) {
        if (data.card != undefined) {
            this.playSpinCard(data)
        }
    }

    //EndTurn
    onEndBtnClicked() {
        if (!this.isSpinning) {
            if (app.highLowContext.playing) {
                app.highLowContext.sendEnd(this.betValue);// forfake
            } else {
                this.onReceivedEnd()
            }
            // this.onReceivedEnd()// fake
        }
    }
    onReceivedEnd() {
        console.log('end======')
        // app.highLowContext.sendStart(1000)
        this._removeCardResults()
        this.removeAtCards()
        this.disableCardStreak()
        this._switchInteractableHighLowBtns(true)
        this._switchBetInteractable(true)
        this._stopTimer()
        this._updateNextWinAmount(0, 0, 0)
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

    _removeCardResults() {
        this.resultCount = 0
        this.cardResultsContent.removeAllChildren()
    }

    //ClosePopup
    onBtnCloseClicked() {
        // this.disableCardStreak()
        app.highLowContext.popup = null;
        super.onBtnCloseClicked()
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

    _switchInteractableHighLowBtns(isEnable) {
        this.btnHigh.getComponent(cc.Button).interactable = isEnable
        this.btnLow.getComponent(cc.Button).interactable = isEnable
    }

    //when End Game
    removeAtCards() {
        this.atCount = 0
        let children = this.atGroup.children
        children.forEach(node => {
            node.getChildByName('active').active = false
        })
    }

    //when playing, user cannot change the bet value, this functiuon turn on/off the interactable of toggle group
    _switchBetInteractable(isEnable) {
        let children = this.toggleGroup.children
        children.forEach(node => {
            node.getComponent(cc.Toggle).interactable = isEnable
        })
    }

    //spin the card streak
    playSpinCard(data, duration = 1) {
        this.isSpinning = true
        this.card.startAnimate(duration, data.card, () => { this._spinCallback(data) })
    }

    _spinCallback(data) {
        this.isSpinning = false
        this._switchInteractableHighLowBtns(true)
        if (data.card < 8) {
            let children = this.atGroup.children
            children[this.atCount].getChildByName('active').active = true
            this.atCount < 3 && this.atCount++
            this.btnHigh.getComponent(cc.Button).interactable = false
        } else if (data.card < 12) {
            this.btnLow.getComponent(cc.Button).interactable = false
        }
        const { nextAboveAmount, nextBelowAmount, winAmount } = data
        this._updateNextWinAmount(nextAboveAmount, nextBelowAmount, winAmount)
        if (data.start === undefined && data.win != undefined && !data.win) {
            app.highLowContext.playing = false
            app.highLowContext.startTime = null
            this._switchInteractableHighLowBtns(false)
            return
        }
        if (!data.playing) {
            this._addResult(data.card)
        }
        if (this.resultCount > 9) {
            this.cardResultsScrollView.scrollToRight(0.5)
        }
    }

    _updateNextWinAmount(nextAboveAmount = 0, nextBelowAmount = 0, winAmount = 0) {
        this.lblNextAboveAmount.string = nextAboveAmount
        this.lblNextBeloveAmount.string = nextBelowAmount
        this.lblWinAmount.string = winAmount
    }

    _setHistoryResults(cardValues) {
        cardValues.forEach(card => {
            this._addResult(card)
        })
    }

    _addResult(cardValue) {
        this.resultCount++
        // if (this.resultCount > 9) {
        //     this.cardResultsContent.children[0].removeFromParent()
        // }
        const cardRank = HighLowCardHand._getRankName(cardValue >> 2)
        //TODO calculatecardsuit
        const suitSprite = HighLowCardHand._getSuitName(cardValue & 0x03)
        this.lblResultRank.string = cardRank.toUpperCase()
        this.spriteResultSuit.spriteFrame = this.highLowAtlas.getSpriteFrame(suitSprite)
        let item = cc.instantiate(this.cardResultItem)
        this.cardResultsContent.addChild(item)
        // this.cardResultsScrollView.getComponent(cc.ScrollView).scrollToRight()
        item.active = true
    }

    // TIMER
    _startTimer() {
        // app.highLowContext.startTime = app.highLowContext.now()// fake
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

}

app.createComponent(MiniHighLowPopup);