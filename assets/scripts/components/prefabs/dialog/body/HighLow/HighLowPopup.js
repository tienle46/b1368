import BasePopup from 'BasePopup';
import CardStreak from 'CardStreak';
import HighLowContext from "HighLowContext";

class HighLowPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            startBtn : cc.Node,
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
    
    
    enableCardStreak() {
        this.startBtn.active = false
        this.card.node.active = true
    }
    disableCardStreak() {
        this.startBtn.active = true
        this.card.node.active = false
    }
    
    onStartBtnClicked() {
        this.enableCardStreak()
        
        // app.highLowContext.sendEnd(1000);
        app.highLowContext.sendStart(1000);
    }
    
    playSpinCard(cardValue, duration = 3) {
        if(this.card.node.active == true && !this.isSpinning){
            this.isSpinning = true
            this.card.spinToCard(cardValue, duration, () => {
                this.isSpinning = false
                if(cardValue < 8) {
                    let children = this.atGroup.children
                    children[this.atCount].getComponent(cc.Sprite).spriteFrame = this.highLowAtlas.getSpriteFrame('A-2')
                    this.atCount ++
                }
            })
        }
    }
    
    onHigherBetBtnClicked() {
        app.highLowContext.sendGetPlay(1000, 1);
    }
    onLowerBetBtnClicked() {
        app.highLowContext.sendGetPlay(1000, 0);
    }

    onEnable() {
        super.onEnable();
    }

    onBtnCloseClicked(){
        this.disableCardStreak()
        app.highLowContext.popup = null;
        super.onBtnCloseClicked()
    }
    
    onDisable() {
        super.onDisable();
    }

}

app.createComponent(HighLowPopup);