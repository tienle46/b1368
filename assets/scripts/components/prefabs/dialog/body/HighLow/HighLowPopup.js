import BasePopup from 'BasePopup';
import CardStreak from 'CardStreak';
import HighLowContext from "HighLowContext";

class HighLowPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            playFrame : cc.Sprite,
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
        this.playFrame.node.active = false
        this.card.node.active = true
    }
    disableCardStreak() {
        this.playFrame.node.active = true
        this.card.node.active = false
    }
    
    onStartBtnClicked() {
        this.enableCardStreak()
        
        app.highLowContext.sendStart(1000);
        app.highLowContext.sendGetPlay(1000);
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

    onDisable() {
        this.disableCardStreak()
        super.onDisable();
        app.highLowContext.popup = null;
    }

}

app.createComponent(HighLowPopup);