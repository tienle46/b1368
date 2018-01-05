import app from 'app';
import BasePopup from 'BasePopup';
import MiniPokerGuidePopup from 'MiniPokerGuidePopup';
import MiniPokerTopPopup from 'MiniPokerTopPopup';
import MiniPokerHistoryPopup from 'MiniPokerHistoryPopup';
import CardStreak from 'CardStreak';
import MiniPokerContext from 'MiniPokerContext';
import MiniPokerCardType from 'MiniPokerCardType';
import MiniPokerErrorCode from 'MiniPokerErrorCode';
import GameUtils from 'GameUtils';

class MiniPokerPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            lblGold: cc.Label,

            // Toggle groups:
            lblBet1: cc.Node,
            lblBet2: cc.Node,
            lblBet3: cc.Node,

            // Btn spin
            btnSpin: cc.Node,

            // Body:
            body: cc.Node,

            // Prefabs:
            popupGuidePrefab: cc.Prefab,
            popupTopPrefab: cc.Prefab,
            popupHistoryPrefab: cc.Prefab,

            // Motion blur card streak:
            cardContainer: cc.Node,
            cardStreak1: CardStreak,
            cardStreak2: CardStreak,
            cardStreak3: CardStreak,
            cardStreak4: CardStreak,
            cardStreak5: CardStreak,

            // Win money label
            lblWinMoney: cc.Label,

            // Total Hu money label
            lblHuMoney: cc.Label,

            // Quick spin check box
            quickSpinToggle: cc.Toggle
        });

        this.popupGuide = null;
        this.popupTop = null;
        this.popupHistory = null;
        // this.enableSpin = true;
        this.toggleEnableColor = new cc.Color(255, 12, 12, 255);
        this.toggleDisableColor = new cc.Color(0, 0, 0, 255);
        this.isSpinning = false;

    }

    onDestroy() {
        super.onDestroy();

        app.miniPokerContext.popup = null;
    }

    onLoad() {
        super.onLoad();

        this.body && this.body.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);

        (!app.miniPokerContext) && (app.miniPokerContext = new MiniPokerContext());
        (app.miniPokerContext) && (app.miniPokerContext.popup = this);
    }

    onEnable() {
        super.onEnable();

        // warn(cc.kCCRepeatForever);
        if (app.miniPokerContext.subInterval === 0 ||
            this._getCurTime() - app.miniPokerContext.lastSpinTime > app.miniPokerContext.subInterval) {
            this.scheduleOnce(this._subscribe, .2)
        }
        this.updateBalance();
        this.loadBetConfig();
        this.updateJarMoneys();

        (app.miniPokerContext) && (app.miniPokerContext.sendGetConfig());
    }

    _scheduleSubscribe() {
        var interval = (app.miniPokerContext.spinInterval / 1000) || 30;

        this.schedule(this._subscribe, interval);
    }

    _unscheduleSubscribe() {
        this.unschedule(this._subscribe);
    }

    _subscribe() {
        app.miniPokerContext.sendSubscribe();

        this._scheduleSubscribe();
    }

    _onTouchMove(evt) {
        var delta = evt.touch.getDelta();
        var curPos = this.body.position;
        curPos = cc.p(curPos.x + delta.x, curPos.y + delta.y);
        this.body.position = curPos;
    }

    _initPopupGuide() {
        if (!this.popupGuidePrefab) return;
        if (!this.popupGuide) {
            this.popupGuide = cc.instantiate(this.popupGuidePrefab);
            this.popupGuide.active = false;
            this.popupGuide.position = cc.p(0,0);
            this.addNode(this.popupGuide);
            this.parentNode.addChild(this.popupGuide, 20);
        }
    }

    _initPopupTop() {
        if (!this.popupTopPrefab) return;
        if (!this.popupTop) {
            this.popupTop = cc.instantiate(this.popupTopPrefab);
            this.popupTop.active = false;
            this.popupTop.position = cc.p(0,0);
            this.addNode(this.popupTop);
            this.parentNode.addChild(this.popupTop, 30);
        }
    }

    _initPopupHistory() {
        if (!this.popupHistoryPrefab) return;
        if (!this.popupHistory) {
            this.popupHistory = cc.instantiate(this.popupHistoryPrefab);
            this.popupHistory.active = false;
            this.popupHistory.position = cc.p(0, 0);
            this.addNode(this.popupHistory);
            this.parentNode.addChild(this.popupHistory, 40);
        }
    }

    onBtnCloseClicked() {
        if (this.isSpinning) return;

        if (this.quickSpinToggle.isChecked) {
            this.quickSpinToggle.uncheck();
        }
        this._unscheduleSubscribe();
        super.onBtnCloseClicked();
    }

    onBtnInfoClicked() {
        this._initPopupGuide();
        if (!this.popupGuide) return;

        var popupGuideController = this.popupGuide.getComponent(MiniPokerGuidePopup);
        popupGuideController && popupGuideController.openPopup(true);
    }

    onBtnHistoryClicked() {
        this._initPopupHistory();
        if (!this.popupHistory) return;

        var popupHistoryController = this.popupHistory.getComponent(MiniPokerHistoryPopup);
        popupHistoryController && popupHistoryController.openPopup(true);
    }

    onBtnTopClicked() {
        this._initPopupTop();
        if (!this.popupTop) return;

        var popupTopController = this.popupTop.getComponent(MiniPokerTopPopup);
        popupTopController && popupTopController.openPopup(true);
    }

    onBtnQuickSpinClicked() {
        // this.quickSpinToggle && this.quickSpinToggle.check();
        if (this.quickSpinToggle) {
            if (this.quickSpinToggle.isChecked)
                this.quickSpinToggle.uncheck();
            else
                this.quickSpinToggle.check();
        }
    }

    onQuickSpinStateChanged() {
        // var btnSpinController = this.btnSpin.getComponent(cc.Button);
        // btnSpinController && (btnSpinController.interactable = !this.quickSpinToggle.isChecked);

        this._checkQuickSpin();
    }

    _checkQuickSpin() {
        if (app.miniPokerContext.checkResultQueue()) return;
        if (this.isSpinning) return;
        if (!this.quickSpinToggle.isChecked) {
            this.unschedule(this.onBtnSpinClicked);
            return;
        }

        var delay = (app.miniPokerContext.lastSpinTime + app.miniPokerContext.spinInterval - this._getCurTime()) / 1000;
        // warn('delay', delay);
        if (delay <= 0) {
            this.onBtnSpinClicked();
        } else {
            this.scheduleOnce(this.onBtnSpinClicked, delay);
        }
    }

    testSpin() {
        var min = 4;
        var max = 55;
        this.cardStreak1.spinToCard(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    onBtnSpinClicked() {
        var anim = this.btnSpin.getComponent(cc.Animation);
        anim.play("ButtonSpinAnimation");

        // this.testSpin();
        // return;

        if (!app.miniPokerContext.isLoadedConfig) return;

        if (!app.miniPokerContext.checkCurrentMoney()) return;

        var checkSpinTime = this._checkSpinTime();

        if (checkSpinTime) {
            app.miniPokerContext.sendPlay(app.miniPokerContext.curBetValue);
            // this.enableSpin = false;
            this._unscheduleSubscribe();
            this._scheduleSubscribe();
        } else {
            this.showError("Bạn đã quay quá nhanh");
        }
    }

    _checkSpinTime() {
        if (app.miniPokerContext.lastSpinTime <= 0) {
            var date = new Date();
            app.miniPokerContext.lastSpinTime = date.getTime();
            return true;
        }

        var date = new Date();
        var curTime = date.getTime();
        if (curTime - app.miniPokerContext.lastSpinTime >= app.miniPokerContext.spinInterval) {
            // app.miniPokerContext.lastSpinTime = curTime;
            return true;
        }
        return false;
    }

    _getCurTime() {
        var date = new Date();
        return date.getTime();
    }

    onBtnBet1Clicked() {
        app.miniPokerContext.updateCurBet(0);

        this.lblBet1.color = this.toggleEnableColor;
        this.lblBet2.color = this.toggleDisableColor;
        this.lblBet3.color = this.toggleDisableColor;

        this.updateJarMoneys();
    }

    onBtnBet2Clicked() {
        app.miniPokerContext.updateCurBet(1);

        this.lblBet1.color = this.toggleDisableColor;
        this.lblBet2.color = this.toggleEnableColor;
        this.lblBet3.color = this.toggleDisableColor;

        this.updateJarMoneys();
    }

    onBtnBet3Clicked() {
        app.miniPokerContext.updateCurBet(2);

        this.lblBet1.color = this.toggleDisableColor;
        this.lblBet2.color = this.toggleDisableColor;
        this.lblBet3.color = this.toggleEnableColor;

        this.updateJarMoneys();
    }

    updateBalance() {
        this.lblGold.string = GameUtils.formatNumberType1(app.context.getMeBalance());
    }

    updateJarMoneys() {
        this.lblHuMoney.string = GameUtils.formatNumberType1(app.miniPokerContext.getCurJackpotMoney());
    }

    loadBetConfig() {
        this.lblBet1.getComponent(cc.Label).string = GameUtils.formatBalanceShort(app.miniPokerContext.betValues[0]);
        this.lblBet2.getComponent(cc.Label).string = GameUtils.formatBalanceShort(app.miniPokerContext.betValues[1]);
        this.lblBet3.getComponent(cc.Label).string = GameUtils.formatBalanceShort(app.miniPokerContext.betValues[2]);
    }

    showError(error) {
        if (error.message) {
            this._showErrorMessage(error.message);
        } else {
            this._showErrorMessage(MiniPokerErrorCode.valueOf(error.code));
        }
    }

    _showErrorMessage(msg) {
        app.system.showLongToast(msg);
    }

    showResult(data) {
        var isWin = data.win;
        var winAmount = data.winAmount || 0;
        var bet = data.bet || 0;
        var cardType = data.cardType || 0;
        var cards = data.cards;
        if (data.jackpots) {
            app.miniPokerContext.jackpotValues = data.jackpots;
        }
        this.isSpinning = true;
        this.cardStreak1.spinToCard(cards[0], 3);
        this.cardStreak2.spinToCard(cards[1], 3.25);
        this.cardStreak3.spinToCard(cards[2], 3.5);
        this.cardStreak4.spinToCard(cards[3], 3.75);
        this.cardStreak5.spinToCard(cards[4], 4, function () {
            this.isSpinning = false;
            if (isWin && winAmount > 0) {
                this._showWinMoney(cardType, winAmount);
            }
            this.updateBalance();
            this.updateJarMoneys();
            this._checkQuickSpin();
        }.bind(this));
    }

    _showWinMoney(cardType, winAmount) {
        if (cardType === MiniPokerCardType.THUNG_PHA_SANH_J) {
            var username = app.context.getMeDisplayName();
            var money = winAmount;
            var message = "Chúc mừng bạn đã nổ hũ game Mini Poker.";
            app.jarManager.jarExplosive({
                username, money, message
            });
        } else {
            this.lblWinMoney && (this.lblWinMoney.string = MiniPokerCardType.getNameForType(cardType) + " +" + winAmount);
            var anim = this.lblWinMoney.node.getComponent(cc.Animation);
            anim.play("WinMoneyUp");
        }
    }
}

app.createComponent(MiniPokerPopup);
