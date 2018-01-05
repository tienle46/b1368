import BasePopup from 'BasePopup';
import CardStreak from 'CardStreak';
import HighLowContext from "HighLowContext";

class MiniHighLowPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            startBtn: cc.Node,
            card: CardStreak,
            highLowAtlas: cc.SpriteAtlas,
            atGroup: cc.Node,
        });
        this.atCount = 0
        this.isSpinning = false
    }

    _commonInit() {
        (!app.highLowContext) && (app.highLowContext = new HighLowContext());
        (app.highLowContext) && (app.highLowContext.popup = this);
    }

    onLoad() {
        super.onLoad()

        this._commonInit()
    }
    
    onBtnCloseClicked() {
        this.disableCardStreak()
        app.highLowContext.popup = null;
        super.onBtnCloseClicked()
    }

    onStartBtnClicked() {
        this.enableCardStreak()

        // app.highLowContext.sendEnd(1000);
        app.highLowContext.sendStart(1000);
    }

    onHigherBetBtnClicked() {
        if (!this.isSpinning) {
            app.highLowContext.sendGetPlay(1000, 1);
        }
    }
    onLowerBetBtnClicked() {
        if (!this.isSpinning) {
            app.highLowContext.sendGetPlay(1000, 0);
        }
    }

    onEndBtnClicked() {
        app.highLowContext.sendEnd(1000);
    }

    onReceivedStart(cardValue) {
        this.playSpinCard(cardValue, 0)
        this.enableCardStreak()
    }

    onReceivedPlay(cardValue) {
        this.playSpinCard(cardValue)
    }

    enableCardStreak() {
        this.startBtn.active = false
        this.card.node.active = true
    }
    disableCardStreak() {
        this.startBtn.active = true
        this.card.node.active = false
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