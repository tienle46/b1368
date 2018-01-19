import BasePopup from 'BasePopup';
import CardStreak from 'CardStreak';
import HighLowCardStreak from 'HighLowCardStreak';
import HighLowContext from "HighLowContext";
import CCUtils from 'CCUtils';
import GameUtils from 'GameUtils';
import HighLowHistoryPopup from 'HighLowHistoryPopup';
import HighLowTopPopup from 'HighLowTopPopup';
import HighLowInfoPopup from 'HighLowInfoPopup';
import HighLowErrorCode from 'HighLowErrorCode';
import HighLowCardHand from './HighLowCardHand';
import utils from 'PackageUtils';
import {numberFormat} from 'GeneralUtils';
import Linking from 'Linking';

class MiniHighLowPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            startBtn: cc.Node,
            card: HighLowCardStreak,
            highLowAtlas: cc.SpriteAtlas,
            atGroup: cc.Node,
            btnEnd: cc.Button,
            toggleGroup: cc.Node,
            itemBet: cc.Node,
            remainingTime: cc.Label,
            lblJackpotValue: cc.Label,
            btnHigh: cc.Node,
            btnLow: cc.Node,

            // Label win money
            lblWinMoney: cc.Label,
            lose: cc.Node,

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
            highLowInfoPrefab: cc.Prefab,

        });
        this.resultCount = 0
        this.atCount = 0
        this.isSpinning = false
        this.betValue = 0
        this.jackpotValue = 0
        this.betIndex = 0
        this.winAmount = 0

        this.highLowHistoryPopup = null
        this.highLowTopPopup = null
        this.highLowInfoPopup = null

        this.betHilightColor = new cc.Color(49, 28, 0, 255)
        this.betUnHilightColor = new cc.Color(255, 255, 255, 255)

    }

    onLoad() {
        super.onLoad()
        this._commonInit()
        this.body && this.body.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);

    }

    onDestroy() {
        super.onDestroy()
        app.highLowContext.popup = null;
    }

    onEnable() {
        super.onEnable();

        app.highLowContext && app.highLowContext.sendGetConfig()
    }

    onDisable() {
        super.onDisable();
    }

    //initHighLowContext
    _commonInit() {
        (!app.highLowContext) && (app.highLowContext = new HighLowContext());
        (app.highLowContext) && (app.highLowContext.popup = this);
    }

    _onTouchMove(evt) {
        var delta = evt.touch.getDelta();
        var curPos = this.body.position;
        curPos = cc.p(curPos.x + delta.x, curPos.y + delta.y);
        this.body.position = curPos;
    }

    loadConfig() {
        this._updateTimer()
        this._loadBetAndJackpotValues()
        this._removeCardResults()// forfake1
    }

    onBtnBetClicked(e) {
        var sender = e.target;
        this.toggleGroup.children.forEach(child => {
            let title = child.getChildByName("title");
            var color = null;
            if (child === sender) {
                color = this.betHilightColor;
            } else {
                color = this.betUnHilightColor;
            }
            title && (title.color = color)
        })

        if (!app.highLowContext.playing) {
            const data = e.node._data
            const { bet, jackpot, betIndex } = data
            this._updateBetAndJackpotValue(bet, jackpot, betIndex)
        }
    }

    //Start
    onStartBtnClicked() {
        if (!app.highLowContext.isLoadedConfig) return
        if (!this.checkCurrentMoney()) return
        app.highLowContext.sendStart(this.betValue)
    }

    checkCurrentMoney() {
        if (app.context.getMeBalance() < this.betValue) {
            // this.popup && this.popup.showError({message: "Bạn không đủ tiền đẻ chơi tiếp."});
            app.system.confirm(
                app.res.string("Bạn không đủ chip để chơi tiếp, nạp thêm nha."),
                null,
                () => {
                    app.visibilityManager.goTo(Linking.ACTION_TOPUP)
                }
            );
            return false;
        }
        return true;
    }

    onReceivedStart(data, duration = 1) {
        this.playSpinCard(data, duration)
        this.enableCardStreak()
        this._switchBetInteractable(false)
        this._startTimer()
        if (data.playing) {
            warn('start', data)
            if (data.cardHistory) {
                this.setEnableBtnEnd(data.cardHistory.length !== 1)
            }
            this._setHistoryResults(data.cardHistory)
            this._setHistoryAtCards(data.atCardCount)
        } else {
            this.setEnableBtnEnd(false)
        }
    }

    // PlayButton(Higher and Lower)
    onHigherBetBtnClicked() {
        if (!this._checkSpinInterval()) return

        if (!this.isSpinning && app.highLowContext.playing) {
            app.highLowContext.sendGetPlay(this.betValue, 1);
            app.highLowContext.lastSpinTime = app.highLowContext.now()
        }
    }
    
    onLowerBetBtnClicked() {
        if (!this._checkSpinInterval()) return

        if (!this.isSpinning && app.highLowContext.playing) {
            app.highLowContext.sendGetPlay(this.betValue, 0);
            app.highLowContext.lastSpinTime = app.highLowContext.now()
        }
    }

    _checkSpinInterval() {
        if (app.highLowContext.lastSpinTime === 0) {
            return true
        }

        if (app.highLowContext.now() - app.highLowContext.lastSpinTime > app.highLowContext.spinInterval) {
            return true
        }
        return false
    }
    
    onReceivedPlay(data) {
        console.warn('dataPlay======', data)
        console.warn('dataPlay.win======', data.win)
        app.highLowContext.lastSpinTime = app.highLowContext.now()
        this.setEnableBtnEnd(true)
        if (data.card !== undefined) {
            this.playSpinCard(data)
        }
    }

    //EndTurn
    onEndBtnClicked() {
        this.unschedule(this.onEndBtnClicked)

        if (!this.isSpinning) {
            if (app.highLowContext.playing) {
                app.highLowContext.sendEnd(this.betValue);// forfake
            } else {
                this._reset()
            }
        }
    }
    
    onReceivedEnd() {
        // app.highLowContext.sendStart(1000)
        this._showResult()
        this._reset()
    }

    _reset() {
        this._removeCardResults()
        this.removeAtCards()
        this.disableCardStreak()
        this.setEnableBtnEnd(false)
        this._switchInteractableHighLowBtns(false)
        this._switchBetInteractable(true)
        this._stopTimer()
        this._updateNextWinAmount(0, 0, 0)
    }

    _showResult() {
        if (this.winAmount > 0) {
            this.lblWinMoney.string = '+' + numberFormat(this.winAmount);
            var anim = this.lblWinMoney.node.getComponent(cc.Animation);
            anim.play('WinMoneyUp');
        } else {
            var anim = this.lose.getComponent(cc.Animation);
            anim.play('LoseAnimation');
        }
    }

    // AtCard Area
    //when End Game
    removeAtCards() {
        this.atCount = 0
        let children = this.atGroup.children
        children.forEach(node => {
            node.getChildByName('active').active = false
        })
    }
    
    _addAtCard() {
        let children = this.atGroup.children
        children[this.atCount].getChildByName('active').active = true
        this.atCount < 3 && this.atCount++
    }
    
    _setHistoryAtCards(atCardCount) {
        for (i = 0; i < atCardCount; i++) {
            this._addAtCard()
        }
    }

    // Bet Left Area
    _switchBetInteractable(isEnable) {//when playing, user cannot change the bet value, this functiuon turn on/off the interactable of toggle group
        let children = this.toggleGroup.children
        children.forEach(node => {
            node.getComponent(cc.Toggle).interactable = isEnable
        })
    }
    
    _updateJackpotValue(jackpotValue) {
        this.jackpotValue = jackpotValue
        this.lblJackpotValue.string = utils.numberFormat(jackpotValue)
    }
    
    _updateBetAndJackpotValue(bet, jackpot, betIndex) {//Update jackpot Value and bet when click bet
        this.betIndex = betIndex
        this.betValue = bet
        this._updateJackpotValue(jackpot)
    }
    
    updateBetAndJackpotValues() {
        let children = this.toggleGroup.children
        const betValues = app.highLowContext.betValues
        const jackpotValues = app.highLowContext.jackpotValues
        children.forEach((item, index) => {
            const bet = betValues[index]
            const jackpot = jackpotValues[index]
            const betIndex = index
            item.getComponentInChildren(cc.Label).string = GameUtils.formatBalanceShort(bet)
            item._data = { bet, jackpot, betIndex }
            if (index === this.betIndex) {
                this._updateBetAndJackpotValue(bet, jackpot, betIndex)
                item.getComponent(cc.Toggle).check()
            }
        })
    }
    
    setHistoryBetAndJackpotValue(bet, jackpot, betIndex) {
        this._updateBetAndJackpotValue(bet, jackpot, betIndex)
        let itemToggleFirst = this.toggleGroup.children[0]
        let itemToggle = this.toggleGroup.children[betIndex]
        itemToggleFirst.getComponent(cc.Toggle).isChecked = false
        itemToggleFirst.getChildByName('title').color = this.betUnHilightColor
        itemToggle.getComponent(cc.Toggle).isChecked = true
        itemToggle.getChildByName('title').color = this.betHilightColor
    }

    _loadBetAndJackpotValues() {//initBetAndJackpotValue
        this._generateNewBtnBet()
    }
    
    _generateNewBtnBet() {
        CCUtils.clearAllChildren(this.toggleGroup)
        let betValues = app.highLowContext.betValues
        betValues.forEach((bet, idx)=> {
            let item = cc.instantiate(this.itemBet)
            item.active = true
            this.toggleGroup.addChild(item)
            warn(bet, this.betValue, idx)

            if ((this.betValue && this.betValue === bet)
                || (!this.betValue && idx === 0)) {
                let title = item.getChildByName("title");
                title && (title.color = this.betHilightColor);
            }
        })

        this.updateBetAndJackpotValues()
    }

    //Card Spin Area
    playSpinCard(data, duration = 1) {
        this.isSpinning = true
        this.card.startAnimate(duration, data.card, () => { this._spinCallback(data) })
    }
    
    _spinCallback(data) {
        this.isSpinning = false
        this._switchInteractableHighLowBtns(true)
        this._updateNextWinAmount(data.nextAboveAmount, data.nextBelowAmount, data.winAmount)
        this.winAmount = data.winAmount
        if (this._checkBetWin(data)) {
            data.jackpot && this._updateJackpotValue(data.jackpot)
            this._handleValueCard(data.card)
            if (!data.playing) {
                this._addResult(data.card)
            }
            if (data.remainTime > 0) {
                app.highLowContext.setStartTime()
                app.highLowContext.tempDuration = data.remainTime
            }
            if (this.resultCount > 9) {
                this.cardResultsScrollView.scrollToRight(0.5)
            }
            if (this.atCount === 3) {
                this._jackpotWin(data.winAmount)
            }
        } else {
            this._showResult()
            this.scheduleOnce(this.onEndBtnClicked, 2)
        }
    }
    
    _handleValueCard(cardValue) {
        if (cardValue < 8) {
            this._addAtCard()
            this.btnHigh.getComponent(cc.Button).interactable = false
        } else if (cardValue < 12) {
            this.btnLow.getComponent(cc.Button).interactable = false
        }
    }
    
    _checkBetWin(data) {
        if (data.start === undefined && data.win !== undefined && !data.win) {
            app.highLowContext.playing = false
            app.highLowContext.startTime = null
            this._switchInteractableHighLowBtns(false)
            this._stopTimer()
            return false
        }
        return true
    }

    _jackpotWin(money) {
        app.jarManager.jarExplosive({
            username: utils.getMeDisplayName(),
            money: money,
            message: "Chúc mừng bạn đã nổ hũ game Cao Thấp"
        })
        app.highLowContext.playing = false;
        app.highLowContext.startTime = null;
        this._showResult();
        this.onEndBtnClicked();
    }
    
    //hide and show cark streak
    enableCardStreak() {
        this.startBtn.active = false
        this.card.node.active = true
    }
    
    disableCardStreak() {
        this.startBtn.active = true
        this.card.node.active = false
    }

    setEnableBtnEnd(isEnable) {
        this.btnEnd.interactable = isEnable
    }

    // Play Area
    _updateNextWinAmount(nextAboveAmount = 0, nextBelowAmount = 0, winAmount = 0) {
        this.lblNextAboveAmount.string = utils.numberFormat(nextAboveAmount)
        this.lblNextBeloveAmount.string = utils.numberFormat(nextBelowAmount)
        this.lblWinAmount.string = utils.numberFormat(winAmount)
    }
    
    _switchInteractableHighLowBtns(isEnable) {
        this.btnHigh.getComponent(cc.Button).interactable = isEnable
        this.btnLow.getComponent(cc.Button).interactable = isEnable
    }

    // Result Area
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
        item.active = true
    }
    
    _removeCardResults() {
        this.resultCount = 0
        this.cardResultsContent.removeAllChildren()
    }

    /** TIMER AREA **/
    _startTimer() {
        // app.highLowContext.startTime = app.highLowContext.now()// fake
        this.schedule(this._updateTimer, 1);
    }

    _stopTimer() {
        this.unschedule(this._updateTimer);
        this.remainingTime.string = "01:00";
    }

    _updateTimer() {
        let remainingTime = app.highLowContext.getRemainingTime();
        this.remainingTime.string = remainingTime
    }

    /** Click pop up **/
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
    
    onInfoBtnClicked() {
        if (this._initInfoHistory()) {
            var miniHighLowPopupController = this.highLowInfoPopup.getComponent(HighLowInfoPopup);
            miniHighLowPopupController.openPopup(true);
        }
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
    
    _initInfoHistory() {
        if (this.highLowInfoPopup) return true;
        if (this.highLowInfoPrefab) {
            this.highLowInfoPopup = cc.instantiate(this.highLowInfoPrefab);
            this.highLowInfoPopup.active = false;
            app.system.getCurrentSceneNode().addChild(this.highLowInfoPopup);
            return true;
        }

        return false;
    }

    showError(error) {
        if (error.message) {
            this._showErroMessage(error.message);
        } else {
            this._showErroMessage(HighLowErrorCode.valueOf(error.code));
        }

        if (error.code === HighLowErrorCode.PLAYER_NOT_PLAY.code ||
            error.code === HighLowErrorCode.SESSION_ALREADY_FINISHED.code) {
            this._reset()
        }
    }

    _showErroMessage(msg) {
        app.system.showToast(msg);
    }
}

app.createComponent(MiniHighLowPopup);